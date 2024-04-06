import sys,io
from decimal import Decimal, getcontext
from flask import Blueprint, render_template,session, request, redirect, url_for
from .sql_strings import Sql_Strings as SQL_STRINGS
from app.modules.conf.conf_postgres import qry, sql
from app.utils.misc import (
    login_required,
    handleResponseError,
    handleResponse
)

mod = Blueprint('compras', __name__)

getcontext().prec = 2
IVA = Decimal('0.16') 

@mod.route('/mis_compras', methods = ["GET"])
@login_required
def mi_compras_template():
    try:
        result_compras = qry(SQL_STRINGS.GET_MIS_COMPRAS_BY_USER_ID, {'user_id': session.get('user_id', 0)})
        for result in result_compras:
            precio = Decimal(result['precio'])
            cantidad = Decimal(result['cantidad'])
            result['iva'] = (precio * cantidad * IVA).quantize(Decimal('0.01'))
            result['total'] = (precio * cantidad + result['iva']).quantize(Decimal('0.01'))
        return render_template('mis-compras.html', compras=result_compras)
    except Exception as e:
        print(f"Ocurrio un error en @mi_compras_template/{e} en la linea {sys.exc_info()[-1].tb_lineno}")
        return render_template('404.html')

@mod.route('/wishlist', methods=["GET"])
@login_required
def wishlist_template():
    try:
        id_usuario = session['user_id']
        wishlist_arr = qry(SQL_STRINGS.DESIRED_PRODUCT, {'id_usuario': id_usuario})
        if not wishlist_arr:
            wishlist_arr = []
        return render_template('wishlist.html', wishlist=wishlist_arr)
    except Exception as e:
        print(e)
        return render_template('404.html')
    

@mod.route('/buy', methods=['POST'])
@login_required
def buy():
    try:
        data = request.get_json()

        user_id = data.get('user_id', 0)
        products = data.get('products', [])

        if not user_id  \
        or not products:
            return handleResponseError('Faltan campos obligatorios', 400)
        
        user_result = qry(SQL_STRINGS.GET_USER_COUNT_BY_ID, {'id': user_id}, True)
        if not user_result['count']:
            return handleResponseError('El usuario no existe', 400)
        if user_id != session.get('user_id', False):
            return handleResponseError('El usuario no coincide', 400)
        
        product_insert_values = ''
        for product in products:
            product_result = qry(SQL_STRINGS.GET_PRODUCT_COUNT_BY_ID, {'id_producto': product.get('id', 0)}, True)
            if not product_result['count']:
                return handleResponseError('Uno de los productos especificados no coindicen, favor de verificar la compra.', 400)
        
            # Añadir un formato de tupla para cada producto y formatear directamente con sus valores
            product_insert_values += '({}, {}, {}), '.format(product['cantidad'], product['id'], user_id)
        
        # Remover la última coma y espacio si hay productos
        if product_insert_values:
            product_insert_values = product_insert_values.rstrip(', ')

            
        result_insert_products = sql(SQL_STRINGS.INSERT_BUY_PRODUCTS.format(product_insert_values))

        if not result_insert_products:
            return handleResponseError('Error al registrar los productos comprados', 500)
        
        # ALL OK
        return handleResponse({'message': 'Compras registradas correctamente'})
    except Exception as e:
        print("Ocurrio un error en @buy/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error inesperado en el servidor: {}'.format(e))
    