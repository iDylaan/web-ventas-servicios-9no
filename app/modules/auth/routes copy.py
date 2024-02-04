import sys
from flask import Blueprint, render_template,request
from app.modules.conf.conf_postgres import qry, sql
from app.utils.misc import handleResponseError, handleResponse, val_req_data
from app.static.modules.signup.SQL.sql_strings import Sql_Strings as SQL_S
from app.static.modules.signup.schema import signup_schema

mod = Blueprint('auth', __name__)

# TEMPLATES
@mod.route('/signin', methods=['GET'])
def signin_template():
    return render_template('signin.html')

@mod.route('/signup', methods=['GET'])
def signup_template():
    return render_template('signup.html')

@mod.route('/o', methods=['GET'])
def o():
    return render_template('index-admin.html')


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

        # Comprobar que el usuario que se intenta registrar no exista en la db
        result = qry(SQL_S.GET_USER_BY_EMAIL, {'email': email}, True)
        if result['count'] > 0:
            return handleResponseError('Ese correo no es valido', 400)

        # Empezar a registrar al usuario
        rows_affected = sql(SQL_S.INSERT_USER, {
            'username': username,
            'email': email,
            'password': password
        })


        if rows_affected > 0:
            return handleResponse({
                'username': username,
                'email': email
            })
        else:
            return handleResponseError('No se realizo el registro del usuario intentelo nuevamente', 500)  
    except Exception as e:
        print("Ha ocurrido un error en la funcion @registro_usuario/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
