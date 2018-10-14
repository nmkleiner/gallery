

function formatNum(num) {
    var currency = (gCurrLang === 'en')? 'USD' : 'ILS';
    var exRate = 3.65;
    if (gCurrLang === 'he') num = Math.round(num*exRate*10)/10;
    return new Intl.NumberFormat(gCurrLang,{ style: 'currency', currency: currency }).format(num);
    // return new Intl.NumberFormat().format(num);
}

function formatDate(time) {

    options = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        hour12: true,
    };

    return new Intl.DateTimeFormat(gCurrLang,options).format(time);
}


function kmToMiles(km) {
    return km / 1.609;
}


var gTrans = {
    'add-btn': {
        en: 'add',
        he: 'הוספה'
    },
    'read-btn': {
        en: 'read',
        he: 'פתיחה',
    },
    'delete-btn': {
        en: 'delete',
        he: 'מחיקה'
    },
    'edit-btn': {
        en: 'edit',
        he: 'עריכה'
    },
    'update-btn': {
        en: 'update',
        he: 'עדכן'
    },
    'update-header': {
        en: 'Update book price',
        he: 'עדכן מחיר'
    },
    'add-header': {
        en: 'Add new book',
        he: 'הוסף ספר חדש'
    },
    actions: {
        en: 'Actions',
        he: 'פעולות'
    },
    id: {
        en: 'id',
        he: 'מק"ט'
    },
    name: {
        en: 'name',
        he: 'כותרת'
    },
    price: {
        en: 'price',
        he: 'מחיר'
    },
    Read: {
        en: 'Read',
        he: 'פתיחה'
    },
    'Edit Price': {
        en: 'Edit Price',
        he: 'ערוך מחיר'
    },
    Del: {
        en: 'Del',
        he: 'מחיקה'
    },
    Update: {
        en: '12 Rules For Life',
        he: '12 חוקים לחיים'
    },
    'new-price-placeholder': {
        en: 'new price $',
        he: 'מחיר חדש ב-$'
    },'book-name-placeholder': {
        en: 'book name',
        he: 'שם הספר'
    },'book-price-placeholder': {
        en: 'book price',
        he: 'מחיר הספר ב-$'
    },'': {
        en: '',
        he: ''
    },
    //,
    // 'add-todo-placeholder': {
    //     en: 'What needs to be done?',
    //     he: 'מה יש לעשות?'
    // }
}

var gCurrLang = 'en';

function doTrans() {
    var els = document.querySelectorAll('[data-trans]');

    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        var transKey = el.getAttribute('data-trans');
        
        var txt = getTrans(transKey);

        // Translating is actually complex and needs a library
        if (el.nodeName === 'INPUT') {
            el.setAttribute('placeholder', txt);
        } else {
            el.innerText = txt;
        }
    }
}


function getTrans(transKey) {
    var keyTrans = gTrans[transKey];
    if (!keyTrans) return 'UNKNOWN';

    var txt = keyTrans[gCurrLang];

    // If not found - use english
    if (!txt) txt = keyTrans['en'];

    return txt;
}


function setLang(lang) {
    gCurrLang = lang;
    if (gCurrLang === 'he') {
        document.body.classList.add('rtl')
    } else {
        document.body.classList.remove('rtl')
    }
    doTrans();
}


// function transRenderedText(txt,currLang) {
//     // var txt = 
// }


function doTransFor(selector) {
    var els = document.querySelectorAll('[data-trans]');

    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        var transKey = el.getAttribute('data-trans');
        
        var txt = getTrans(transKey);

        // Translating is actually complex and needs a library
        if (el.nodeName === 'INPUT') {
            el.setAttribute('placeholder', txt);
        } else {
            el.innerText = txt;
        }
    }
}