import sys, io, base64, json
from flask import Blueprint, request, render_template, jsonify, redirect, abort
from app.utils.misc import (
    handleResponseError, 
    handleResponse,
    val_req_data,
    admin_required,
    cloudinary_upload_image
)
from app.modules.conf.conf_postgres import qry, sql, sqlv2
from PIL import Image as PILImage
from werkzeug.utils import secure_filename
from .sql_strings import Sql_Strings as SQL_STRINGS
from .schemas import new_product_scheme

mod = Blueprint('productos_crud', __name__)

@mod.route('/', methods=['GET'])
@admin_required
def productos_crud_template():
    products_arr = None 
    products_json  = []
    try:
        products_arr = qry(SQL_STRINGS.GET_PRODCTS)
        for product in products_arr:
            product_json = {
                'id': product['id'],
                'titulo': product['titulo'],
                'descripcion': product['descripcion'],
                'descripcion_previa': product['descripcion_previa'],
                'info': product['info'],
                'precio': product['precio'],
                'fecha_creado': product['fecha_creado'],
                'activo': product['activo'],
                'imagen_exist': product['imagen'] is not None
            }
            products_json.append(product_json)
    except Exception as e:
        print(e)
        return render_template('404.html')
    finally:
        if not products_arr:
            products_arr = []
        # products_json = json.dumps(products_arr, default=default_converter)
        return render_template('productos-CRUD.html', productos=products_arr, productos_json=products_json)    
    


