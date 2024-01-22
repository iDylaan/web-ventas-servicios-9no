from flask import Flask, render_template
from .app_config import Config

# Crear la app
app = Flask(__name__)

# Crear la configuracion de FLASK a partir de la clase Config de app_config.py
app.config.from_object(Config)

@app.route('/home', methods=['GET'])
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


### Carga de respuesta de un 404 (recurso no encontrado) ###
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

### API ROUTES ###
from .modules import (
    mod_auth,
    mod_services,
)

### BP ###
app.register_blueprint(mod_auth, url_prefix='/auth')
app.register_blueprint(mod_services, url_prefix='/services')