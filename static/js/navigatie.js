const navBar = document.getElementById("navigatie")
const baseUrl = window.location.origin

navBar.addEventListener("click", navigate)

function navigate(e) {
    if (!e.target.classList.contains("nav-item")) {
        
        return
    }
    const target = e.target.value                   // Maak een constante voor wat er achter de "/" moet komen op basis van de waarde van het geklikte element
    e.preventDefault()                              // Voorkomt standaardgedrag bij buttons en a-elementen
    window.location.href = baseUrl + "/" + target   // Navigeer
}
