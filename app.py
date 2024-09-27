from flask import Flask # type: ignore
from config import Configuratie
import routes

def create_app():  # Wanneer de functie create_app aangeroepen wordt, doe het volgende
    app = Flask(__name__)  # Ken de naam van de huidige module (oftewel, python-bestand) toe als appnaam
    app.config.from_object(Configuratie)  # Vul de configuratie met de constanten die indirect uit .env komen

    routes.init_routes(app)  # Importeer de app-routes uit de functie init_routes in routes.py
    return app  # Geef het geïnitieerde app-object terug

if __name__ == '__main__':  # Best practice: controle of het script direct aangeroepen wordt in plaats van geïmporteerd
    app = create_app()  # Maak een app object aan
    try:
        app.run(debug=True)  # Run de instantie
    except Exception as e:
        print(f"Error starting the Flask application: {e}")
