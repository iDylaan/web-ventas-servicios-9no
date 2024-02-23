from flask import Flask, render_template, session
from .app_config import Config
from flask_session import Session

# Crear la app
app = Flask(__name__)

# Crear la configuracion de FLASK a partir de la clase Config de app_config.py
app.config.from_object(Config)

### SESSION ###
Session(app)

### Rutas principales ###
@app.route('/home', methods=['GET'])
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/admin', methods=['GET'])
def admin():
     return render_template('index-admin.html')

### Variables Globales ###
@app.context_processor
def global_vars():
    return dict(
        user_logged = session.get('user_logged', False),
        user_admin = session.get('user_admin', False)
    )

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
    mod_shop,
)

### BP ###
app.register_blueprint(mod_auth, url_prefix='/auth')
app.register_blueprint(mod_services, url_prefix='/services')
app.register_blueprint(mod_projects, url_prefix='/projects')
app.register_blueprint(mod_pages, url_prefix='/pages')
app.register_blueprint(mod_dashboard, url_prefix='/dashboard')
app.register_blueprint(mod_user_crud, url_prefix='/user_crud')
app.register_blueprint(mod_shop, url_prefix='/tienda')