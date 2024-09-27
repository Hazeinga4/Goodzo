const welkomstKnoppen = document.getElementById('welkomstknoppen')
welkomstKnoppen.addEventListener('click', navigateKnoppen)

function navigateKnoppen(e) {
    if (e.target.classList.contains('welkomstknoppen')) {
        return
    }

    let idParts
    if (e.target.classList.contains('welkomstknop')) {
        idParts = e.target.id.split('_')
    } else if (
        e.target.classList.contains('welkomstknop_icon') ||
        e.target.classList.contains('welkomstknop_label')
    ) {
        idParts = e.target.parentElement.id.split('_')
    } else {
        return
    }
    const target = idParts[1]
    window.location.href = baseUrl + '/' + target
}
