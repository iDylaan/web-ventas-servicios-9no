import sys
from flask import Blueprint, render_template, url_for, redirect, request
from .sql_strings import Sql_Strings as SQL_STRINGS
from app.modules.conf.conf_postgres import qry

mod = Blueprint('shop', __name__) 

@mod.route('/', methods=['GET'])
def shop_template():
    products_arr = None
    try:
        products_arr = qry(SQL_STRINGS.GET_PRODCTS)
    except Exception as e:
        print(e)
        return render_template('404.html')
    finally:
        if not products_arr:
            products_arr = []
        return render_template('shop.html', productos=products_arr)


@mod.route('/detalles/<int:id_producto>', methods=['GET'])
def product_details_template(id_producto):
    product = None
    try:
        product = qry(SQL_STRINGS.GET_PRODCT_BY_ID, {'id_producto':id_producto}, True)
        if product:
            return render_template('product-details.html', producto=product)
        else:
            return render_template('404.html')
    except Exception as e:
        print(e)
        return render_template('404.html')



@mod.route('/checkout', methods=['GET'])
def checkout_template():
    return render_template('checkout.html')



@mod.route('/carrito', methods=['GET'])
def cart_template():
    ids = request.args.get('ids')
    productos = []
    try:
        if ids:
            ids_list = ids.split(',')
            productos = qry(SQL_STRINGS.GET_PRODUCTS_BY_ID, (tuple(ids_list),))
            print(productos)
    except Exception as e:
        print("Ocurrio un error en @cart_template/{} en la linea {}".format(e, sys.exc_info()[-1].tb_lineno))
        productos = []
    finally:
        return render_template('cart.html', productos=productos)
        
