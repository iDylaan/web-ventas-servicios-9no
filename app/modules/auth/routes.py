import sys, requests
from flask import Blueprint, render_template, request, session, redirect, url_for
from app.modules.conf.conf_postgres import qry, sql
from app.utils.misc import (
    handleResponseError, 
    handleResponse, 
    val_req_data,
    hash_password,
    verify_password
)
from .sql_strings import Sql_Strings as SQL_STRINGS
from .schemas import signup_schema, signin_schema
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app import app

mod = Blueprint('auth', __name__)

# TEMPLATES
@mod.route('/signin', methods=['GET'])
def signin_template():
    user_logged = session.get('user_logged', False)
    if user_logged:
        return redirect(url_for('index'))
    else:
        return render_template('signin.html')

@mod.route('/signup', methods=['GET'])
def signup_template():
    user_logged = session.get('user_logged', False)
    if user_logged:
        return redirect(url_for('index'))
    else:
        return render_template('signup.html')

# ENDPOINTS

"""
Funcion para realizar el registro de los usuarios
# Parametros que recibe:
    - username
    - email
    - password
"""
@mod.route('/signup', methods=['POST'])
def registro_usuario():
    try:
        data = request.get_json()        

        # Recoleccion de datos
        username = data.get('username', None)
        email = data.get('email', None)
        password = data.get('password', None)

        if not username \
        or not email \
        or not password:
            return handleResponseError('Faltan campos obligatorio', 400)
        
        req_data = {
            'username': username,
            'email': email,
            'password': password
        }
        
        # Validar con el schema
        errors = val_req_data(req_data, signup_schema)
        if errors:
            print("Error: ", errors)
            return handleResponseError(errors, 400)
        

        # Comprobar que el usuario que se intenta registrar no exista en la db
        result = qry(SQL_STRINGS.GET_USER_COUNT_BY_EMAIL, {'email': email}, True)
        if result['count'] > 0:
            return handleResponseError('Ese correo no es valido', 400)
        
        # HASH de la contraseña
        req_data['password'] = hash_password(password)

        # Empezar a registrar al usuario
        rows_affected = sql(SQL_STRINGS.INSERT_USER, req_data)
        
        if rows_affected > 0:
            return handleResponse({'created': True}, 201)
        else:
            return handleResponseError('No se realizo el registro del usuario intentelo nuevamente', 500)   
    except Exception as e:
        print("Ocurrio un error en @registro_usuario/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        
        
        
@mod.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json() 
            
        # * ================| Normal Auth |====================== * #
        # Recibir datos
        email = data.get('email', None)
        password = data.get('password', None)
        
        # Validar campos faltantes
        if not email or not password:
            return handleResponseError('Faltan campos obligatorios', 400)
        
        login_data = {
            'email': email,
            'password': password
        }
        
        # Validar el formato de la data
        errors = val_req_data(login_data, signin_schema)
        if errors:
            print("Error: ", errors)
            return handleResponseError(errors, 400)
        
        # Consultar que el usuario exista
        user = qry(SQL_STRINGS.GET_USER_BY_EMAIL, {'email': email}, True)
        if not user:
            return handleResponseError('Usuario no válido', 400)
        
        valid_password = verify_password(password, user['password'])
        
        if valid_password:
            session['user_id'] = user['id']
            session['username'] = user['nombre_usuario']
            session['user_email'] = user['email']
            session['user_admin'] = bool(user['admin'])
            session['user_logged'] = True
            session['user_image_url'] = user['image_url']
            session['without_images'] = not user['image_url'] and not user['image_bin']
            return handleResponse({
                'redirect': url_for('admin') if user['admin'] else url_for('index')
            })
        else:
            return handleResponseError('El correo o la contraseña no son correctos, valida tu información', 400)
    except Exception as e:
        print("Ocurrio un error en @login_usuario/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))



@mod.route('/sso_google', methods=['POST'])
def sso_with_google():
    try:
        data = request.get_json() 
        # * ================| SSO with Google |====================== * #
        # Si es un inicio de sesión con Google
        google_code = data.get('code', None)
        
        if not google_code:
            return handleResponseError('No code by Google', 400)
        
        # Endpoint de Google para intercambiar el código
        google_url = "https://oauth2.googleapis.com/token"
        
        # Cuerpo de la solicitud
        google_data = {
            "client_id": app.config['GOOGLE_CLIENT_ID'],
            "client_secret": app.config['GOOGLE_CLIENT_SECRET'],
            "code": google_code,
            "redirect_uri": url_for('index'),
            "grant_type": "authorization_code"
        }
        
        # Intercambia el código por el token de acceso
        google_response = requests.post(google_url, data=google_data)
        print(google_response)
        token_info = google_response.json()
        print(token_info)
        access_token = token_info['access_token']
        print(access_token)
        
        # Verifica el token de ID de Google
        idinfo = id_token.verify_oauth2_token(access_token, google_requests.Request(), app.config['GOOGLE_CLIENT_ID'])

        # ID del usuario de Google y correo electrónico
        userid = idinfo['sub']
        email = idinfo['email']
        pic = idinfo['picture']
        
        print(userid)
        print(email)
        print(pic)
        return handleResponse({
            'userid': userid,
            'email': email,
            'pic': pic
        })
        
        # Busqueda de la existencia del usuario en la base de datos
        email = idinfo['email']
        user = qry(SQL_STRINGS.GET_USER_BY_EMAIL, {'email': email}, True)

        # Si el usuario no existe, registrar con la info de Google
        if not user:
            # Aquí deberías ajustar según tus necesidades de registro
            # Por ejemplo, registrar al usuario con la información proporcionada por Google
            pass
        
        # Establecer la sesión del usuario
        session['user_id'] = user['id']
        session['username'] = user['nombre_usuario']
        session['user_logged'] = True

        return handleResponse({'username': user['nombre_usuario']})
    
    except Exception as e:
        print("Error en @sso_with_google/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        # Token inválido
        return handleResponseError('Error al iniciar sesión con Google', 400)



@mod.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect(url_for('index'))
