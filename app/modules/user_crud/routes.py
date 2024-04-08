import sys, io, base64
from flask import Blueprint, request, render_template, jsonify, session, redirect, abort
from app.utils.misc import (
    handleResponseError, 
    handleResponse,
    hash_password,
    val_req_data,
    admin_required,
    login_required,
    cloudinary_upload_image
)
from app.modules.conf.conf_postgres import qry, sql, sqlv2
from PIL import Image as PILImage
from werkzeug.utils import secure_filename
from .sql_strings import Sql_Strings as SQL_STRINGS
from .schemas import new_user_scheme, edit_user_scheme


mod = Blueprint('user_crud', __name__)

@mod.route('/')
@admin_required
def user_crud_template():
    usuarios_arr = None 
    usuarios_json = []
    try:
        usuarios_arr = qry(SQL_STRINGS.GET_USERS)
        for usuario in usuarios_arr:
            usuario_json = {  
                'id': usuario['id'],
                'nombre_usuario': usuario['nombre_usuario'],
                'email': usuario['email'],
                'admin' : usuario['admin'],
                'imagen_exist' : usuario['imagen'] is not None
            }
            usuarios_json.append(usuario_json)  # Mueve esta línea dentro del bucle
    except Exception as e:
        print(e)
        return render_template('404.html')
    finally:
        if not usuarios_arr:
            usuarios_arr = []
        return render_template('usuario-CRUD.html', usuarios=usuarios_arr, usuarios_json=usuarios_json)


@mod.route('/nuevo', methods=['POST'])
@admin_required
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
        or not password:
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
        
        # Comprobar que el usuario que se intenta registrar no exista en la db
        result = qry(SQL_STRINGS.GET_USER_COUNT_BY_EMAIL, {'email': email}, True)
        if result['count'] > 0:
            return handleResponseError('Ese correo no es valido', 400)
        
        # HASH de la contraseña
        new_user_dict['password'] = hash_password(password)
        
        # Guardar al nuevo usuario en la DB
        rows_affected,id_of_new_row = sqlv2(SQL_STRINGS.INSERT_NEW_USER, new_user_dict, True)
        
        # Validar filas afectadas
        if rows_affected:
            return handleResponse({'message': 'PUsuario registrado exitosamente', 'id_usuario': id_of_new_row})
        else:
            raise handleResponseError('No se pudo registrar al usuario.')
        
    except Exception as e:
        print("Ocurrio un error en @nuevo_usuario/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error inesperado en el servidor: {}'.format(e))
    

@mod.route('/editar/<int:id_usuario>', methods=['POST'])
@admin_required
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
        admin = data.get('admin', None)
        
        # Validar datos requeridos
        if not nombre_usuario or not email or admin is None:
            return handleResponseError('Faltan campos obligatorios', 400)
        
        # Crear el diccionario del nuevo usuario
        edit_user_dict = {
            'nombre_usuario': nombre_usuario,
            'email': email,
            'admin': admin
        }
        
        # Validar formato de los datos
        errors = val_req_data(edit_user_dict, edit_user_scheme)
        if errors:
            print("Error: ", errors)
            return handleResponseError(errors, 400)
        

        # Agregar el id del usuario al diccionario
        edit_user_dict['id_usuario'] = id_usuario
        
        # Guardar al nuevo usuario en la DB
        rows_affected = sql(SQL_STRINGS.UPDATE_USER_BY_ID, edit_user_dict)
        
        # Validar filas afectadas
        if rows_affected:
            return handleResponse('Usuario editado exitosamente')
        else:
            raise handleResponseError('No se pudo editar al usuario.')
        
    except Exception as e:
        print("Ocurrio un error en @editar_usuario/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error en el servidor: {}'.format(e))
    

@mod.route('/imagen_usuario/<int:id_usuario>', methods=['POST'])
@login_required
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

        upload_result, status = cloudinary_upload_image(imagen_file)
        if status >= 400:
            return handleResponseError('No se ha subido la imagen correctamente, intentelo de nuevo mas tarde', status)
        
        
        # Convertir la imagen a bytes usando Pillow
        if imagen_file:
            rows_affected = sql(SQL_STRINGS.UPDATE_USER_IMAGE_BY_ID, {'id_usuario': id_usuario, 'imagen': upload_result.get('image', None)})
            if rows_affected:
                if id_usuario == session['user_id']:
                    session['without_images'] = False   
                return handleResponse({'image': upload_result.get('image', None)})
            else:
                raise Exception ('La imagen no se inserto correctamente')
        else:
            raise Exception('No hay imagen')
    except Exception as e:
        print("Ocurrio un error en @guardar_imagen_usuario/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error en el servidor: {}'.format(e))


@mod.route('/imagen_usuario/<int:id_usuario>', methods=['GET'])
@login_required
def obtener_imagen_usuario(id_usuario):
    try:
        if not id_usuario:
            return jsonify('')

        # Comprobar si el usuario existe y obtener la imagen
        result_image = qry(SQL_STRINGS.GET_USER_IMAGE_BY_ID, {'id_usuario': id_usuario}, True)

        # Si no se encuentra la imagen, opcionalmente redirige a una imagen predeterminada o devuelve un error
        if not result_image or not result_image.get('image_url'):
            # return redirect(url_for('ruta_imagen_predeterminada'))
            return abort(404, description="Imagen no encontrada")

        # Si la imagen existe y tiene una URL, redirigir a esa URL
        imagen_url = result_image.get('image_url')
        return redirect(imagen_url)

    except Exception as e:
        print(f"Ocurrió un error en @obtener_imagen_usuario/{e} en la línea {sys.exc_info()[-1].tb_lineno}")
        # En caso de error en el servidor, podrías redirigir a una imagen de error o manejarlo de otra manera
        return abort(500, description="Error en el servidor")
    
@mod.route('/obtener_usuarios/<int:id_usuario>', methods=['GET'])
@login_required
@admin_required
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



@mod.route('/imagen_usuario_json/<int:id_usuario>', methods=['GET'])
def imagen_usuario_json(id_usuario):
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
        return handleResponse({
            'image': imagen_url 
        })
    except Exception as e:
        print("Ocurrio un error en @imagen_usuario_json/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error en el servidor: {}'.format(e))
