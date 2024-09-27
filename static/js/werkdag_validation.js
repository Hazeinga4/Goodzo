function parseAdres(adres) {
    const regex = /^(.+?)\s(\d+\S*)[,]\s(.+)$/;
    const matches = adres.match(regex);

    if (matches) {
        return {
            straat: matches[1],
            huisnummer: matches[2],
            plaats: matches[3]
        };
    } else {
        return {
            straat: null,
            huisnummer: null,
            plaats: null
        };
    }
}

function controleerAdresViaApi(adresDiv) {
    // console.log(adresDiv)
    const straatInput = adresDiv.querySelector('.adres-straat')
    const huisnrInput = adresDiv.querySelector('.adres-huisnummer')
    const plaatsInput = adresDiv.querySelector('.adres-plaats')

    const straatValue = straatInput.value
    const huisnrValue = huisnrInput.value
    const plaatsValue = plaatsInput.value
    // console.log(straatInput, huisnrInput, plaatsInput)

    const validStraat = heeftHoofdOfKleineLetter(straatValue)
    const validPlaats = heeftHoofdOfKleineLetter(plaatsValue)
    const validHuisnr = bevatGetal(huisnrValue)

    if (validStraat && validHuisnr && validPlaats) {
        const adres = maakAdresVanStraatHuisnrPlaats(straatValue, huisnrValue, plaatsValue)
        console.log(adres)
        getLatLongFromAddress(adres).then(result => {
            if (result) {
                verwerkPdokApiCall(result, straatInput, huisnrInput, plaatsInput)
            } else {
                console.log('No coordinates found for the provided address.');
                verwerkPdokApiCall(null, straatInput, huisnrInput, plaatsInput)
            }
        }).catch(error => {
            console.error(error);
            return null
        });
    }
}

function heeftHoofdOfKleineLetter(str) {
    const heeftHoofdletter = /[A-Z]/.test(str)
    const heeftKleineLetter = /[a-z]/.test(str)

    return heeftHoofdletter || heeftKleineLetter
}

function bevatGetal(str) {
    const heeftGetal = /[0-9]/.test(str)

    return heeftGetal
}

function clearForm() {
    document.getElementById('datum').value = ''
    document.getElementById('basislocatie').value = ''
    document.getElementById('blikjes').value = ''
    document.getElementById('beeldscherm_aantal').value = ''
    document.getElementById('beeldscherm_uren').value = ''
    document.getElementById('aantal_chatgpt').value = ''
}

function createFeedbackContainer() {
    const feedbackContainer = document.getElementById('submit_feedback')
    if (!feedbackContainer) {
        const newFeedbackContainer = document.createElement('div')
        newFeedbackContainer.id = 'submit_feedback'
        document
            .getElementById('submit_werkdag_btn')
            .insertAdjacentElement('afterend', newFeedbackContainer)
    }
}

function clearFeedback(el) {
    if (el) {
        let feedbackSpan = el.parentElement.querySelector('.feedback')
        if (feedbackSpan) {
            feedbackSpan.remove()
        }
    }
}

function errorFeedback(el, msg) {
    clearFeedback(el)
    let feedbackSpan = document.createElement('span')
    feedbackSpan.classList.add('feedback', 'error')
    feedbackSpan.textContent = msg
    el.parentElement.appendChild(feedbackSpan)
}

function successFeedback(el, msg) {
    clearFeedback(el)
    let feedbackSpan = document.createElement('span')
    feedbackSpan.classList.add('feedback', 'success')
    feedbackSpan.textContent = msg
    el.appendChild(feedbackSpan)
}

function validateAndCollectFormData() {
    // Validation feedback op alles behalve de ritten
    const datumInput = document.getElementById('datum')
    const basislocatieInput = document.getElementById('basislocatie')
    const numberInputsArray = [
        document.getElementById('blikjes'),
        document.getElementById('beeldscherm_aantal'),
        document.getElementById('beeldscherm_uren'),
        document.getElementById('aantal_chatgpt')
    ];
    const rittenInputsArray = getRitInvoerVelden()

    const validBasisgegevens = handleBasisGegevensWerkdagFeedback(datumInput, basislocatieInput, numberInputsArray)
    const validRitgegevens = handleRitGegevensWerkdagFeedback(rittenInputsArray)

    console.log('Valid basis: ' + validBasisgegevens)
    console.log('Valid ritten: ' + validRitgegevens)

    if (!(validBasisgegevens && validRitgegevens)) {
        logFormError();
        return null
    }

    // Collect formdata
    const blikjesInput = numberInputsArray[0]
    const aantalBeeldschermInput = numberInputsArray[1]
    const urenBeeldschermInput = numberInputsArray[2]
    const aantalAiInput = numberInputsArray[3]

    const formData = {
        werkdag_id: document.getElementById('werkdag_id') ? document.getElementById('werkdag_id').value : null,
        datum: datumInput.value,
        basislocatie: basislocatieInput.value,
        aantal_blikjes: blikjesInput.value,
        aantal_beeldschermen: aantalBeeldschermInput.value,
        aantal_uren_beeldschermen: urenBeeldschermInput.value,
        aantal_chatgpt: aantalAiInput.value,
        ritten: collectRittenData()
    };

    console.log(formData)
    return formData;
}

