import os
from dotenv import load_dotenv

load_dotenv(".env")

# Aqui van todas las variables de configuracion de Flask
class Config:
    DEBUG = 0

    PGL_PASS = os.getenv("POSTGRES_PASSWORD")
    PGL_HOST = os.getenv("POSTGRES_HOST")
    PGL_PORT = os.getenv("POSTGRES_PORT")
    PGL_USER = os.getenv("POSTGRES_USER")
    PGL_DB = os.getenv("POSTGRES_DB")
    
    ### SESSION ###
    SESSION_SQLALCHEMY_TABLE = os.getenv('SESSION_SQLALCHEMY_TABLE')
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    PERMANENT_SESSION_LIFETIME = 60 * 60 * 24 * 1 # Segundos x Minutos x Horas x Dias
    SESSION_TYPE = os.getenv('SESSION_TYPE')
    SECRET_KEY = os.getenv('SECRET_KEY')
    SESSION_USE_SIGNER = True
    SESSION_PERMANENT = True
    
    
    ### GOOGLE TOKENS ###
    GOOGLE_CLIENT_SECRET=os.getenv('GOOGLE_CLIENT_SECRET')
    GOOGLE_CLIENT_ID=os.getenv('GOOGLE_CLIENT_ID')


    ### CLOUDINARY ###
    CLOUDINARY_CLOUD_NAME=os.getenv('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY=os.getenv('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET=os.getenv('CLOUDINARY_API_SECRET')