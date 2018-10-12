function makeId() {
    var length = 6;
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}

function getFromStorage(key) {
    var val = localStorage.getItem(key);
    return JSON.parse(val)
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}



function getCheckedRadioByName(name) {
    var elCheckedRadio
    var elRadios = document.getElementsByName(name);
    for (var i = 0; i < elRadios.length ; i++) {
        if (elRadios[i].checked) {
            elCheckedRadio =  elRadios[i]
            return elCheckedRadio;
        }
    }
    return -1;
}