function getRitInvoerVelden() {
    // Zoek naar alle elementen met de class .rit-row
    const rows = document.querySelectorAll('.rit-row');
    const ritDataArray = [];

    rows.forEach(row => {
        const ritVan = row.querySelector('.rit-van');
        const ritNaar = row.querySelector('.rit-naar');
        const ritKilometers = row.querySelector('.rit-kilometers');

        let vanData = null;
        let naarData = null;

        // Controleer of rit-van de waarde "Anders" heeft
        if (ritVan && ritVan.value === 'Anders') {
            vanData = {
                straat: row.querySelector('.adres-straat'),
                huisnummer: row.querySelector('.adres-huisnummer'),
                plaats: row.querySelector('.adres-plaats'),
                latitude: row.querySelector('.adres-latitude'),
                longitude: row.querySelector('.adres-longitude')
            };
        }

        // Controleer of rit_naar de waarde "Anders" heeft
        if (ritNaar && ritNaar.value === 'Anders') {
            naarData = {
                straat: row.querySelector('.adres-straat'),
                huisnummer: row.querySelector('.adres-huisnummer'),
                plaats: row.querySelector('.adres-plaats'),
                latitude: row.querySelector('.adres-latitude'),
                longitude: row.querySelector('.adres-longitude')
            };
        }

        const rowArray = [
            ritVan,
            vanData, // kan null zijn als rit-van niet "Anders" is
            ritNaar,
            naarData, // kan null zijn als rit-naar niet "Anders" is
            ritKilometers
        ];

        // Voeg de array van deze rij toe aan de hoofdlijst
        ritDataArray.push(rowArray);
    });

    return ritDataArray;
}

function collectRittenData() {
    const ritten = [];
    const ritRows = document.querySelectorAll('.rit-row');

    ritRows.forEach(row => {
        const ritVan = row.querySelector('.rit-van').value;
        const ritNaar = row.querySelector('.rit-naar').value;
        const ritKilometers = parseFloat(row.querySelector('.rit-kilometers').value);

        const vanData = collectLocationData(ritVan, row);
        const naarData = collectLocationData(ritNaar, row);

        ritten.push({
            van: ritVan ? ritVan : null,
            naar: ritNaar ? ritNaar : null,
            kilometers: ritKilometers ? ritKilometers : null,
            vanLatitude: vanData && vanData.latitude ? vanData.latitude : null,
            vanLongitude: vanData && vanData.longitude ? vanData.longitude : null,
            naarLatitude: naarData && naarData.latitude ? naarData.latitude : null,
            naarLongitude: naarData && naarData.longitude ? naarData.longitude : null,
            vanAdres: vanData && vanData.address ? vanData.address : null,
            naarAdres: naarData && naarData.address ? naarData.address : null
        });
    });

    return ritten;
}

function collectLocationData(locatieNaam, row) {
    if (locatieNaam === '') {
        return null
    }
    else if (locatieNaam === 'Anders') {
        const straat = row.querySelector('.adres-straat').value;
        const huisnummer = row.querySelector('.adres-huisnummer').value;
        const plaats = row.querySelector('.adres-plaats').value;
        const latitude = row.querySelector('.adres-latitude').value;
        const longitude = row.querySelector('.adres-longitude').value;
        const address = `${straat} ${huisnummer}, ${plaats}`;

        return { latitude, longitude, address };
    } else {
        const locatieNietAnders = getLocatieByName(locatieNaam);
        const address = `${locatieNietAnders.straat} ${locatieNietAnders.huisnummer}, ${locatieNietAnders.plaats}`;
        return { latitude: locatieNietAnders.latitude, longitude: locatieNietAnders.longitude, address };
    }
}

function isValidDate(dateString) {
    let day, month, year;
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Scenario 1: yyyy-mm-dd
        [year, month, day] = dateString.split('-').map(Number);
    } else if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        // Scenario 2: dd-mm-yyyy
        [day, month, year] = dateString.split('-').map(Number);
    } else {
        return false;
    }

    if (!year || !month || !day || year < 1000 || month < 1 || month > 12 || day < 1) {
        return false;
    }

    const date = new Date(year, month - 1, day);
    const validDate = date.getFullYear() === year && date.getMonth() === (month - 1) && date.getDate() === day
    return validDate;
}

