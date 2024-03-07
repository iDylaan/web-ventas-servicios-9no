import sys, io
from flask import Blueprint, request, render_template, jsonify, send_file
from app.utils.misc import (
    handleResponseError, 
    handleResponse,
    hash_password
)
from PIL import Image as PILImage
from werkzeug.utils import secure_filename


mod = Blueprint('user_crud', __name__)

@mod.route('/')
def user_crud_template():
    return render_template('usuario-CRUD.html')



@mod.route('/nuevo', methods=['POST'])
def nuevo_usuario():
    try:
        data = request.get_json()
        
        # Recibir datos
        nombre_usuario = data.get('nombre_usuario', None)
        email = data.get('email', None)
        password = data.get('password', None)
        admin = data.get('admin', False)
        
        return handleResponse({
            'nuevo_usuario': nombre_usuario,
            'email': email,
            'password': hash_password(password),
            'admin': admin
        })  
    except Exception as e:
        print("Ocurrio un error en @nuevo_usuario/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        return handleResponseError('Error inesperado en el servidor: {}'.format(e))
    

# @mod.route('/imagen_usuario/<int:id_user>', methods=['POST'])
# def guardar_imagen_usuario(id_user):
#     try:
#         # Recibir el archivo de imagen
#         imagen_file = request.files.get('imagen', None)
#         filename = None
#         img_byte_arr = None
        
#         # Convertir la imagen a bytes usando Pillow
#         if imagen_file:
#             filename = secure_filename(imagen_file.filename)
#             image = PILImage.open(imagen_file.stream)
            
#             img_byte_arr = io.BytesIO()
#             image.save(img_byte_arr, format='PNG')
#             img_byte_arr = img_byte_arr.getvalue()
            
#             # Regresar la imagen
#             img_io = io.BytesIO(img_byte_arr)
#             img_io.seek(0)
            
#             return send_file(img_io, mimetype='image/png')
#         else:
#             raise Exception('No hay imagen')
#     except Exception as e:
#         print("Ocurrio un error en @imagen_usuario/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
#         return handleResponseError('Error inesperado en el servidor: {}'.format(e))