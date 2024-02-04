import bcrypt, sys
from flask import jsonify
from cerberus import Validator


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
    
def handleResponse(data):
    return jsonify({
        "success": True,
        "data": data
    }), 200