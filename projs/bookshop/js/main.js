'use strict';

var gBooks

function init() {
    gBooks = createBooks()
    doTrans()
    renderBooks(gBooks)
}


function onDelete(bookId) {
    deleteBook(bookId)
    renderBooks(gBooks)
}


function onRead(bookId) {
    readBook(bookId)
}

function readAndAddNewBook() {
    openSideModal('.modal-new')
    var $btn = $('.btn-update-book')
    $btn.click(function () {
        createNewBook()})
}

function onUpdate(bookId) {
    // debugger
    openSideModal('.modal-update')

    var $btn = $('.btn-update-book')
    // used closure for bookId
    $btn.click(function () {
        updateBook(bookId)})
    //updateBook also renders and closes Modal 
}

function onHeaderUpdate() {
    
    var elRadio = getCheckedRadioByName('choose-book')
    if (elRadio === -1) return;
    var bookId = getRadioDataValue(elRadio)

    onUpdate(bookId)
}
function onHeaderDelete() {
    
    var elRadio = getCheckedRadioByName('choose-book')
    if (elRadio === -1) return;
    var bookId = getRadioDataValue(elRadio)

    onDelete(bookId)
}
function onHeaderRead() {
    
    var elRadio = getCheckedRadioByName('choose-book')
    if (elRadio === -1) return;
    var bookId = getRadioDataValue(elRadio)

    onRead(bookId)
}

function onPlus(bookId) {
    bookRate(bookId,1)
}

function onMinus(bookId) {
    bookRate(bookId,-1)
}

function onClose() {
    closeModal()
}

function onSetLang(lang) {
    setLang(lang);
    renderBooks(gBooks);
}


