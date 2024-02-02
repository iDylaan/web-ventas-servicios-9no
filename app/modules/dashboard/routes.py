from flask import Blueprint, render_template

mod = Blueprint('bashboard', __name__)

@mod.route('/')
def dashboard():
    return render_template('dashboard.html')