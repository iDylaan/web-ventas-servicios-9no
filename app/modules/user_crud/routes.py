import sys, io, base64
from flask import Blueprint, request, render_template, jsonify, send_file, session
from app.utils.misc import (
    handleResponseError, 
    handleResponse,
    hash_password,
    val_req_data
)
from app.modules.conf.conf_postgres import qry, sql
from PIL import Image as PILImage
from werkzeug.utils import secure_filename
from .sql_strings import Sql_Strings as SQL_STRINGS
from .schemas import new_user_scheme


mod = Blueprint('user_crud', __name__)

@mod.route('/')
def user_crud_template():
    usuarios_arr = None 
    try:
        usuarios_arr = qry(SQL_STRINGS.GET_USERS)
    except Exception as e:
        print(e)
        return render_template('404.html')
    finally:
        if not usuarios_arr:
            usuarios_arr = []
        return render_template('usuario-CRUD.html', usuarios=usuarios_arr)    



@mod.route('/nuevo', methods=['POST'])
def nuevo_usuario():
    try:
        data = request.get_json()
        
        # Recibir datos
        nombre_usuario = data.get('nombre_usuario', None)
        email = data.get('email', None)
        password = data.get('password', None)
        admin = data.get('admin', False)
        
        # Validar datos requeridos
        if not nombre_usuario \
        or not email \
        or not password \
        or not admin:
            return handleResponseError('Faltan campos obligatorios', 400)
        
        # Crear el diccionario del nuevo usuario
        new_user_dict = {
            'nombre_usuario': nombre_usuario,
            'email': email,
            'password': password,
            'admin': admin
        }
        
        # Validar formato de los datos
        errors = val_req_data(new_user_dict, new_user_scheme)
        if errors:
            print("Error: ", errors)
            return handleResponseError(errors, 400)
        
        # Hashear la contraseña
        new_user_dict['password'] = hash_password(password)
        
        # Guardar al nuevo usuario en la DB
        rows_affected = sql(SQL_STRINGS.INSERT_NEW_USER, new_user_dict)
        
        # Validar filas afectadas
        if rows_affected:
            return handleResponse('Usuario registrado exitosamente')
        else:
            raise handleResponseError('No se pudo registrar al usuario.')
        
    except Exception as e:
        print("Ocurrio un error en @nuevo_usuario/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error inesperado en el servidor: {}'.format(e))
    

@mod.route('/editar/<int:id_usuario>', methods=['POST'])
def editar_usuario(id_usuario):
    try: 
        data = request.get_json()
        
        # Validar que venga el id_usuario
        if not id_usuario:
            return handleResponseError('Falta el id del usuario', 400)
        
        # Validar que el usuario exista
        result = qry(SQL_STRINGS.GET_USER_COUNT_BY_ID, {'id_usuario': id_usuario}, True)
        user_count = result.get('count', None)
        
        if not user_count:
            return handleResponseError('No se encontró el usuario.', 404)
        
        # Recibiar datos del usuario
        nombre_usuario = data.get('nombre_usuario', None)
        email = data.get('email', None)
        password = data.get('password', None)
        admin = data.get('admin', False)
        
        # Validar datos requeridos
        if not nombre_usuario \
        or not email \
        or not password \
        or not admin:
            return handleResponseError('Faltan campos obligatorios', 400)
        
        # Crear el diccionario del nuevo usuario
        new_user_dict = {
            'nombre_usuario': nombre_usuario,
            'email': email,
            'password': password,
            'admin': admin
        }
        
        # Validar formato de los datos
        errors = val_req_data(new_user_dict, new_user_scheme)
        if errors:
            print("Error: ", errors)
            return handleResponseError(errors, 400)
        
        # Hashear la contraseña
        new_user_dict['password'] = hash_password(password)

        # Agregar el id del usuario al diccionario
        new_user_dict['id_usuario'] = id_usuario
        
        # Guardar al nuevo usuario en la DB
        rows_affected = sql(SQL_STRINGS.UPDATE_USER_BY_ID, new_user_dict)
        
        # Validar filas afectadas
        if rows_affected:
            return handleResponse('Usuario editado exitosamente')
        else:
            raise handleResponseError('No se pudo editar al usuario.')
        
    except Exception as e:
        print("Ocurrio un error en @editar_usuario/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error en el servidor: {}'.format(e))
    

@mod.route('/imagen_usuario/<int:id_usuario>', methods=['POST'])
def guardar_imagen_usuario(id_usuario):
    try:
        # Validar que venga el id_usuario
        if not id_usuario:
            return handleResponseError('Falta el id del usuario', 400)
        
        # Validar que el usuario exista
        result = qry(SQL_STRINGS.GET_USER_COUNT_BY_ID, {'id_usuario': id_usuario}, True)
        user_count = result.get('count', None)
        
        if not user_count:
            return handleResponseError('No se encontró el usuario.', 404)
        
        # Recibir el archivo de imagen
        imagen_file = request.files.get('imagen', None)
        filename = None
        img_byte_arr = None
        
        # Convertir la imagen a bytes usando Pillow
        if imagen_file:
            filename = secure_filename(imagen_file.filename)
            image = PILImage.open(imagen_file.stream)
            
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='PNG')
            img_byte_arr = img_byte_arr.getvalue()
            
            rows_affected = sql(SQL_STRINGS.UPDATE_USER_IMAGE_BY_ID, {'id_usuario': id_usuario, 'imagen': img_byte_arr, 'nombre_imagen': filename})
            if rows_affected:
                if id_usuario == session['user_id']:
                    session['without_images'] = False
                encoded_img = base64.b64encode(img_byte_arr).decode('utf-8')
                return jsonify({'filename': filename, 'image_base64': encoded_img})
            else:
                raise Exception ('La imagen no se inserto correctamente')
            
        else:
            raise Exception('No hay imagen')
    except Exception as e:
        print("Ocurrio un error en @guardar_imagen_usuario/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error en el servidor: {}'.format(e))


@mod.route('/imagen_usuario/<int:id_usuario>', methods=['GET'])
def obtener_imagen_usuario(id_usuario):
    try:
        if not id_usuario:
            return handleResponseError('Usuario faltante', 400)
        
        # Comprobar si el usuario existe
        result = qry(SQL_STRINGS.GET_USER_COUNT_BY_ID, {'id_usuario': id_usuario}, True)
        user_count = result.get('count', None)
        
        if not user_count:
            return handleResponseError('Usuario no encontrado', 404)
        
        # Obtener la imagen
        result_image = qry(SQL_STRINGS.GET_USER_IMAGE_BY_ID, {'id_usuario': id_usuario}, True)

        # Retornar la url en caso de que sea con URL
        imagen_url = result_image.get('image_url', None)
        if imagen_url:
            return handleResponse({
                'imagen_url': imagen_url 
            })
            
        # Retornar la imagen del binario
        imagen = result_image.get('image_bin', None)
        nombre_imagen = result_image.get('image_name', None)
        if imagen:
            # Converitr los bits a imagen
            img_io = io.BytesIO(imagen)
            img_io.seek(0)
            
            return send_file(img_io, mimetype='image/png')
        else: 
            return handleResponseError('No se encontró la imágen', 404)
    except Exception as e:
        print("Ocurrio un error en @obtener_imagen_usuario/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error en el servidor: {}'.format(e))
    
@mod.route('/obtener_usuarios/<int:id_usuario>', methods=['GET'])
def obtener_usuarios(id_usuario):
    try:
        if not id_usuario:
            return handleResponseError('Producto faltante', 400)
        
        # Comprobar si el producto existe
        result = qry(SQL_STRINGS.GET_USERS_BY_ID, {'id_usuario': id_usuario}, True)
        
        # Convertir la imagen a Base64
        imagen_base64 = base64.b64encode(result['imagen']).decode('utf-8')
        result['imagen'] = imagen_base64
        
        return jsonify(result)
    except Exception as e:
        print("Tipo de error:", type(e))
        print("Mensaje de error:", str(e))
        return handleResponseError('Error al obtener los usuarios', 500)

