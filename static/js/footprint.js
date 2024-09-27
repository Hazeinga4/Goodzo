function errorFeedback(el, msg) {
    clearFeedback(el);
    let errorSpan = document.createElement('span');
    errorSpan.classList.add('error');
    errorSpan.textContent = msg;
    el.parentNode.insertBefore(errorSpan, el.nextSibling);
}

function clearFeedback(el) {
    let errorSpan = el.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('error')) {
        errorSpan.remove();
    }
}

var dateRange = []

document.getElementById('dashboard_btn').addEventListener('click', function (e) {
    e.preventDefault();

    const begindatumInput = document.getElementById('begindatum').value;
    const einddatumInput = document.getElementById('einddatum').value;
    const feedbackButton = document.getElementById('feedback_button');
    console.log(feedbackButton)

    dateRange = getDates(begindatumInput, einddatumInput);

    if (begindatumInput > einddatumInput) {
        errorFeedback(feedbackButton, 'De einddatum moet na de begindatum liggen');
        console.log('einddautm')
    } 
    else{
        fetch('/footprint/co2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ begindatum: begindatumInput, einddatum: einddatumInput }),
        })
        .then(response => {
            if (response.status === 204) {
                errorFeedback(feedbackButton, 'Geen uitstoot gevonden in de gegeven periode');
                return;
            }
            return response.json().then(data => {
                if (!response.ok) {
                    errorFeedback(feedbackButton, data.message || 'Er is een fout opgetreden bij het ophalen van de data');
                } else {
                    verwerkDashboard(data);
                }
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            errorFeedback(feedbackButton, 'Er is een fout opgetreden bij het ophalen van de data');
        });
    } 
});

function verwerkDashboard(data) {
    console.log(data);

    const dagen = data.uitstootperdag;

    const startDate = new Date(dagen[0].datum);
    const endDate = new Date(dagen[dagen.length - 1].datum);

    var x = dateRange;
    var yBeeldscherm = [];
    var yBlikjes = [];
    var yChatGPT = [];
    var yKilometers = [];
    var ySum = [];

    const dateMap = new Map();
    for (const dag of dagen) {
        dateMap.set(new Date(dag.datum).toDateString(), {
            beeldschermentotaal: dag.beeldschermentotaal,
            blikjes: dag.blikjes,
            chatgpt: dag.chatgpt,
            kilometers: dag.kilometers,
            sum: dag.sum
        });
    }

    for (const date of x) {
        const dateString = date.toDateString();
        if (dateMap.has(dateString)) {
            const dayData = dateMap.get(dateString);
            yBeeldscherm.push(dayData.beeldschermentotaal);
            yBlikjes.push(dayData.blikjes);
            yChatGPT.push(dayData.chatgpt);
            yKilometers.push(dayData.kilometers);
            ySum.push(dayData.sum)
        } else {
            yBeeldscherm.push(0);
            yBlikjes.push(0);
            yChatGPT.push(0);
            yKilometers.push(0);
            ySum.push(0);
        }
    }

    var traceBeeldscherm = {
        x: x,
        y: yBeeldscherm,
        type: 'scatter',
        mode: 'lines',
        name: 'Beeldschermen'
    };

    var traceBlikjes = {
        x: x,
        y: yBlikjes,
        type: 'scatter',
        mode: 'lines',
        name: 'Blikjes'
    };

    var traceChatGPT = {
        x: x,
        y: yChatGPT,
        type: 'scatter',
        mode: 'lines',
        name: 'ChatGPT'
    };

    var traceKilometers = {
        x: x,
        y: yKilometers,
        type: 'scatter',
        mode: 'lines',
        name: 'Kilometers'
    };

    var traceSum = {
        x: x,
        y: ySum,
        type: 'scatter',
        mode: 'lines',
        name: 'Totaal'
    }

    var plotData = [traceBeeldscherm, traceBlikjes, traceChatGPT, traceKilometers, traceSum];

    // Render the plot
    Plotly.newPlot('plot', plotData);
}

function getDates(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let dateArray = [];

    while (start <= end) {
        dateArray.push(new Date(start));
        
        start.setDate(start.getDate() + 1);
    }

    return dateArray;
}
