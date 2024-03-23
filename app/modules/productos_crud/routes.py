import sys, io, base64
from flask import Blueprint, request, render_template, jsonify, send_file, session
from app.utils.misc import (
    handleResponseError, 
    handleResponse,
    val_req_data
)
from app.modules.conf.conf_postgres import qry, sql, sqlv2
from PIL import Image as PILImage
from werkzeug.utils import secure_filename
from .sql_strings import Sql_Strings as SQL_STRINGS
from .schemas import new_product_scheme
mod = Blueprint('productos_crud', __name__)

@mod.route('/', methods=['GET'])
def productos_crud_template():
    products_arr = None 
    try:
        products_arr = qry(SQL_STRINGS.GET_PRODCTS)
    except Exception as e:
        print(e)
        return render_template('404.html')
    finally:
        if not products_arr:
            products_arr = []
        return render_template('productos-CRUD.html', productos=products_arr)    
    


@mod.route('/nuevo', methods=['POST'])
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
    

@mod.route('/imagen_producto/<int:id_producto>', methods=['POST'])
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
        print(request.files)
        filename = None
        img_byte_arr = None
        
        # Convertir la imagen a bytes usando Pillow
        if imagen_file:
            filename = secure_filename(imagen_file.filename)
            image = PILImage.open(imagen_file.stream)
            
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='PNG')
            img_byte_arr = img_byte_arr.getvalue()
            
            rows_affected = sql(SQL_STRINGS.UPDATE_PRODUCT_IMAGE_BY_ID, {'id_producto': id_producto, 'imagen': img_byte_arr, 'nombre_imagen': filename})
            if rows_affected:
                encoded_img = base64.b64encode(img_byte_arr).decode('utf-8')
                return jsonify({'filename': filename, 'image_base64': encoded_img})
            else:
                raise Exception ('La imagen no se inserto correctamente')
            
        else:
            raise Exception('No hay imagen')
    except Exception as e:
        print("Ocurrio un error en @guardar_imagen_producto/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error en el servidor: {}'.format(e))


@mod.route('/imagen_producto/<int:id_producto>', methods=['GET'])
def obtener_imagen_producto(id_producto):
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
        imagen = result_image.get('srv_imagen', None)
        nombre_imagen = result_image.get('srv_nombre_imagen', None)
        if imagen:
            # Converitr los bits a imagen
            img_io = io.BytesIO(imagen)
            img_io.seek(0)
            
            return send_file(img_io, mimetype='image/png')
        else: 
            return handleResponseError('No se encontró la imágen', 404)
    except Exception as e:
        print("Ocurrio un error en @obtener_imagen_producto/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error en el servidor: {}'.format(e)) 
    
    
@mod.route('/obtener_productos/<int:id_producto>', methods=['GET'])
def obtener_producto(id_producto):
    try:
        if not id_producto:
            return handleResponseError('Producto faltante', 400)
        
        # Comprobar si el producto existe
        result = qry(SQL_STRINGS.GET_PRODCT_BY_ID, {'id_producto': id_producto}, True)
        
        # Convertir la imagen a Base64
        imagen_base64 = base64.b64encode(result['imagen']).decode('utf-8')
        result['imagen'] = imagen_base64
        
        return jsonify(result)
    except Exception as e:
        print(e)
        return handleResponseError('Error al obtener los productos', 500)
