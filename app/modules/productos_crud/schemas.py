new_product_scheme = {
    'titulo': {
        'type': 'string', 
        'required': True,
        'empty': False
    },
    'descripcion': {
        'type': 'string', 
        'required': True,
        'empty': False
    },
    'descripcion_corta': {
        'type': 'string', 
        'required': True,
        'empty': False
    },
    'info': {
        'type': 'string', 
        'required': True,
        'empty': False
    },
    'precio': {
        'type': 'float', 
        'required': True,
        'min': 0
    }
}