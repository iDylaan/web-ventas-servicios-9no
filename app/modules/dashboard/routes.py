from flask import Blueprint, render_template
from app.utils.misc import admin_required

mod = Blueprint('dashboard', __name__)

@mod.route('/')
@admin_required
def dashboard_template():
    return render_template('dashboard.html')