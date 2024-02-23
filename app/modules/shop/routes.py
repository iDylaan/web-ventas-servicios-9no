from flask import Blueprint, render_template

mod = Blueprint('shop', __name__)

@mod.route('/', methods=['GET'])
def shop_template():
    return render_template('shop.html')


@mod.route('/detalles', methods=['GET'])
def product_details_template():
    return render_template('product-details.html')


@mod.route('checkout', methods=['GET'])
def checkout_template():
    return render_template('checkout.html')

