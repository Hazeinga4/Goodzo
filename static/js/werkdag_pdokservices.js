function verwerkPdokApiCall(result, straatInput, huisnrInput, plaatsInput) {
    console.log('Resultaat PDOK:', result)
    const bestaandeFeedbackLatLon = plaatsInput.parentElement.parentElement.querySelector('.result-latlon');
    const bestaandeLatitude = plaatsInput.parentElement.querySelector('.adres-latitude');
    const bestaandeLongitude = plaatsInput.parentElement.querySelector('.adres-longitude');

    let resultLatLonText
    let latitude
    let longitude

    if (result === null) {
        resultLatLonText = 'Adres is niet valide'
        latitude = ''
        longitude = ''

    } else {
        let aangepastResult = splitAdres(result.weergavenaam);

        straatInput.value = aangepastResult.straatnaam
        huisnrInput.value = aangepastResult.huisnummer
        plaatsInput.value = aangepastResult.plaats

        resultLatLonText = 'latitude: ' + result.latitude + ', longitude: ' + result.longitude
        latitude = result.latitude
        longitude = result.longitude
    }

    if (bestaandeFeedbackLatLon && bestaandeFeedbackLatLon.classList.contains('result-latlon')) {
        bestaandeFeedbackLatLon.innerText = resultLatLonText;
    } else {
        let nieuweFeedbackLatLon = document.createElement('div');
        nieuweFeedbackLatLon.className = 'result-latlon';
        nieuweFeedbackLatLon.innerText = resultLatLonText;
        plaatsInput.parentElement.insertAdjacentElement('afterend', nieuweFeedbackLatLon);
    }

    if (bestaandeLatitude && bestaandeLatitude.classList.contains('adres-latitude')) {
        bestaandeLatitude.value = latitude
    } else {
        let nieuweLatitudeInput = document.createElement('input');
        nieuweLatitudeInput.className = 'adres-latitude hidden';
        nieuweLatitudeInput.type = 'text'
        nieuweLatitudeInput.value = latitude;
        plaatsInput.insertAdjacentElement('afterend', nieuweLatitudeInput);
    }

    if (bestaandeLongitude && bestaandeLongitude.classList.contains('adres-longitude')) {
        bestaandeLongitude.value = longitude;
    } else {
        let nieuweLongitudeInput = document.createElement('input');
        nieuweLongitudeInput.className = 'adres-longitude hidden';
        nieuweLongitudeInput.type = 'text'
        nieuweLongitudeInput.value = longitude;
        plaatsInput.insertAdjacentElement('afterend', nieuweLongitudeInput);
    }
}

function voegEventListenerToeAanAndersAdresInvoerveld(adresinvoer) {
    adresinvoer.addEventListener('change', function () {
        controleerAdresViaApi(adresinvoer.parentElement);
    });
}

function maakAdresVanStraatHuisnrPlaats(ritStraat, ritHuisnummer, ritPlaats) {
    const adres = ritStraat + ' ' + ritHuisnummer + ', ' + ritPlaats
    return adres
}

function voegEventListenersVoorAndersToeOpSelectVelden(select) {
    select.addEventListener('change', function () {
        if (select.value != 'Anders') {
            verwijderAdresInvoer(select)
        } else {
            voegAdresInvoerToeVoorAnders(select)
        }
    })
}

function verwijderAdresInvoer(select) {
    const adresDiv = select.parentElement.nextElementSibling
    if (adresDiv && adresDiv.classList.contains('adres-invoer')) {
        adresDiv.remove()
    }
}

function voegAdresInvoerToeVoorAnders(select) {
    const adresInvoerDiv = document.createElement('div')
    adresInvoerDiv.classList.add('adres-invoer')

    const straatInput = document.createElement('input')
    straatInput.type = 'text'
    straatInput.placeholder = 'Straat'
    straatInput.value = 'Nieuwezijds Voorburgwal' // Weghalen, data voor snel testen
    straatInput.classList.add('adres-straat')

    const huisnummerInput = document.createElement('input')
    huisnummerInput.type = 'text'
    huisnummerInput.placeholder = 'Huisnr'
    huisnummerInput.value = '147' // Weghalen, data voor snel testen
    huisnummerInput.classList.add('adres-huisnummer')

    const plaatsInput = document.createElement('input')
    plaatsInput.type = 'text'
    plaatsInput.placeholder = 'Plaats'
    plaatsInput.value = 'Amsterdam' // Weghalen, data voor snel testen
    plaatsInput.classList.add('adres-plaats')

    adresInvoerDiv.appendChild(straatInput)
    adresInvoerDiv.appendChild(huisnummerInput)
    adresInvoerDiv.appendChild(plaatsInput)
    select.parentElement.insertAdjacentElement('afterend', adresInvoerDiv)

    voegEventListenerToeAanAndersAdresInvoerveld(straatInput)
    voegEventListenerToeAanAndersAdresInvoerveld(huisnummerInput)
    voegEventListenerToeAanAndersAdresInvoerveld(plaatsInput)
}

function splitAdres(adres) {
    // Verwijder de postcode door te splitsen op de komma en het tweede deel te nemen
    let [straatEnNummer, plaatsEnPostcode] = adres.split(',').map(item => item.trim());

    // Gebruik een regex om het huisnummer te vinden, samen met eventuele toevoegingen
    let huisnummerMatch = straatEnNummer.match(/\d+\s?[a-zA-Z]*$/);
    
    if (huisnummerMatch) {
        let huisnummer = huisnummerMatch[0].trim();
        let straatnaam = straatEnNummer.replace(huisnummerMatch[0], '').trim();
        
        // Controleer of er mogelijk een postcode aanwezig is en verwijder deze, indien aanwezig
        let plaats = plaatsEnPostcode.replace(/^\d{4}\s?[A-Z]{2}\s/, '').trim();

        return {
            straatnaam: straatnaam,
            huisnummer: huisnummer,
            plaats: plaats
        };
    }

    // Fallback in geval van een onverwacht format
    return null;
}