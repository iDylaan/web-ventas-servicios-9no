from flask import Blueprint, request, render_template

mod = Blueprint('index', __name__)

@mod.route('/index')
def index():
    return render_template('index-admin.html.html')
