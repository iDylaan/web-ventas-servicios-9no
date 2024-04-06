import sys,io
from flask import Blueprint, render_template,session,send_file
from .sql_strings import Sql_Strings as SQL_STRINGS
from app.modules.conf.conf_postgres import qry
from app.utils.misc import (
    login_required
)

mod = Blueprint('compras', __name__)

@mod.route('/mis_compras', methods = ["GET"])
@login_required
def mi_compras_template():
    
    return render_template('mis-compras.html')

@mod.route('/wishlist', methods=["GET"])
@login_required
def wishlist_template():
    try:
        id_usuario = session['user_id']
        wishlist_arr = qry(SQL_STRINGS.DESIRED_PRODUCT, {'id_usuario': id_usuario})
        if not wishlist_arr:
            wishlist_arr = []
        return render_template('wishlist.html', wishlist=wishlist_arr)
    except Exception as e:
        print(e)
        return render_template('404.html')