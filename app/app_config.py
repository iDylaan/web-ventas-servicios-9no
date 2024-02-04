import os
from dotenv import load_dotenv

load_dotenv(".env")

# Aqui van todas las variables de configuracion de Flask
class Config:
    DEBUG = 0

    PGL_HOST = os.getenv("POSTGRES_HOST")
    PGL_DB = os.getenv("POSTGRES_DB")
    PGL_USER = os.getenv("POSTGRES_USER")
    PGL_PASS = os.getenv("POSTGRES_PASSWORD")
    PGL_PORT = os.getenv("POSTGRES_PORT")