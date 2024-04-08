from flask import Blueprint, render_template

mod = Blueprint('terminos', __name__)

@mod.route('/terminos_condiciones', methods = ["GET"])
def mi_compras_template():
    return render_template('terminos-condiciones.html')


