from flask import Blueprint, render_template

mod = Blueprint('services', __name__)

@mod.route('/', methods=['GET'])
def index():
    return render_template('services.html')

@mod.route('/details', methods=['GET'])
def details():
    return render_template('service-details.html')