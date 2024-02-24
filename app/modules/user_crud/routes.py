from flask import Blueprint, request, render_template

mod = Blueprint('user_crud', __name__)

@mod.route('/')
def user_crud_template():
    return render_template('usuario-CRUD.html')

@mod.route('/')
def user_crud_template():
    return render_template('productos-CRUD.html')
