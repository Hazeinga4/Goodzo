import os
from dotenv import load_dotenv # type: ignore

load_dotenv() # Laad de basisfunctie van .env. Dat is ingebouwde logica die het .env-bestand inlaadt

class Configuratie: # We kennen in de class Configuratie de volgende waarden toe:
    # Flask constanten
    FLASK_APP = os.getenv('FLASK_APP')
    FLASK_ENV = os.getenv('FLASK_ENV')

    # Database constanten
    DATABASE_HOST = os.getenv('DATABASE_HOST')
    DATABASE_USER = os.getenv('DATABASE_USER')
    DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')
    DATABASE_NAME = os.getenv('DATABASE_NAME')