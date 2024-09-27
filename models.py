import mysql.connector  # type: ignore
from config import Configuratie

def get_connection():
    try:
        return mysql.connector.connect(
            host=Configuratie.DATABASE_HOST,
            user=Configuratie.DATABASE_USER,
            password=Configuratie.DATABASE_PASSWORD,
            database=Configuratie.DATABASE_NAME
        )
    except mysql.connector.Error as err:
        print(f"Error establishing a database connection: {err}")
        raise

class Medewerker:
    def __init__(self, idMedewerker, Personeelsnummer, Voornaam, Tussenvoegsel, Achternaam):
        self.idmedewerker = idMedewerker
        self.personeelsnummer = Personeelsnummer
        self.voornaam = Voornaam
        self.tussenvoegsel = Tussenvoegsel
        self.achternaam = Achternaam

    @classmethod
    def fetch_medewerker(cls, medewerkerId):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()
            query = "SELECT * FROM medewerker WHERE idMedewerker = %s"
            cursor.execute(query, (medewerkerId,))
            row = cursor.fetchone()
            cursor.close()
            cnx.close()
            if row:
                medewerker = cls(*row)
                return medewerker
            else:
                return None
        except mysql.connector.Error as err:
            print(f"Error fetching medewerker with ID {medewerkerId}: {err}")
            raise

class LeaseAuto:
    def __init__(self, idLeaseAuto, Kenteken, Merk, Type, Model, VerbruikPerKilometer, IsHuidigeLeaseAuto, Medewerker_idMedewerker):
        self.idleaseauto = idLeaseAuto
        self.kenteken = Kenteken
        self.merk = Merk
        self.type = Type
        self.model = Model
        self.verbruikperkilometer = VerbruikPerKilometer
        self.ishuidigeleaseauto = IsHuidigeLeaseAuto
        self.medewerker_idmedewerker = Medewerker_idMedewerker

    @classmethod
    def fetch_lease_auto(cls, medewerkerId, IsHuidigeLeaseAuto):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()
            query = "SELECT * FROM leaseauto WHERE IsHuidigeLeaseAuto = %s AND Medewerker_idMedewerker = %s"
            cursor.execute(query, (IsHuidigeLeaseAuto, medewerkerId))
            row = cursor.fetchone()
            cursor.close()
            cnx.close()
            if row:
                leaseauto = cls(*row)
                return leaseauto
            else:
                return None
        except mysql.connector.Error as err:
            print(f"Error fetching lease auto for medewerker ID {medewerkerId}: {err}")
            raise

class Locatie:
    def __init__(self, idLocatie, Situatie, LocatieNaam, Plaats, Straat, Huisnummer, Latitude, Longitude, IsActieveKlantlocatie, Medewerker_idMedewerker):
        self.idlocatie = idLocatie
        self.situatie = Situatie
        self.locatienaam = LocatieNaam
        self.plaats = Plaats
        self.straat = Straat
        self.huisnummer = Huisnummer
        self.latitude = Latitude
        self.longitude = Longitude
        self.isactieveklantlocatie = IsActieveKlantlocatie
        self.mederwerker_idmedewerker = Medewerker_idMedewerker

    @classmethod
    def fetch_locatie_by_name(cls, medewerkerId, locatieNaam):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()
            query = "SELECT * FROM locatie WHERE LocatieNaam = %s AND Medewerker_idMedewerker = %s"
            cursor.execute(query, (locatieNaam, medewerkerId))

            row = cursor.fetchone()
            cursor.close()
            cnx.close()
            if row:
                locatie = cls(*row)
                return locatie
            else:
                return None
        except mysql.connector.Error as err:
            print(f"Error fetching locatie with name {locatieNaam} for medewerker ID {medewerkerId}: {err}")
            raise

    @classmethod
    def get_locatie_by_id(cls, idLocatie):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()
            query = "SELECT idLocatie FROM locatie WHERE idLocatie = %s"
            cursor.execute(query, (idLocatie,))
            row = cursor.fetchone()
            cursor.close()
            cnx.close()
            if row:
                return row[0]
            else:
                return None
        except mysql.connector.Error as err:
            print(f"Error fetching locatie with ID {idLocatie}: {err}")
            raise

    @classmethod
    def fetch_locaties(cls, medewerkerId):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()
            query = "SELECT * FROM locatie WHERE Medewerker_idMedewerker = %s"
            cursor.execute(query, (medewerkerId,))
            rows = cursor.fetchall()
            cursor.close()
            cnx.close()
            if rows:
                locaties = [cls(*row) for row in rows]
                return locaties
            else:
                return []
        except mysql.connector.Error as err:
            print(f"Error fetching locaties for medewerker ID {medewerkerId}: {err}")
            raise

