import datetime
import html

# Helper functie om strings naar integer te converteren en te valideren
def parse_int(value, field_name):
    try:
        return int(value)
    except (ValueError, TypeError):
        print("Invalid input for " + field_name + "Expected an integer.")
        return 0
    
# Helper functie om strings naar integer te converteren en te valideren
def parse_float(value, field_name):
    try:
        return float(value)
    except (ValueError, TypeError):
        print("Invalid input for " + field_name + "Expected a float.")
        return 0

# Helper functie om strings naar datum te converteren en te valideren
def parse_date(value, field_name):
    try:
        datum = datetime.datetime.strptime(value, '%Y-%m-%d').date()
        return value
    except (ValueError, TypeError):
        print("Invalid input for " + field_name + "Expected a date in 'YYYY-MM-DD' format.")
        return '1970-01-01'

# Helper functie om strings te valideren
def sanitize_string(value, field_name):
    if not isinstance(value, str):
        print("Invalid input for " + field_name + "Expected a string.")
        return None
    return html.escape(value)