from flask import Blueprint, render_template

mod = Blueprint('services', __name__)

@mod.route('/', methods=['GET'])
def index():
    return render_template('services.html')