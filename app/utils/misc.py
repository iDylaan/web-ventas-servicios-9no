import bcrypt, sys, json
from flask import jsonify, session, redirect, url_for
from cerberus import Validator
from functools import wraps
from decimal import Decimal
from datetime import datetime
import cloudinary.uploader


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

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_admin' not in session or not session['user_admin']:
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function

def default_converter(o):
    if isinstance(o, Decimal):
        return str(o)  
    elif isinstance(o, datetime):
        return o.isoformat() 
    raise TypeError('Object of type {} is not JSON serializable'.format(o.__class__.__name__))


def cloudinary_upload_image(image_file):
    if not image_file:
        return {'error': 'Sin archivo recibido'}, 400
    if image_file.filename == '':
        return {'error': 'No hay archivo seleccionado'}, 400

    try:
        # Sube el archivo a Cloudinary
        result = cloudinary.uploader.upload(image_file)
        url = result.get('url')
        return {'message': 'Imagen subida correctamente', 'image': url}, 200
    except Exception as e:
        return {'error': str(e)}, 500

