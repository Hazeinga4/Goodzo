document.getElementById('vandaag_btn').addEventListener('click', zetDatumNaarVandaag);
document.getElementById('submit_werkdag_btn').addEventListener('click', verwerkNieuweWerkdagInvoer);

function verwerkNieuweWerkdagInvoer(e) {
    e.preventDefault();
    console.log('Geklikt op [Voer werkdag in]');
    
    const werkdagData = validateAndCollectFormData();
    
    if (!werkdagData) return;

    fetch('/werkdag/toevoegen', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(werkdagData),
    })
    .then(response => {
        return response.json().then(data => {
            createFeedbackContainer()
            const feedbackContainer = document.getElementById('submit_feedback');
            if (response.status === 201) {
                // Succesvolle feedback en form resetten
                successFeedback(feedbackContainer, 'Werkdag succesvol toegevoegd');
                clearForm(); // Reset invoervelden
                clearRitten(); // Reset ritten
            } else {
                errorFeedback(feedbackContainer, data.message || 'Er is een fout opgetreden bij het toevoegen van de werkdag');
            }
        });
    })
    .catch((error) => {
        console.error('Error:', error);
        const feedbackContainer = document.getElementById('submit_feedback');
        errorFeedback(feedbackContainer, 'Er is een fout opgetreden bij het toevoegen van de werkdag');
    });
}

function clearForm() {
    document.getElementById('datum').value = ''; // Leeg de datum
    document.getElementById('basislocatie').value = ''; // Leeg de basislocatie
    document.getElementById('blikjes').value = ''; // Leeg aantal blikjes
    document.getElementById('beeldscherm_aantal').value = ''; // Leeg aantal beeldschermen
    document.getElementById('beeldscherm_uren').value = ''; // Leeg aantal uren beeldscherm
    document.getElementById('aantal_chatgpt').value = ''; // Leeg aantal AI-verzoeken
}

function clearRitten() {
    const rittenContainer = document.getElementById('ritten_container');
    rittenContainer.innerHTML = ''; // Maak de rittencontainer leeg
}

function zetDatumNaarVandaag(e) {
    e.preventDefault();
    const datumInput = document.getElementById('datum');
    const today = new Date().toISOString().split('T')[0];
    datumInput.value = today;
}