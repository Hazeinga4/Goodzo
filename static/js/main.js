function errorFeedback(el, msg) {
    clearFeedback(el);
    let errorSpan = document.createElement('span');
    errorSpan.classList.add('error');
    errorSpan.textContent = msg;
    el.parentNode.insertBefore(errorSpan, el.nextSibling);
}