class Werkdag:
    def __init__(self, idWerkdag, Datum, AantalBlikjesDrinkenOpHQ, AantalBeeldschermen, AantalUrenBeeldschermenAan, AantalVerzoekenAanChatGPT, Medewerker_idMedewerker, BasisLocatie_idLocatie, LocatieNaam=None):
        self.idwerkdag = idWerkdag
        self.datum = Datum
        self.aantalblikjesdrinkenophq = AantalBlikjesDrinkenOpHQ
        self.aantalbeeldschermen = AantalBeeldschermen
        self.aantalurenbeeldschermanaan = AantalUrenBeeldschermenAan
        self.aantalverzoekenaanchatgpt = AantalVerzoekenAanChatGPT
        self.medewerker_idmedewerker = Medewerker_idMedewerker
        self.basislocatie_idlocatie = BasisLocatie_idLocatie
        self.locatienaam = LocatieNaam

    @classmethod
    def fetch_historie(cls, medewerkerId, begindatum, einddatum):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()
            query = """
                SELECT w.*, l.LocatieNaam
                FROM werkdag w
                JOIN locatie l ON w.BasisLocatie_idLocatie = l.idLocatie
                WHERE w.Medewerker_idMedewerker = %s AND w.Datum BETWEEN %s AND %s
                ORDER BY w.Datum ASC
            """
            cursor.execute(query, (medewerkerId, begindatum, einddatum))
            rows = cursor.fetchall()
            cursor.close()
            cnx.close()
            if rows:
                werkdagen = [cls(*row[:-1], LocatieNaam=row[-1]) for row in rows]
                return werkdagen
            else:
                return []
        except mysql.connector.Error as err:
            print(f"Error fetching historie for medewerker ID {medewerkerId}: {err}")
            raise

    @classmethod
    def create_werkdag(cls, medewerkerId, datum, aantal_blikjes, aantal_beeldschermen, aantal_uren_beeldschermen, aantal_chatgpt, basislocatie_id):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()
            query = ("INSERT INTO werkdag (Datum, AantalBlikjesDrinkenOpHQ, AantalBeeldschermen, AantalUrenBeeldschermenAan, AantalVerzoekenAanChatGPT, Medewerker_idMedewerker, BasisLocatie_idLocatie) "
                     "VALUES (%s, %s, %s, %s, %s, %s, %s)")
            cursor.execute(query, (datum, aantal_blikjes, aantal_beeldschermen, aantal_uren_beeldschermen, aantal_chatgpt, medewerkerId, basislocatie_id))
            werkdag_id = cursor.lastrowid
            cnx.commit()
            cursor.close()
            cnx.close()
            return werkdag_id
        except mysql.connector.Error as err:
            print(f"Error creating werkdag for medewerker ID {medewerkerId}: {err}")
            raise

    @classmethod 
    def delete_werkdag_over_id(cls, idwerkdag):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()
            
            query_delete_ritten = "DELETE FROM rit WHERE Werkdag_idWerkdag = %s"
            cursor.execute(query_delete_ritten, (idwerkdag,))
            
            query_delete_werkdag = "DELETE FROM werkdag WHERE idWerkdag = %s"
            cursor.execute(query_delete_werkdag, (idwerkdag,))
            
            cnx.commit()
            cursor.close()
            cnx.close()
        except mysql.connector.Error as err:
            print(f"Error deleting werkdag with ID {idwerkdag}: {err}")
            raise
    
    @classmethod
    def fetch_werkdag_over_id(cls, idwerkdag):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()
            query = "SELECT * FROM werkdag WHERE idWerkdag = %s"
            cursor.execute(query, (idwerkdag,))
            row = cursor.fetchone()
            cursor.close()
            cnx.close()
            if row:
                return cls(*row)
            else:
                return None
        except mysql.connector.Error as err:
            print(f"Error fetching werkdag with ID {idwerkdag}: {err}")
            raise
    
    @classmethod
    def fetch_werkdag_over_datum(cls, medewerkerid, datum):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()
            query = "SELECT * FROM werkdag WHERE datum = %s AND Medewerker_idMedewerker = %s"
            cursor.execute(query, (datum, medewerkerid))
            row = cursor.fetchone()
            cursor.close()
            cnx.close()
            if row:
                return cls(*row)
            else:
                return None
        except mysql.connector.Error as err:
            print(f"Error fetching werkdag for medewerker ID {medewerkerid} on date {datum}: {err}")
            raise

    @classmethod
    def update_werkdag(cls, idwerkdag, datum, aantal_blikjes, aantal_beeldschermen, aantal_uren_beeldschermen, aantal_chatgpt, basislocatie_id):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()
            query = ("UPDATE werkdag SET Datum=%s, AantalBlikjesDrinkenOpHQ=%s, AantalBeeldschermen=%s, AantalUrenBeeldschermenAan=%s, AantalVerzoekenAanChatGPT=%s, BasisLocatie_idLocatie=%s "
                     "WHERE idWerkdag=%s")
            cursor.execute(query, (datum, aantal_blikjes, aantal_beeldschermen, aantal_uren_beeldschermen, aantal_chatgpt, basislocatie_id, idwerkdag))
            cnx.commit()
            cursor.close()
            cnx.close()
        except mysql.connector.Error as err:
            print(f"Error updating werkdag with ID {idwerkdag}: {err}")
            raise

