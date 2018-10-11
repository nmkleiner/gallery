'use strict';

var gBooks

function init() {
    gBooks = createBooks()
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

function onPlus(bookId) {
    bookRate(bookId,1)
}

function onMinus(bookId) {
    bookRate(bookId,-1)
}

function onClose() {
    closeModal()
}