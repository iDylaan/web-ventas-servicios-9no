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