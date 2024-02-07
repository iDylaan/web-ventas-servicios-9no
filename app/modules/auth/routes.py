import sys
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

mod = Blueprint('auth', __name__)

# TEMPLATES
@mod.route('/signin', methods=['GET'])
def signin_template():
    return render_template('signin.html')

@mod.route('/signup', methods=['GET'])
def signup_template():
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
            return handleResponse({
                'username': username,
                'email': email
            })
        else:
            return handleResponseError('No se realizo el registro del usuario intentelo nuevamente', 500)   
    except Exception as e:
        print("Ocurrio un error en @registro_usuario/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        
        
        
@mod.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json()
        
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
            return handleResponse({'username': user['nombre_usuario']})
        else:
            return handleResponseError('El correo o la contraseña no son correctos, valida tu información', 400)
    except Exception as e:
        print("Ocurrio un error en @login_usuario/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))



@mod.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect(url_for('index'))
