from models import Medewerker, LeaseAuto, Locatie, Werkdag, Rit
from sanitize import *

# Medewerker functies
def get_medewerker(medewerker_id_str):
    try:
        return Medewerker.fetch_medewerker(medewerker_id_str)
    except Exception as e:
        print(f"Error fetching medewerker: {e}")
        return None

# Leaseauto functies
def get_lease_auto(medewerker_id_str, is_huidige_lease_auto):
    try:
        return LeaseAuto.fetch_lease_auto(medewerker_id_str, is_huidige_lease_auto)
    except Exception as e:
        print(f"Error fetching lease auto: {e}")
        return None

# Locatie functies
def get_locatie_by_name(medewerker_id_str, locatie_naam):
    try:
        return Locatie.fetch_locatie_by_name(medewerker_id_str, locatie_naam)
    except Exception as e:
        print(f"Error fetching locatie by name: {e}")
        return None

def get_locaties_van_medewerker(medewerker_id_str):
    try:
        locaties = Locatie.fetch_locaties(medewerker_id_str)
        sorted_locaties = sorted(locaties, key=lambda locatie: locatie.locatienaam == "Anders")
        return sorted_locaties
    except Exception as e:
        print(f"Error fetching locaties: {e}")
        return None

def get_locatie_ids_van_medewerker(medewerker_id):
    locaties = Locatie.fetch_locaties(medewerker_id)
    return {locatie.idlocatie for locatie in locaties} 
    
def filter_actieve_klantlocaties(locaties):
    try:
        actieveklantlocaties = [locatie for locatie in locaties if locatie.isactieveklantlocatie]
        return actieveklantlocaties
    except Exception as e:
        print(f"Error filtering actieve klantlocaties: {e}")
        return []

def filter_locatie_over_situatie(locaties, situatie, returnLijst):
    try:
        gefilterdelocaties = [locatie for locatie in locaties if locatie.situatie == situatie]
        if returnLijst:
            return gefilterdelocaties
        else:
            return gefilterdelocaties[0]
    except Exception as e:
        print(f"Error filtering locaties over situatie {situatie}: {e}")
        return [] if returnLijst else None
    
# Werkdag functies
def get_werkdag_over_id(werkdagid):
    try:
        return Werkdag.fetch_werkdag_over_id(werkdagid)
    except Exception as e:
        print(f"Error fetching werkdag by ID: {e}")
        return None

def get_werkdag_over_datum(medewerker_id_str, datum):
    try:
        return Werkdag.fetch_werkdag_over_datum(medewerker_id_str, datum)
    except Exception as e:
        print(f"Error fetching werkdag by date {datum}: {e}")
        return None

def get_werkdagen(medewerker_id_str, begindatum, einddatum):
    try:
        return Werkdag.fetch_historie(medewerker_id_str, begindatum, einddatum)
    except Exception as e:
        print(f"Error fetching werkdagen: {e}")
        return None

def create_werkdag(medewerker_id_str, datum, aantal_blikjes, aantal_beeldschermen, aantal_uren_beeldschermen, aantal_chatgpt, basislocatie_id):
    try:
        return Werkdag.create_werkdag(medewerker_id_str, datum, aantal_blikjes, aantal_beeldschermen, aantal_uren_beeldschermen, aantal_chatgpt, basislocatie_id)
    except Exception as e:
        print(f"Error creating werkdag: {e}")
        return None

def validate_werkdag_update(idwerkdag, datum, medewerker_id_str):
    try:
        werkdag_from_db = Werkdag.fetch_werkdag_over_id(idwerkdag)

        if werkdag_from_db is not None:
            if (str(werkdag_from_db.datum) == datum) and (werkdag_from_db.idwerkdag == idwerkdag) and (str(werkdag_from_db.medewerker_idmedewerker) == medewerker_id_str):
                return True
            else:
                return False
        else:
            return False
    except Exception as e:
        print(f"Error validating werkdag: {e}")
        return False
    
