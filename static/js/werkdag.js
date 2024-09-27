document.getElementById('add_rit_btn').addEventListener('click', handleAddRit);
document.getElementById('basislocatie').addEventListener('change', handleBasislocatieChange);

function getLocatiesData() {
    const locatiesDataElement = document.getElementById('locaties_data');
    return JSON.parse(locatiesDataElement.getAttribute('data-locaties'));
}

function getLocatieByName(locatienaam) {
    const locatiesData = getLocatiesData();
    return locatiesData.find(locatie => locatie.locatienaam === locatienaam);
}

function populateSelectOptions(selectElement, locaties, placeholder, selectedName) {
    selectElement.appendChild(placeholder);
    locaties.forEach(locatie => {
        const option = document.createElement('option');
        option.value = locatie.locatienaam;
        option.textContent = locatie.locatienaam;
        if (selectedName === locatie.locatienaam) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
}

function createPlaceholderOption(placeholderText, isSelected) {
    const placeholderOption = document.createElement('option');
    placeholderOption.text = placeholderText;
    placeholderOption.value = '';
    placeholderOption.disabled = true;
    placeholderOption.selected = isSelected;
    return placeholderOption;
}

function clearRittenContainer() {
    document.getElementById('ritten_container').innerHTML = '';
}

function handleAddRit(event) {
    event.preventDefault();
    console.log('Geklikt op [Voeg rit toe]');
    addRitRow(null, null);
}

function addRitRow(vanKeuze, naarKeuze) {
    const rittenContainer = document.getElementById('ritten_container');
    const locatieData = getLocatiesData();

    const ritRow = document.createElement('div');
    ritRow.classList.add('rit-row');

    const ritFieldVan = createRitField()
    const ritFieldNaar = createRitField()
    const ritFieldKms = createRitField()

    createAndAppendLabel('Van:', ritFieldVan.firstElementChild);
    const ritVanSelect = createSelectElement('rit-van', locatieData, vanKeuze, 'Van');
    ritFieldVan.firstElementChild.appendChild(ritVanSelect);

    if (vanKeuze === 'Anders') {
        voegAdresInvoerToeVoorAnders(ritVanSelect);
    }
    voegEventListenersVoorAndersToeOpSelectVelden(ritVanSelect);

    createAndAppendLabel('Naar:', ritFieldNaar.firstElementChild);
    const ritNaarSelect = createSelectElement('rit-naar', locatieData, naarKeuze, 'Naar');
    ritFieldNaar.firstElementChild.appendChild(ritNaarSelect);

    if (naarKeuze === 'Anders') {
        voegAdresInvoerToeVoorAnders(ritNaarSelect);
    }
    voegEventListenersVoorAndersToeOpSelectVelden(ritNaarSelect);

    createAndAppendLabel('Aantal Kms:', ritFieldKms.firstElementChild);
    const ritKilometersInput = createKilometersInput();
    ritFieldKms.firstElementChild.appendChild(ritKilometersInput);

    const removeBtn = createRemoveButton();

    ritRow.appendChild(removeBtn)
    ritRow.appendChild(ritFieldVan)
    ritRow.appendChild(ritFieldNaar)
    ritRow.appendChild(ritFieldKms)
 
    rittenContainer.appendChild(ritRow);
}

function createAndAppendLabel(text, container) {
    const label = document.createElement('label');
    label.innerText = text;
    container.appendChild(label);
}

function createSelectElement(className, locatieData, selectedName, placeholderText) {
    const selectElement = document.createElement('select');
    selectElement.classList.add(className);

    const placeholderOption = createPlaceholderOption(placeholderText, selectedName === null);
    populateSelectOptions(selectElement, locatieData, placeholderOption, selectedName);
    return selectElement;
}

function createKilometersInput() {
    const input = document.createElement('input');
    input.type = 'number';
    input.step = '0.1';
    input.placeholder = 'Aantal kms';
    input.classList.add('rit-kilometers');
    return input;
}

function createRemoveButton() {
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '❌';
    removeBtn.classList.add('remove-rit-btn');
    removeBtn.addEventListener('click', handleRemoveRit);
    return removeBtn;
}

function handleRemoveRit(event) {
    event.preventDefault();
    const ritRow = event.target.parentElement;
    if (ritRow.classList.contains('rit-row')) {
        console.log('Rit verwijderen');
        ritRow.remove();
    }
}

function handleBasislocatieChange() {
    console.log('Basislocatie gewijzigd');
    const basislocatie = this.value;
    clearRittenContainer();
    if (basislocatie && basislocatie !== 'Thuis') {
        addRitRow('Thuis', basislocatie);
        addRitRow(basislocatie, 'Thuis');
    }
}

function createRitField() {
    const ritFieldVan = document.createElement('div');
    ritFieldVan.classList.add('rit-field');
    
    const ritFieldLabelPlusInput = document.createElement('div');
    ritFieldLabelPlusInput.classList.add('rit-label-plus-input');

    ritFieldVan.appendChild(ritFieldLabelPlusInput)
    return ritFieldVan
}