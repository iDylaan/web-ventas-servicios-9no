import sys, base64
from flask import Blueprint, render_template, url_for, redirect, request, session
from app.utils.misc import (
    handleResponseError, 
    handleResponse,
    val_req_data,
    default_converter
)
from .sql_strings import Sql_Strings as SQL_STRINGS
from app.modules.conf.conf_postgres import qry,sql
from app.utils.misc import login_required, handleResponse
from decimal import Decimal, ROUND_HALF_UP
from .schemes import like_scheme

mod = Blueprint('shop', __name__) 


# CONSTANTES
IVA = Decimal('0.16') # Porcentaje (16%)


@mod.route('/', methods=['GET'])
def shop_template():
    products_arr = None 
    try:
        products_arr = qry(SQL_STRINGS.GET_PRODCTS)
    except Exception as e:
        print(e)
        return render_template('404.html')
    finally:
        if not products_arr:
            products_arr = []
        return render_template('shop.html', productos=products_arr)


@mod.route('/detalles/<int:id_producto>', methods=['GET'])
@login_required
def product_details_template(id_producto):
    product = None
    id_usuario = session['user_id']
    try:
        product = qry(SQL_STRINGS.GET_PRODCT_BY_ID, {'id_producto':id_producto}, True)
        result = qry(SQL_STRINGS.GET_DESIRED_PRODUCT_COUNT_BY_ID,{
            'id_servicio':id_producto,
            'id_usuario':id_usuario
            }, True)
        
        if product:
            print(id_producto)
            print(id_usuario)
            print(result['count'])
            product['liked'] = bool(result['count'])
            print(product['liked'])
            return render_template('product-details.html', producto=product)
        else:
            return render_template('404.html')
    except Exception as e:
        print(e)
        return render_template('404.html')


@mod.route('/checkout', methods=['POST', 'GET'])
@login_required
def checkout():
    if request.method == 'POST':
        try:
            data = request.get_json()
            productos_arr = data.get('productos')
            productos_ids_arr = [producto['id'] for producto in productos_arr]
            
            productos_result = qry(SQL_STRINGS.GET_PRODUCTS_CHEKOUT_INFO_BY_ID, (tuple(productos_ids_arr),))

            # Calcular el resumen del pedido 
            for product in productos_result:
                for cart_producto in productos_arr:
                    if cart_producto['id'] == product['id']:
                        product['cantidad'] = cart_producto['cantidad']
                        precio = Decimal(product['precio'])
                        cantidad = Decimal(product['cantidad'])
                        subtotal = precio * cantidad
                        product['subtotal'] = subtotal.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

            # Guardar los productos
            session['productos_checkout'] = productos_result

            return handleResponse({'message': 'OK'})
        except Exception as e:
            print('Error: {}'.format(e))
            return render_template('404.html')
    else:  # GET
        productos_arr = session.get('productos_checkout', [])
        # Obtener iva y total
        total = Decimal('0.0')
        for product in productos_arr:
            total += Decimal(product['subtotal'])
        total_iva = (total * IVA).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        total = (total + total_iva).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        response = render_template('checkout.html', 
            productos=productos_arr, 
            total=total, 
            iva=total_iva, 
            user_id=session.get('user_id', 0)
        )
        if 'productos_checkout' in session:
            session.pop('productos_checkout')
        
        return response


@mod.route('/carrito', methods=['GET'])
def cart_template():
    ids = request.args.get('ids')
    productos = []
    try:
        if ids:
            ids_list = ids.split(',')   
            productos = qry(SQL_STRINGS.GET_PRODUCTS_BY_ID, (tuple(ids_list),))
    except Exception as e:
        print("Ocurrio un error en @cart_template/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        productos = []
    finally:
        return render_template('cart.html', productos=productos)
    
@mod.route('/like', methods=['POST'])
@login_required
def like():
    try:
        data = request.get_json()

        # Recibir datos
        id_servicio = data.get('dataId', None)
        id_usuario = data.get('dataAnother', None)
        print (id_servicio, id_usuario)

        # Validar datos requeridos
        if not id_servicio \
        or not id_usuario:
            return handleResponseError('Error al recibir datos', 400)

        # Crear el diccionario del nuevo producto
        new_like_dict = {
        'id_servicio': id_servicio,
        'id_usuario': id_usuario,
        }

        # Validar formato de los datos
        errors = val_req_data(new_like_dict, like_scheme)
        if errors:
            print("Error: ", errors)
            return handleResponseError(errors, 400)

        result = qry(SQL_STRINGS.GET_DESIRED_PRODUCT_COUNT_BY_ID, new_like_dict, True)
        
        qry_like= SQL_STRINGS.DELET_DESIRED_PRODUCT if result['count'] \
            else SQL_STRINGS.INSERT_DESIRED_PRODUCT
            
        rows_affected = sql(qry_like, new_like_dict)

        # Validar filas afectadas
        if rows_affected:
            return handleResponse({'message': 'Producto deseado registrado exitosamente'})
        else:
            raise handleResponseError('No se pudo registrar el producto deseado.')

    except Exception as e:
        print("Ocurrio un error en @like/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error inesperado en el servidor: {}'.format(e))
        
