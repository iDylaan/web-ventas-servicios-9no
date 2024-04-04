from flask import Blueprint, render_template

mod = Blueprint('compras', __name__)

@mod.route('/mis_compras', methods = ["GET"])
def mi_compras_template():
    render_template('compras.html')
