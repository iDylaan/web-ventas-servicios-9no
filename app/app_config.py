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
    
    ### SESSION ###
    SECRET_KEY = os.getenv('SECRET_KEY')
    SESSION_TYPE = os.getenv('SESSION_TYPE')
    SESSION_PERMANENT = True
    PERMANENT_SESSION_LIFETIME = 60 * 60 * 12 # Segundos x Minutos x Horas x Dias
    
    
    ### GOOGLE TOKENS ###
    GOOGLE_CLIENT_ID=os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET=os.getenv('GOOGLE_CLIENT_SECRET')


    ### CLOUDINARY ###
    CLOUDINARY_CLOUD_NAME=os.getenv('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY=os.getenv('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET=os.getenv('CLOUDINARY_API_SECRET')