@mod.route('/nuevo', methods=['POST'])
@admin_required
def nuevo_producto():
    try:
        data = request.get_json()
        
        # Recibir datos
        titulo = data.get('titulo', None)
        descripcion = data.get('descripcion', None)
        descripcion_corta = data.get('descripcion_corta', None)
        info = data.get('info', None)
        precio = data.get('precio', None)
        
        # Validar datos requeridos
        if not titulo \
        or not descripcion \
        or not descripcion_corta \
        or not info \
        or not precio:
            return handleResponseError('Faltan campos obligatorios', 400)
        
        # Crear el diccionario del nuevo producto
        new_product_dict = {
            'titulo': titulo,
            'descripcion': descripcion,
            'descripcion_corta': descripcion_corta,
            'info': info,
            'precio': precio
        }
        
        # Validar formato de los datos
        errors = val_req_data(new_product_dict, new_product_scheme)
        if errors:
            print("Error: ", errors)
            return handleResponseError(errors, 400)
        
        # Guardar el nuevo producto en la DB
        rows_affected, id_of_new_row = sqlv2(SQL_STRINGS.INSERT_NEW_PRODUCT, new_product_dict, True)
        
        # Validar filas afectadas 
        if rows_affected:
            return handleResponse({'message': 'Producto registrado exitosamente', 'id_producto': id_of_new_row})
        else:
            raise handleResponseError('No se pudo registrar el producto.')
        
    except Exception as e:
        print("Ocurrio un error en @nuevo_producto/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error inesperado en el servidor: {}'.format(e))
    

@mod.route('/editar/<int:id_producto>', methods=['POST'])
@admin_required
def editar_producto(id_producto):
    try: 
        data = request.get_json()
        
        # Validar que venga el id_producto
        if not id_producto:
            return handleResponseError('Falta el id del producto', 400)
        
        # Validar que el producto exista
        result = qry(SQL_STRINGS.GET_PRODUCT_COUNT_BY_ID, {'id_producto': id_producto}, True)
        product_count = result.get('count', None)
        
        if not product_count:
            return handleResponseError('No se encontró el producto.', 404)
        
        # Recibiar datos del producto
        titulo = data.get('titulo', None)
        descripcion = data.get('descripcion', None)
        descripcion_corta = data.get('descripcion_corta', None)
        info = data.get('info', None)
        precio = data.get('precio', None)
        
        # Validar datos requeridos
        if not titulo \
        or not descripcion \
        or not descripcion_corta \
        or not info \
        or not precio:
            return handleResponseError('Faltan campos obligatorios', 400)
        
        # Crear el diccionario del nuevo producto
        new_product_dict = {
            'titulo': titulo,
            'descripcion': descripcion,
            'descripcion_corta': descripcion_corta,
            'info': info,
            'precio': precio
        }
        
        # Validar formato de los datos
        errors = val_req_data(new_product_dict, new_product_scheme)
        if errors:
            print("Error: ", errors)
            return handleResponseError(errors, 400)
        
        # Agregar el id del producto al diccionario
        new_product_dict['id_producto'] = id_producto
        
        # Guardar el nuevo producto en la DB
        rows_affected = sql(SQL_STRINGS.UPDATE_PRODUCT_BY_ID, new_product_dict)
        
        # Validar filas afectadas
        if rows_affected:
            return handleResponse('Producto actualizado exitosamente')
        else:
            raise handleResponseError('No se pudo actualizar el producto.')
        
    except Exception as e:
        print("Ocurrio un error en @editar_producto/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error en el servidor: {}'.format(e))
    

@mod.route('/eliminar/<int:id_productp>', methods=['POST'])
@admin_required
def eliminar(id_productp):
    try:
        # Validar que venga el id_producto
        if not id_productp:
            return handleResponseError('Falta el id del producto', 400)
        
        # Validar que el producto exista
        result = qry(SQL_STRINGS.GET_PRODUCT_COUNT_BY_ID, {'id_producto': id_productp}, True)
        product_count = result.get('count', None)
        
        if not product_count:
            return handleResponseError('No se encontró el producto.', 404)
        
        rows_affected = sql(SQL_STRINGS.DELETE_PRODUCT_BY_ID, {'id_producto': id_productp})
        
        # Validar filas afectadas
        if rows_affected:
            return handleResponse('Producto eliminado exitosamente')
        else:
            raise handleResponseError('No se pudo eliminar el producto.')
    except Exception as e:
        print("Ocurrio un error en @editar_producto/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error en el servidor: {}'.format(e))

@mod.route('/imagen_producto/<int:id_producto>', methods=['POST'])
@admin_required
def guardar_imagen_producto(id_producto):
    try:
        # Validar que venga el id_producto
        if not id_producto:
            return handleResponseError('Falta el id del producto', 400)
        
        # Validar que el producto exista
        result = qry(SQL_STRINGS.GET_PRODUCT_COUNT_BY_ID, {'id_producto': id_producto}, True)
        product_count = result.get('count', None)
        
        if not product_count:
            return handleResponseError('No se encontró el producto.', 404)
        
        # Recibir el archivo de imagen
        imagen_file = request.files.get('imagen', None)

        upload_result, status = cloudinary_upload_image(imagen_file)

        if status >= 400:
            return handleResponseError('No se ha subido la imagen correctamente, intentelo de nuevo mas tarde', status)
        
        # Convertir la imagen a bytes usando Pillow
        if imagen_file:
            
            rows_affected = sql(SQL_STRINGS.UPDATE_PRODUCT_IMAGE_BY_ID, {'id_producto': id_producto, 'imagen': upload_result.get('image', None)})
            if rows_affected:
                return handleResponse({'image': upload_result.get('image', None)})
            else:
                raise Exception ('La imagen no se inserto correctamente')
            
        else:
            raise Exception('No hay imagen')
    except Exception as e:
        print("Ocurrio un error en @guardar_imagen_producto/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error en el servidor: {}'.format(e))

@mod.route('/imagen_producto_json/<int:id_producto>', methods=['GET'])
@admin_required
def obtener_imagen_producto_json(id_producto):
    try:
        if not id_producto:
            return handleResponseError('Producto faltante', 400)
        
        # Comprobar si el producto existe
        result = qry(SQL_STRINGS.GET_PRODUCT_COUNT_BY_ID, {'id_producto': id_producto}, True)
        product_count = result.get('count', None)
        
        if not product_count:
            return handleResponseError('Producto no encontrado', 404)
        
        # Obtener la imagen
        result_image = qry(SQL_STRINGS.GET_PRODUCT_IMAGE_BY_ID, {'id_producto': id_producto}, True)
            
        # Retornar la imagen del binario
        imagen = result_image.get('image', None)
        return handleResponse({'image': imagen})
    except Exception as e:
        print("Ocurrio un error en @obtener_imagen_producto_json/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error en el servidor: {}'.format(e)) 
    


@mod.route('/imagen_producto/<int:id_producto>', methods=['GET'])
@admin_required
def obtener_imagen_producto(id_producto):
    try:
        if not id_producto:
            return jsonify('')

        # Comprobar si el usuario existe y obtener la imagen
        result_image = qry(SQL_STRINGS.GET_PRODUCT_IMAGE_BY_ID, {'id_producto': id_producto}, True)

        # Si no se encuentra la imagen, opcionalmente redirige a una imagen predeterminada o devuelve un error
        if not result_image or not result_image.get('srv_imagen_url'):
            # return redirect(url_for('ruta_imagen_predeterminada'))
            return abort(404, description="Imagen no encontrada")

        # Si la imagen existe y tiene una URL, redirigir a esa URL
        imagen_url = result_image.get('srv_imagen_url')
        return redirect(imagen_url)

    except Exception as e:
        print(f"Ocurrió un error en @obtener_imagen_usuario/{e} en la línea {sys.exc_info()[-1].tb_lineno}")
        # En caso de error en el servidor, podrías redirigir a una imagen de error o manejarlo de otra manera
        return abort(500, description="Error en el servidor")
    


    
    
@mod.route('/obtener_productos/<int:id_producto>', methods=['GET'])
@admin_required
def obtener_producto(id_producto):
    try:
        if not id_producto:
            return handleResponseError('Producto faltante', 400)
        
        # Comprobar si el producto existe
        result = qry(SQL_STRINGS.GET_PRODCT_BY_ID, {'id_producto': id_producto}, True)
        
        return jsonify(result)
    except Exception as e:
        print(e)
        return handleResponseError('Error al obtener los productos', 500)
