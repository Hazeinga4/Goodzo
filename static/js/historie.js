function errorFeedback(el, msg) {
    clearFeedback(el);
    let errorSpan = document.createElement('span');
    errorSpan.classList.add('error');
    errorSpan.textContent = msg;
    el.parentNode.insertBefore(errorSpan, el.nextSibling);
}

document.getElementById('historie_btn').addEventListener('click', function (e) {
    document.getElementById("historie_from_db").innerHTML = ''; // Zodat de output weer leeg is
    e.preventDefault();

    const begindatumInput = document.getElementById('begindatum').value;
    const einddatumInput = document.getElementById('einddatum').value;
    const feedbackButton = document.getElementById('feedback_button');

    fetch('/historie/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ begindatum: begindatumInput, einddatum: einddatumInput }),
    })
    .then(response => {
        if (response.status === 204) {
            errorFeedback(feedbackButton, 'Geen werkdagen gevonden in de gegeven periode');
            return;
        }
        return response.json().then(data => {
            if (!response.ok) {
                errorFeedback(feedbackButton, data.message || 'Er is een fout opgetreden bij het ophalen van de data');
            } else {
                verwerkData(data);
            }
        });
    })
    .catch((error) => {
        console.error('Error:', error);
        errorFeedback(feedbackButton, 'Er is een fout opgetreden bij het ophalen van de data');
    });
});

function clearFeedback(el) {
    let errorSpan = el.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('error')) {
        errorSpan.remove();
    }
}





function verwerkData(data) {
    const historyFromDbElement = document.getElementById("historie_from_db");
    historyFromDbElement.innerHTML = '';

    data.werkdagen.forEach(werkdag => {
        const date = new Date(werkdag.datum);
        const dagen = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
        const dagVanDeWeek = dagen[date.getDay()];
        const formattedDate = `${dagVanDeWeek} ${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;

        const dag = document.createElement('div');
        dag.setAttribute("id", 'dag-'+werkdag.idwerkdag)
        dag.className = 'datum';

        const title = document.createElement('h2');
        title.textContent = formattedDate;
        dag.appendChild(title);

        const dagDetails = `
            <p><strong>Basis werklocatie:</strong> ${werkdag.locatienaam}</p>
            <p><strong>Aantal beeldschermen:</strong> ${werkdag.aantalbeeldschermen}</p>
            <p><strong>Aantal blikjes drinken op HQ:</strong> ${werkdag.aantalblikjesdrinkenophq}</p>
            <p><strong>Aantal uren beeldscherm aan:</strong> ${werkdag.aantalurenbeeldschermanaan}</p>
            <p><strong>Aantal verzoeken aan ChatGPT:</strong> ${werkdag.aantalverzoekenaanchatgpt}</p>
            <p><strong>Ritten:</strong><ul id="ritten-${werkdag.idwerkdag}"></ul></p>
            <button id="verwijderen-btn-${werkdag.idwerkdag}" onclick="verwijderDag(${werkdag.idwerkdag})">Verwijderen</button>
            <a href="/editwerkdag/${werkdag.idwerkdag}"><button>Bewerk</button></a>
        `;
        dag.innerHTML += dagDetails;

        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'idwerkdag';
        hiddenInput.value = werkdag.idwerkdag;
        dag.appendChild(hiddenInput);

        historyFromDbElement.appendChild(dag);
    });

    data.ritten.forEach(rit => {
        const ritLi = document.createElement('li');
        ritLi.className = 'rit';
        ritLi.innerHTML = `<strong>van</strong> ${rit.vanadres} <strong>naar</strong> ${rit.naaradres} - <strong>${rit.aantalkilometers}</strong> km.`;
        
        const ul = document.getElementById(`ritten-${rit.werkdag_idwerkdag}`);
        if (ul) {
            ul.appendChild(ritLi);
        }
    });
}

function verwijderDag(idwerkdagParameter) {
    fetch('/werkdag/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({idwerkdag: idwerkdagParameter}),
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                errorFeedback(feedbackButton, data.message || 'Er is een fout opgetreden bij het ophalen van de data');
            } else {
                //Todo: set id of div with idwerkdag
                divToRemove = document.getElementById('dag-'+idwerkdagParameter);
                divToRemove.remove();
            }
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}