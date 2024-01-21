import os
from dotenv import load_dotenv

load_dotenv(".env")

# Aqui van todas las variables de configuracion de Flask
class Config:
    DEBUG = 0