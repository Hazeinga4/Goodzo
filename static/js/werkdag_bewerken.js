document.getElementById('submit_werkdag_btn').addEventListener('click', verwerkWerkdagBewerking);
window.onload = function () {
    const removeKnoppen = document.querySelectorAll('.remove-rit-btn')
    removeKnoppen.forEach(removeBtn => {
        removeBtn.addEventListener('click', handleRemoveRit);
    });
    const selectInvoerVeldenVan = document.querySelectorAll('.rit-van')
    selectInvoerVeldenVan.forEach(select => {
        voegEventListenersVoorAndersToeOpSelectVelden(select)
    });
    const selectInvoerVeldenNaar = document.querySelectorAll('.rit-naar')
    selectInvoerVeldenNaar.forEach(select => {
        voegEventListenersVoorAndersToeOpSelectVelden(select)
    });

    verwerkAdresVoorAndersNaarStraatHuisnummerPlaats()

    const alleAdresAndersInputVelden = [
        ...document.querySelectorAll('.adres-straat'),
        ...document.querySelectorAll('.adres-huisnummer'),
        ...document.querySelectorAll('.adres-plaats')
    ];

    alleAdresAndersInputVelden.forEach(adresinvoer => {
        voegEventListenerToeAanAndersAdresInvoerveld(adresinvoer)
    });
}

function verwerkWerkdagBewerking(e) {
    e.preventDefault();
    console.log('Geklikt op [Bewerk werkdag]');

    const werkdagData = validateAndCollectFormData();

    if (!werkdagData) return;

    const basislocatie = getLocatieByName(werkdagData.basislocatie)
    const basisLocatieId = basislocatie.idlocatie
    werkdagData.basislocatie_id = basisLocatieId

    werkdagId = werkdagData.werkdag_id
    fetch(`/editwerkdag/${werkdagId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(werkdagData),
    })
        .then(response => {
            return response.json().then(data => {
                createFeedbackContainer()
                if (response.status === 200) {
                    successFeedback(document.getElementById('submit_feedback'), 'Werkdag succesvol bewerkt');
                    disableFormElements();
                } else {
                    errorFeedback(document.getElementById('submit_feedback'), data.message || 'Er is een fout opgetreden bij het bewerken van de werkdag');
                }
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            errorFeedback(document.getElementById('submit_feedback'), 'Er is een fout opgetreden bij het bewerken van de werkdag');
        });
}

function verwerkAdresVoorAndersNaarStraatHuisnummerPlaats() {
    const adresInvoerVelden = document.querySelectorAll('.adres-invoer')
    adresInvoerVelden.forEach(adresInvoerVeld => {
        const adresHidden = adresInvoerVeld.querySelector('.adres-hidden')
        const straatInputVeld = adresInvoerVeld.querySelector('.adres-straat')
        const huisnummerInputVeld = adresInvoerVeld.querySelector('.adres-huisnummer')
        const plaatsInputVeld = adresInvoerVeld.querySelector('.adres-plaats')

        if (!adresHidden.value) {
            return
        }
        const splitsAdres = splitAdres(adresHidden.value)
        straatInputVeld.value = splitsAdres.straatnaam
        huisnummerInputVeld.value = splitsAdres.huisnummer
        plaatsInputVeld.value = splitsAdres.plaats
    })
}

function disableFormElements() {
    const inputElements = document.querySelectorAll('input')
    const selectElements = document.querySelectorAll('select')
    const buttonElements = document.querySelectorAll('button:not(#navigatie button)')

    inputElements.forEach((input) => {
        input.disabled = true
    })
    selectElements.forEach((select) => {
        select.disabled = true
    })
    buttonElements.forEach((button) => {
        button.disabled = true
    })
}