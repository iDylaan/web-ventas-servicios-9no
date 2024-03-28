import bcrypt, sys, json
from flask import jsonify, session, redirect, url_for
from cerberus import Validator
from functools import wraps
from decimal import Decimal
from datetime import datetime


def hash_password(password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password.decode('utf-8')

def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))


# Schemas validate
def val_req_data(data, schema): # validate request data
    v = Validator(schema)
    if not v.validate(data):
        return {"message": v.errors}
    return None
    

def handleResponseError(msg, status = 500):
    return jsonify({
        "success": False,
        "error": {
            "msg": msg,
            "status": status
        }
    }), 200
    
def handleResponse(data, status = 200):
    return jsonify({
        "success": True,
        "data": data
    }), status


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or not session['user_id']:
            return redirect(url_for('auth.signin_template'))
        return f(*args, **kwargs)
    return decorated_function

def default_converter(o):
    if isinstance(o, Decimal):
        return str(o)  
    elif isinstance(o, datetime):
        return o.isoformat() 
    raise TypeError('Object of type {} is not JSON serializable'.format(o.__class__.__name__))