function isValidString(inputString) {
    return inputString && inputString.length >= 1;
}


function isValidBasislocatie(basislocatieString) {
    const locatiesData = document.getElementById('locaties_data').getAttribute('data-locaties');
    const locaties = JSON.parse(locatiesData);
    const isValid = locaties.some(locatie => locatie.locatienaam === basislocatieString);
    return isValid;
}

function isValidNumber(value, isMandatory) {
    if (isMandatory && (value === null || value === undefined || value === '')) {
        return false;
    }
    if (!isMandatory && (value === null || value === undefined || value === '')) {
        return true;
    }
    const number = Number(value);
    return !isNaN(number) && number >= 0;
}


function handleBasisGegevensWerkdagFeedback(datumInput, basislocatieInput, numberInputsArray) {
    const dateFeedback = 'Voer een geldige datum in'
    const basisLocatieFeedback = 'Kies een basislocatie'
    const nummerInvoerFeedback = 'Vul een geldig positief getal in'
    let validFormData = true

    // Valideer de datum
    if (!isValidDate(datumInput.value)) {
        errorFeedback(datumInput, dateFeedback)
        validFormData = false
    } else {
        clearFeedback(datumInput)
    }

    // Valideer de basislocatie
    if (!isValidBasislocatie(basislocatieInput.value)) {
        errorFeedback(basislocatieInput, basisLocatieFeedback)
        validFormData = false
    } else {
        clearFeedback(basislocatieInput)
    }

    // Valideer alle getalinput-velden
    numberInputsArray.forEach(input => {
        if (!isValidNumber(input.value, false)) {
            errorFeedback(input, nummerInvoerFeedback)
            validFormData = false
        } else {
            clearFeedback(input)
        }
    });
    return validFormData
}

function handleRitGegevensWerkdagFeedback(rittenInputsArray) {
    console.log('Ritten:', rittenInputsArray)

    const locatieNietGekozenFeedback = 'Kies een locatie'
    const locatieAndersFeedback = 'Voer een gevalideerd adres in'
    const locatieKilometersFeedback = 'Voer een geldige waarde in'

    let validFormData = true

    rittenInputsArray.forEach(ritRowInputs => {
        if (!(!!(ritRowInputs[0].value))) {
            errorFeedback(ritRowInputs[0], locatieNietGekozenFeedback)
            validFormData = false
        } else {
            clearFeedback(ritRowInputs[0])
        }

        if (!(!!(ritRowInputs[2].value))) {
            errorFeedback(ritRowInputs[2], locatieNietGekozenFeedback)
            validFormData = false
        } else {
            clearFeedback(ritRowInputs[2])
        }

        if (!isValidNumber(ritRowInputs[4].value, true)) {
            errorFeedback(ritRowInputs[4], locatieKilometersFeedback)
            validFormData = false
        } else {
            clearFeedback(ritRowInputs[4])
        }

        if (ritRowInputs[0].value === 'Anders') {
            if (!(ritRowInputs[1].latitude && ritRowInputs[1].longitude)) {
                console.log('Geen latlon gevonden. Adres is niet valide')
                errorFeedback(ritRowInputs[0], locatieAndersFeedback)
                validFormData = false
            } else if
                (!(!!(ritRowInputs[1].huisnummer.value) && (isValidNumber(ritRowInputs[1].latitude.value, true)) && (isValidNumber(ritRowInputs[1].longitude.value, true)) && !!(ritRowInputs[1].plaats.value) && (!!(ritRowInputs[1].straat.value)))) {
                console.log('Adresdata is niet valide')
                errorFeedback(ritRowInputs[0], locatieAndersFeedback)
                validFormData = false
            } else {
                clearFeedback(ritRowInputs[0])
            }
        }

        if (ritRowInputs[2].value === 'Anders') {
            if (!(ritRowInputs[3].latitude && ritRowInputs[3].longitude)) {
                console.log('Geen latlon gevonden. Adres is niet valide')
                errorFeedback(ritRowInputs[2], locatieAndersFeedback)
                validFormData = false
            } else if
                (!(!!(ritRowInputs[3].huisnummer.value) && (isValidNumber(ritRowInputs[3].latitude.value, true)) && (isValidNumber(ritRowInputs[3].longitude.value, true)) && !!(ritRowInputs[3].plaats.value) && (!!(ritRowInputs[3].straat.value)))) {
                errorFeedback(ritRowInputs[2], locatieAndersFeedback)
                validFormData = false
            } else {
                clearFeedback(ritRowInputs[2])
            }
        }        
    })
    return validFormData
}


function logFormError() {
    console.warn('Er zijn fouten in het formulier. Corrigeer deze en probeer opnieuw.');
}