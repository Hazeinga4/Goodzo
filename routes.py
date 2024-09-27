from flask import request, render_template, jsonify # type: ignore
from services import *
from loginsimulatie import id_medewerker
from sanitize import *

medewerker_id_str = str(id_medewerker)

def init_routes(app):

    @app.route('/', methods=['GET'])
    def index():
        try:
            medewerker = get_medewerker(medewerker_id_str)
            if medewerker is not None:
                return render_template('index.html', medewerker=medewerker)
            else:
                return handle_error(404, 'Er is een fout opgetreden bij het ophalen van de medewerker uit de database')
        except Exception as e:
            print(f"Error in index route: {e}")
            return handle_error(500, 'Er is een fout opgetreden bij het ophalen van de medewerker')

    @app.route('/werkdag', methods=['GET'])
    def werkdag():
        try:
            locaties = get_locaties_van_medewerker(medewerker_id_str)
            return render_template('werkdag_nieuw.html', locaties=locaties)
        except Exception as e:
            print(f"Error in werkdag route: {e}")
            return handle_error(500, 'Er is een fout opgetreden bij het ophalen van de locaties')

    @app.route('/werkdag/delete', methods=['DELETE'])
    def historie_delete():
        try:
            data = request.get_json()
            id_werkdag = data.get('idwerkdag')
            medewerker = get_medewerker(medewerker_id_str)

            if id_werkdag is None:
                return handle_error(400, 'Ongeldige werkdag')

            if medewerker is None:
                return handle_error(400, 'Medewerker niet gevonden')
            
            bestaandewerkdag = get_werkdag_over_id(id_werkdag)

            if bestaandewerkdag is not None:
                if bestaandewerkdag.medewerker_idmedewerker != medewerker.idmedewerker:
                    return handle_error(400, 'Werkdag niet gevonden of geen toegang.')
                try:
                    delete_werkdag_over_id(id_werkdag, medewerker_id_str)
                    return jsonify({'message': 'De werkdag en bijbehorende ritten zijn succesvol verwijderd'}), 200
                except Exception as e:
                    print(f"Error in historie_delete: {e}")
                    return handle_error(500, 'Er is een fout opgetreden bij het verwijderen van de werkdag')
            else:
                return handle_error(400, 'Werkdag niet gevonden of geen toegang.')
        except Exception as e:
            print(f"Error in historie_delete route: {e}")
            return handle_error(500, 'Er is een fout opgetreden bij het verwerken van je verzoek')

    @app.route('/werkdag/toevoegen', methods=['POST'])
    def werkdag_toevoegen():
        try:
            medewerker = get_medewerker(medewerker_id_str)
            if medewerker is None:
                return handle_error(404, 'Medewerker niet gevonden')

            data = request.get_json()
            datum = parse_date(data['datum'], 'datum')
            basislocatie = sanitize_string(data['basislocatie'], 'basislocatie - naam')
            aantal_blikjes = parse_int(data['aantal_blikjes'], 'aantal blikjes')
            aantal_beeldschermen = parse_int(data['aantal_beeldschermen'], 'aantal beeldschermen')
            aantal_uren_beeldschermen = parse_float(data['aantal_uren_beeldschermen'], 'uren beeldschermen')
            aantal_chatgpt = parse_int(data['aantal_chatgpt'], 'aantal ai')
            ritten = data.get('ritten', [])

            basislocatie = get_locatie_by_name(medewerker_id_str, basislocatie)
            if basislocatie is None and basislocatie.locatienaam != 'Anders':
                return handle_error(400, 'Ongeldige basislocatie')

            bestaandewerkdag = get_werkdag_over_datum(medewerker_id_str, datum)
            if bestaandewerkdag is not None:
                return jsonify({'message': 'Werkdag bestaat al voor deze datum'}), 208

            werkdag_id = create_werkdag(medewerker_id_str, datum, aantal_blikjes, aantal_beeldschermen, aantal_uren_beeldschermen, aantal_chatgpt, basislocatie.idlocatie)
            
            sanitize_ritten(ritten)
            validate_ritten(ritten, medewerker_id_str)
            create_ritten(ritten, werkdag_id, medewerker_id_str)

            return jsonify({'message': 'Werkdag en ritten succesvol toegevoegd'}), 201
        except Exception as e:
            print(f"Error in werkdag_toevoegen route: {e}")
            return handle_error(500, 'Er is een fout opgetreden bij het toevoegen van de werkdag')
        
    @app.route('/editwerkdag/<int:idwerkdag>', methods=['GET'])
    def bewerk_werkdag(idwerkdag):
        try:
            medewerker = get_medewerker(medewerker_id_str)
            if medewerker is None:
                return handle_error(404, 'Medewerker niet gevonden')
            
            werkdag = get_werkdag_over_id(idwerkdag)
            if werkdag is None:
                return handle_error(400, 'Werkdag niet gevonden of geen toegang.')
            
            if werkdag.medewerker_idmedewerker != medewerker.idmedewerker:
                return handle_error(400, 'Werkdag niet gevonden of geen toegang.')

            ritten = get_ritten_over_werkdag_id(idwerkdag)
            locaties = get_locaties_van_medewerker(medewerker_id_str)

            if werkdag is not None:
                return render_template('werkdag_bewerk.html', werkdag=werkdag, ritten=ritten, locaties=locaties)
            else:
                return handle_error(400, 'Werkdag niet gevonden of geen toegang')
        except Exception as e:
            print(f"Error in bewerk_werkdag route: {e}")
            return handle_error(500, 'Er is een fout opgetreden bij het ophalen van de werkdag')

    @app.route('/editwerkdag/<int:idwerkdag>', methods=['POST'])
    def werkdag_bewerken(idwerkdag):
        try:
            medewerker = get_medewerker(medewerker_id_str)
            if medewerker is None:
                return handle_error(404, 'Medewerker niet gevonden')

            data = request.get_json()

            datum = parse_date(data['datum'], 'datum')
            basislocatie_id = parse_int(data['basislocatie_id'], 'basislocatie id')
            aantal_blikjes = parse_int(data['aantal_blikjes'], 'aantal blikjes')
            aantal_beeldschermen = parse_int(data['aantal_beeldschermen'], 'aantal beeldschermen')
            aantal_uren_beeldschermen = parse_float(data['aantal_uren_beeldschermen'], 'uren beeldschermen')
            aantal_chatgpt = parse_int(data['aantal_chatgpt'], 'aantal ai')

            ritten = data.get('ritten', [])

            valid_werkdag_before_update = validate_werkdag_update(idwerkdag, datum, medewerker_id_str)
            
            if not valid_werkdag_before_update:
                return handle_error(400, 'Er is iets mis met je verzoek om deze werkdag te bewerken')
            
            update_werkdag_over_id(idwerkdag, datum, aantal_blikjes, aantal_beeldschermen, aantal_uren_beeldschermen, aantal_chatgpt, basislocatie_id)
            
            sanitize_ritten(ritten)
            validate_ritten(ritten, medewerker_id_str)
            delete_ritten_over_werkdag_id(idwerkdag)
            create_ritten(ritten, idwerkdag, medewerker_id_str)

            return jsonify({'message': 'Werkdag succesvol bewerkt'}), 200
        except Exception as e:
            print(f"Error in werkdag_bewerken route: {e}")
            return handle_error(500, 'Er is een fout opgetreden bij het bewerken van de werkdag')
        
    @app.route('/historie', methods=['GET'])
    def historie():
        try:
            return render_template('historie.html')
        except Exception as e:
            print(f"Error in historie route: {e}")
            return handle_error(500, 'Er is een fout opgetreden bij het laden van de historiepagina')

    @app.route('/historie/data', methods=['POST'])
    def historie_data():
        try:
            medewerker = get_medewerker(medewerker_id_str)
            if medewerker is None:
                return handle_error(404, 'Medewerker niet gevonden')

            data = request.get_json()
            begindatum = parse_date(data['begindatum'], 'begindatum')
            einddatum = parse_date(data['einddatum'], 'einddatum')

            werkdagen = get_werkdagen(medewerker_id_str, begindatum, einddatum)
            ritten = get_ritten(medewerker_id_str, begindatum, einddatum)

            if werkdagen:
                werkdagen_dicts = [werkdag.__dict__ for werkdag in werkdagen]
                ritten_dicts = [rit.__dict__ for rit in ritten]
                return jsonify({'werkdagen': werkdagen_dicts, 'ritten': ritten_dicts})
            else:
                return jsonify({'werkdagen': [], 'ritten': []}), 204
        except Exception as e:
            print(f"Error in historie_data route: {e}")
            return handle_error(500, 'Er is een fout opgetreden bij het ophalen van de historie')

    @app.route('/footprint', methods=['GET'])
    def footprint():
        try:
            return render_template('footprint.html')
        except Exception as e:
            print(f"Error in footprint route: {e}")
            return handle_error(500, 'Er is een fout opgetreden bij het laden van de footprintpagina')

    @app.route('/gegevens', methods=['GET'])
    def gegevens():
        try:
            medewerker = get_medewerker(medewerker_id_str)
            leaseauto = get_lease_auto(medewerker_id_str, "1")
            locaties = get_locaties_van_medewerker(medewerker_id_str)
            thuislocatie = filter_locatie_over_situatie(locaties, 'Thuis', False)
            actieveklantlocaties = filter_actieve_klantlocaties(locaties)
            if medewerker :
                return render_template('gegevens.html', medewerker=medewerker, leaseauto=leaseauto, thuislocatie=thuislocatie, actieveklantlocaties=actieveklantlocaties)
            else:
                return handle_error(404, 'Geen medewerker gevonden')
        except Exception as e:
            print(f"Error in gegevens route: {e}")
            return handle_error(500, 'Er is een fout opgetreden bij het ophalen van de gegevens')

    def handle_error(code, message=None):
        print(f"Error {code}: {message}")
        if message is None:
            message = 'An error occurred'
        return render_template('error.html', error_code=code, error_message=message, description=""), code

    @app.errorhandler(Exception)
    def handle_exception(e):
        if hasattr(e, 'code'):
            code = e.code
            description = e.description
        else:
            code = 500
            description = str(e)
        
        return handle_error(code, description)

    
    @app.route('/footprint/co2', methods=['POST'])
    def carFootprint():
        medewerker = get_medewerker(medewerker_id_str)
        if medewerker is None:
            return jsonify({'message': 'Medewerker niet gevonden'}), 404

        try:
            data = request.get_json()
            begindatum = parse_date(data['begindatum'], 'begindatum')
            einddatum = parse_date(data['einddatum'], 'einddatum')

            werkdagen = get_werkdagen(medewerker_id_str, begindatum, einddatum) 
            ritten = get_ritten(medewerker_id_str, begindatum, einddatum)
            leaseautoVerbruik = get_lease_auto(medewerker_id_str, "1").verbruikperkilometer

            if werkdagen and ritten and leaseautoVerbruik:
                ritten_dicts = [rit.__dict__ for rit in ritten]
                werkdagen_dicts = [werkdag.__dict__ for werkdag in werkdagen]
                
                uitstootperdag = []


                for werkdag in werkdagen_dicts:
                    rittenperdag = [rit for rit in ritten_dicts if rit['werkdag_idwerkdag'] == werkdag['idwerkdag']]

                    kilometers = 0

                    for rit in rittenperdag:
                        kilometers += rit["aantalkilometers"]
                        print(kilometers)

                    autoCO2 = kilometers * leaseautoVerbruik * 2.369
                    blikjesCO2 = werkdag["aantalblikjesdrinkenophq"] * 0.17
                    beeldschermenCO2 = werkdag["aantalbeeldschermen"] * werkdag["aantalurenbeeldschermanaan"] * 0.055
                    chatGPTCO2 = werkdag["aantalverzoekenaanchatgpt"] * 0.00432
                    sumCO2 = autoCO2 + blikjesCO2 + beeldschermenCO2 + chatGPTCO2

                    dag = {
                        "datum": werkdag["datum"],
                        "kilometers": autoCO2,
                        "blikjes": blikjesCO2,
                        "beeldschermentotaal": beeldschermenCO2,
                        "chatgpt": chatGPTCO2,
                        "sum": sumCO2
                    }

                    uitstootperdag.append(dag)

                return jsonify({'leaseautoverbruik': leaseautoVerbruik, 'uitstootperdag': uitstootperdag})
            else:
                return jsonify({'leasevebruikuto': [], 'ritten': []}), 204
        except Exception as e:
            print(f"Error in carFootprint: {e}")
            return jsonify({'message': 'Er is een fout opgetreden bij het ophalen van de data'}), 500