def update_werkdag_over_id(idwerkdag, datum, aantal_blikjes, aantal_beeldschermen, aantal_uren_beeldschermen, aantal_chatgpt, basislocatie_id):
    try:
        Werkdag.update_werkdag(idwerkdag, datum, aantal_blikjes, aantal_beeldschermen, aantal_uren_beeldschermen, aantal_chatgpt, basislocatie_id)
    except Exception as e:
        print(f"Error updating werkdag ID {idwerkdag}: {e}")

def delete_werkdag_over_id(id_werkdag, medewerker_id_str):
    try:
        Werkdag.delete_werkdag_over_id(id_werkdag)
    except Exception as e:
        print(f"Error deleting werkdag ID {id_werkdag}: {e}")

# Rit functies
def sanitize_ritten(ritten):
    for rit in ritten:
        rit['vanLatitude'] = parse_float(rit['vanLatitude'], 'van - lat')
        rit['vanLongitude'] = parse_float(rit['vanLongitude'], 'van - lon')
        rit['naarLatitude'] = parse_float(rit['naarLatitude'], 'naar - lat')
        rit['naarLongitude'] = parse_float(rit['naarLongitude'], 'naar - lon')
        rit['vanAdres'] = sanitize_string(rit['vanAdres'], 'van - adres')
        rit['naarAdres'] = sanitize_string(rit['naarAdres'], 'naar - adres')
        rit['kilometers'] = parse_float(rit['kilometers'], 'aantal kms')
        rit['van'] = sanitize_string(rit['van'], 'rit foreign key van')
        rit['naar'] = sanitize_string(rit['naar'], 'rit foreign key naar')

def validate_ritten(ritten, medewerker_id_str):
    valid_ritten = True
    for rit in ritten:
        try:
            locatie_ids_van_mw = get_locatie_ids_van_medewerker(medewerker_id_str)
            if rit.van not in locatie_ids_van_mw or rit.naar not in locatie_ids_van_mw:
                print(f"Error validating rit association to location {rit}")
                valid_ritten = False 

            if rit.werkdag_idwerkdag:
                werkdag_bij_rit = get_werkdag_over_id(rit.werkdag_idwerkdag)
                if werkdag_bij_rit.medewerker_idmedewerker != medewerker_id_str:
                    print(f"Error in rit association to werkdag {rit}")
                    valid_ritten = False
        except Exception as e:
            print(f"Error validating rit {rit}: {e}")
            valid_ritten = False 
    if valid_ritten == False:
        ritten = []

def get_ritten(medewerker_id_str, begindatum, einddatum):
    try:
        return Rit.fetch_ritten(medewerker_id_str, begindatum, einddatum)
    except Exception as e:
        print(f"Error fetching ritten: {e}")
        return None
    
def get_ritten_over_werkdag_id(idwerkdag):
    try:
        return Rit.fetch_ritten_for_werkdag(idwerkdag)
    except Exception as e:
        print(f"Error fetching ritten for werkdag ID {idwerkdag}: {e}")
        return None

def create_ritten(ritten, werkdag_id, medewerker_id_str):
    try:
        for rit in ritten:
            locatie_van = get_locatie_by_name(medewerker_id_str, rit['van'])
            locatie_naar = get_locatie_by_name(medewerker_id_str, rit['naar'])

            if locatie_van.latitude or locatie_van.longitude is None:
                locatie_van.latitude = rit['vanLatitude']
                locatie_van.longitude = rit['vanLongitude']

            if locatie_naar.latitude or locatie_naar.longitude is None:
                locatie_naar.latitude = rit['naarLatitude']
                locatie_naar.longitude = rit['naarLongitude']

            Rit.create_rit(locatie_van.idlocatie, locatie_naar.idlocatie, rit['kilometers'], werkdag_id, locatie_van.latitude, locatie_van.longitude, locatie_naar.latitude, locatie_naar.longitude, rit['vanAdres'], rit['naarAdres'])
    except Exception as e:
        print(f"Error creating ritten: {e}")

def delete_ritten_over_werkdag_id(idwerkdag):
    try:
        Rit.delete_ritten_for_werkdag(idwerkdag)
    except Exception as e:
        print(f"Error deleting ritten for werkdag ID {idwerkdag}: {e}")
