from flask import Blueprint, render_template

mod = Blueprint('dashboard', __name__)

@mod.route('/')
def dashboard_template():
    return render_template('dashboard.html')