import bcrypt, sys
from flask import jsonify
from cerberus import Validator


def hash_password(password):
    hash_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hash_password.decode('utf-8')


def verify_password(password, hash_password):
    return bcrypt.checkpw(password.encode('utf-8'), hash_password.encode('utf-8'))


def val_req_data(data, schema):
    v = Validator(schema)
    if not v.validate(data):
        return {'message': v.errors}
    return None 
    

def handleResponseError(msg, status = 500):
    return jsonify({
        "success": False,
        "error": {
            "msg": msg,
            "status": status
        }
    }), 200
    
def handleResponse(data):
    return jsonify({
        "success": True,
        "data": data
    }), 200