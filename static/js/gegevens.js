// Deze functie verbergt de tussenvoegsel-regel wanneer deze leeg is
document.addEventListener("DOMContentLoaded", function() {
    const tussenvoegselInfo = document.getElementById("tussenvoegsel");
    const plaatsInfo = document.getElementById("plaats");
    const adresInfo = document.getElementById("adres");
    
    verbergParentElementWanneerNone(tussenvoegselInfo)
    voegTekstOnbekendToeWanneerLeeg(plaatsInfo)
    voegTekstOnbekendToeWanneerLeeg(adresInfo)
});

function verbergParentElementWanneerNone(element) {
    if (element.textContent === "None") {
        element.parentElement.style.display = 'none';
    }
    
}

function voegTekstOnbekendToeWanneerLeeg(el) {
    if (el.textContent.trim() === "") {
        el.textContent = 'Onbekend'
    }
}