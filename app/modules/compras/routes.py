from flask import Blueprint, render_template

mod = Blueprint('compras', __name__)

@mod.route('/mis_compras', methods = ["GET"])
def mi_compras_template():
    return render_template('mis-compras.html')



@mod.route('/wishlist', methods = ["GET"])
def wishlist_template():
    return render_template('wishlist.html')
