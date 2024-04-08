import os, pytz, json
from flask import Flask, render_template, session
from .app_config import Config
from flask_session import Session
from app.utils.misc import admin_required
import cloudinary

# Crear la app
app = Flask(__name__)

# Crear la configuracion de FLASK a partir de la clase Config de app_config.py
app.config.from_object(Config)

### SESSION ###
Session(app)

### CLOUDINARY ###
cloudinary.config(
  cloud_name = app.config['CLOUDINARY_CLOUD_NAME'],
  api_key = app.config['CLOUDINARY_API_KEY'],
  api_secret = app.config['CLOUDINARY_API_SECRET']
)

### Rutas principales ###
@app.route('/home', methods=['GET'])
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/admin', methods=['GET'])
@admin_required
def admin():
     return render_template('index-admin.html')

### Variables Globales ###
@app.context_processor
def global_vars():
    return dict(
        user_logged = session.get('user_logged', False),
        user_admin = session.get('user_admin', False),
        user_without_images = session.get('without_images', True),
        user_id = session.get('user_id', False),
        user_image = session.get('user_image_url', None)
    )

### Formateador de fechas ### 
@app.template_filter('format_mx')
def format_mx(value, format="%d/%m/%Y"):
    """Convierte un objeto datetime a una cadena en formato mexicano."""
    # Asegúrate de que la fecha esté en la zona horaria adecuada, aquí usamos la zona horaria de la Ciudad de México
    tz = pytz.timezone('America/Mexico_City')
    value = value.astimezone(tz)
    return value.strftime(format)

### Carga de respuesta de un 404 (recurso no encontrado) ###
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

### API ROUTES ###
from .modules import (
    mod_auth,
    mod_services,
    mod_projects,
    mod_pages,
    mod_dashboard,
    mod_user_crud,
    mod_productos_crud,
    mod_shop,
    mod_compras,
)

### BP ###
app.register_blueprint(mod_auth, url_prefix='/auth')
app.register_blueprint(mod_services, url_prefix='/services')
app.register_blueprint(mod_projects, url_prefix='/projects')
app.register_blueprint(mod_pages, url_prefix='/pages')
app.register_blueprint(mod_dashboard, url_prefix='/dashboard')
app.register_blueprint(mod_user_crud, url_prefix='/usuarios_crud')
app.register_blueprint(mod_productos_crud, url_prefix='/productos_crud')
app.register_blueprint(mod_shop, url_prefix='/tienda')
app.register_blueprint(mod_compras, url_prefix='/compras')