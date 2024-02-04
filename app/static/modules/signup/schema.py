signup_schema = {
    'username': {
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
} 