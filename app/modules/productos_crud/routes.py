from flask import Blueprint, request, render_template

mod = Blueprint('productos_crud', __name__)

@mod.route('/')
def productos_crud_template():
    return render_template('productos-CRUD.html')
