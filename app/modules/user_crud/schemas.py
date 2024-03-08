new_user_scheme = {
    'nombre_usuario': {
        'type': 'string',
        'required': True
    },
    'email': {
        'type': 'string',
        'required': True,
        'regex': '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    },
    'password': {
        'type': 'string',
        'required': True,
        'minlength': 8
    },
    'admin': {
        'type': 'integer',
        'required': True,
        'allowed': [0, 1]
    }
}