from flask import Blueprint, request, render_template, jsonify

mod = Blueprint('productos_crud', __name__)

@mod.route('/')
def productos_crud_template():
    return render_template('productos-CRUD.html')


@mod.route('/nuevo', methods=['POST'])
def nuevo_usuario():
    return jsonify({
        'nuevo_usuario': True
    })