class Rit:
    def __init__(self, idRit, VanLatitude, VanLongitude, NaarLatitude, NaarLongitude, VanAdres, NaarAdres, AantalKilometers, Werkdag_idWerkdag, Van, Naar):
        self.idrit = idRit
        self.vanlatitude = VanLatitude
        self.vanlongitude = VanLongitude
        self.naarlatitude = NaarLatitude
        self.naarlongitude = NaarLongitude
        self.vanadres = VanAdres
        self.naaradres = NaarAdres
        self.aantalkilometers = AantalKilometers
        self.werkdag_idwerkdag = Werkdag_idWerkdag
        self.van = Van
        self.naar = Naar

    @classmethod
    def fetch_ritten(cls, medewerkerId, begindatum, einddatum):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()
            query = ("SELECT r.idRit, r.VanLatitude, r.VanLongitude, r.NaarLatitude, r.NaarLongitude, r.VanAdres, r.NaarAdres, r.AantalKilometers, r.Werkdag_idWerkdag, r.Van, r.Naar "
                     "FROM GoodCO2gether.Rit r "
                     "JOIN GoodCO2gether.Werkdag w ON r.Werkdag_idWerkdag = w.idWerkdag "
                     "JOIN GoodCO2gether.Medewerker m ON w.Medewerker_idMedewerker = m.idMedewerker "
                     "WHERE w.Datum BETWEEN %s AND %s AND m.idMedewerker = %s;")
            cursor.execute(query, (begindatum, einddatum, medewerkerId))
            rows = cursor.fetchall()
            cursor.close()
            cnx.close()
            if rows:
                ritten = [cls(*row) for row in rows]
                return ritten
            else:
                return []
        except mysql.connector.Error as err:
            print(f"Error fetching ritten for medewerker ID {medewerkerId} between {begindatum} and {einddatum}: {err}")
            raise

    @classmethod
    def create_rit(cls, Van, Naar, AantalKilometers, Werkdag_idWerkdag, VanLatitude, VanLongitude, NaarLatitude, NaarLongitude, VanAdres, NaarAdres):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()

            query = ("INSERT INTO rit (Van, Naar, AantalKilometers, Werkdag_idWerkdag, VanLatitude, VanLongitude, NaarLatitude, NaarLongitude, VanAdres, NaarAdres) "
                     "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            cursor.execute(query, (Van, Naar, AantalKilometers, Werkdag_idWerkdag, VanLatitude, VanLongitude, NaarLatitude, NaarLongitude, VanAdres, NaarAdres))
            cnx.commit()
            cursor.close()
            cnx.close()
        except mysql.connector.Error as err:
            print(f"Error creating rit from {Van} to {Naar} for Werkdag ID {Werkdag_idWerkdag}: {err}")
            raise

    @classmethod
    def fetch_ritten_for_werkdag(cls, idwerkdag):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()
            query = "SELECT * FROM rit WHERE Werkdag_idWerkdag = %s"
            cursor.execute(query, (idwerkdag,))
            rows = cursor.fetchall()
            cursor.close()
            cnx.close()
            if rows:
                return [cls(*row) for row in rows]
            else:
                return []
        except mysql.connector.Error as err:
            print(f"Error fetching ritten for Werkdag ID {idwerkdag}: {err}")
            raise

    @classmethod
    def delete_ritten_for_werkdag(cls, idwerkdag):
        try:
            cnx = get_connection()
            cursor = cnx.cursor()
            query = "DELETE FROM rit WHERE Werkdag_idWerkdag = %s"
            cursor.execute(query, (idwerkdag,))
            cnx.commit()
            cursor.close()
            cnx.close()
        except mysql.connector.Error as err:
            print(f"Error deleting ritten for Werkdag ID {idwerkdag}: {err}")
            raise
