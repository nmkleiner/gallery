'use strict'

function createBooks() {
    var books = [
        createBook('12 Rules For Life', '14.99', 'img/12rules.jpg'),
        createBook('The Great Gatsby', '12.99', 'img/gatsby.jpg'),
        createBook('The Catcher In The Rye', '4.99', 'img/catcher.jpg'),
        createBook('12 Rules For Life', '14.99', 'img/12rules.jpg'),
        createBook('The Great Gatsby', '12.99', 'img/gatsby.jpg'),
        createBook('The Catcher In The Rye', '4.99', 'img/catcher.jpg'),
        createBook('12 Rules For Life', '14.99', 'img/12rules.jpg'),
        createBook('The Great Gatsby', '12.99', 'img/gatsby.jpg'),
        createBook('The Catcher In The Rye', '4.99', 'img/catcher.jpg'),
        createBook('12 Rules For Life', '14.99', 'img/12rules.jpg'),
        createBook('The Great Gatsby', '12.99', 'img/gatsby.jpg'),
        createBook('The Catcher In The Rye', '4.99', 'img/catcher.jpg'),
        createBook('12 Rules For Life', '14.99', 'img/12rules.jpg'),
        createBook('The Great Gatsby', '12.99', 'img/gatsby.jpg'),
        createBook('The Catcher In The Rye', '4.99', 'img/catcher.jpg'),
        createBook('The Four Agreements', '9.99', 'img/fouragreements.jpg')
    ]
    return books;
}

function createBook(name, price, imgUrl) {
    var book = {
        name: name,
        price: price,
        imgURL: imgUrl,
        id: makeId(),
        rate: 0
    }
    return book;
}
// create and render table
function renderBooks(books) {
    var strHtml = `<div class="row"><table class="mx-auto col-xs-12 col-sm-12 col-md-8 table table-striped"><thead class="thead-dark"><th>id</th><th>book name</th>
                    <th>price</th><th colspan="3">actions</th></thead><tbody>`

    books.forEach(function (book) {
        strHtml += `<tr>    
                        <td>${book.id}</td>
                        <td>${book.name}</td>
                        <td>$${book.price}</td>
                        <td><button class="btn btn-sm btn-info" onclick="onRead('${book.id}')"><i class="fa fa-info-circle"></i> Read</button></td>
                        <td><button class="btn btn-sm btn-warning" onclick="onUpdate('${book.id}')"><i class="fa"></i> update</button></td>
                        <td><button class="btn btn-sm btn-danger" onclick="onDelete('${book.id}')"><i class="fa fa-trash"></i> Delete</button></td>
                        
                        </tr>`
    })
    strHtml += `</tbody></table></div>`

    var $container = $('.container')
    $container.html(strHtml)
}

function deleteBook(bookId) {
    var bookIdx = gBooks.findIndex(function (book) {
        return book.id === bookId
    })
    gBooks.splice(bookIdx, 1)
}


function readBook(bookId) {
    var book = gBooks.find(function (book) {
        return book.id === bookId
    })

    // close  modal if open
    var $modal = $('.book-details')
    if ($modal.css('display') !== 'none') {
        $modal.fadeToggle(300)
        return
    }
    // open modal and create fresh image text & buttons
    $modal.fadeToggle(300)
    $modal.find('h2').html(`${book.name}`)
    $modal.find('p').html(`$${book.price}`)
    $modal.find('.img-container').html(`<img class="img-responsive img-thumbnail" src="${book.imgURL}">`)
    $modal.find('.row').html(`<div class=" btn black-square col-xs-1" onclick="onMinus('${book.id}')">-</div>
    <div class="white-rect col-xs-2 rate">${book.rate}</div>
    <div class="btn black-square col-xs-1" onclick="onPlus('${book.id}')">+</div>`)
}

// called from update btn that is created when side-modal is opened
function updateBook(bookId) {
    var newPrice = $('.update-price').val()
    // close modal if price input is empty
    if (newPrice === '') {
        closeSideModal('.modal-update')
        return
    }
    // update price in gBooks
    var bookIdx = gBooks.findIndex(function (book) {
        return book.id === bookId
    })
    gBooks[bookIdx].price = newPrice
    
    renderBooks(gBooks)
    closeSideModal('.modal-update')
}

function createNewBook() {
    var bookName = $('.new-name').val()
    var bookPrice = $('.new-price').val()
    // close modal if inputs empty
    if (bookName === '' || bookPrice === '') {
        closeSideModal('.modal-new')
        return
    }

    $('.new-name').val('')
    $('.new-price').val('')

    var newBook = createBook(bookName, bookPrice)
    gBooks.push(newBook)
    renderBooks(gBooks)
    closeSideModal('.modal-new')
}

function bookRate(bookId, num) {
    var bookIdx = gBooks.findIndex(function (book) {
        return book.id === bookId
    })
    if (gBooks[bookIdx].rate + num > 10 || gBooks[bookIdx].rate + num < 0) {
        return
    }
    gBooks[bookIdx].rate += num
    $rate = $('.book-details .rate')
    $rate.html(`${gBooks[bookIdx].rate}`)
}

function closeModal() {
    var $modal = $('.book-details')
    $modal.fadeToggle(300)
}

function openSideModal(selector) {
    $(`${selector}`).slideToggle(300)
    var btnHtml = `<button class="btn btn-sm btn-warning btn-update-book">Update!</button>`
    $(`${selector}`).find('.btn-container').html(btnHtml)
}

function closeSideModal(selector) {
    $(`${selector}`).slideToggle(300)
}
    