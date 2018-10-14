'use strict;'


function clickHandler(ev, elCell) {

    if (!gIsGameOn) return;
    switch (ev.button) {
        case 2:
            // click 'right'
            flagCell(elCell)
            break;
        case 0:
            // click 'left'
            openCell(elCell)
            break;
    }
}


// rewrite a lot******************************************************
function flagCell(elCell) {
    var cell = getCellLocation(elCell)

    if (cell.open) return;

    if (cell.flag) {
        // cancel existing flag
        var elFlag = elCell.querySelector('.flag')
        elCell.removeChild(elFlag)
        gFlagCount++
        updateFlagsCountDisplay()
        // cancel correct existing flag
        if (isFlagCorrect(elCell)) {
            gCorrectFlagsCount++
        }
        return;
    }

    cell.flag = true;
    elCell.innerHTML += '<span class="flag">' + FLAG + '</span>'

    gFlagCount--
    updateFlagsCountDisplay()

    if (isFlagCorrect(elCell)) {
        gCorrectFlagsCount--
        console.log('correct flags count:', gCorrectFlagsCount)
    }
    if (isVictory()) {
        gameWon()
    }
}


function isFlagCorrect(elCell) {
    var cell = getCellLocation(elCell)
    if (cell.mine) return true;
    return false;
}


// rewrite alot ****************************
function openCell(elCell) {
    // get cell location to get his negs and call this func on them as well
    var cell = getCellLocation(elCell)
    console.log(cell)
    
    // don't open flagged cells or open cells
    if (cell.open) return;
    if (cell.flag) {
        
        $('.alert').html(`Don't click 🚩!`).slideToggle(300).delay(300).slideToggle(300)
        
        return;
    }
    // start time count
    // this global var gOpenCellsCount is not useful in other 
    // conditions because it gets too big somehow
    // but it's good for starting the timer
    gOpenCellsCount++
    startTimer()
    
    cell.open = true;
    // changing cell color 
    elCell.classList.remove('cell')
    elCell.classList.add('open-cell')

    // revealing mine/number
    elSpan = elCell.querySelector('span')
    if (elSpan) {
        elSpan.classList.remove('hidden')
    }

    // giving mines different style, and ending game
    if (cell.mine) {
        elCell.classList.remove('cell')
        elCell.classList.add('open-mine')
        gameOver()
    }

    if (elCell.innerText === EMPTY) {
        elCell.innerHTML = '<span class="open-empty">OPEN</span>'

        // loop on neighbours
        for (var i = cell.i - 1; i <= cell.i + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = cell.j - 1; j <= cell.j + 1; j++) {
                if (i === cell.i && j === cell.j) continue;
                if (j < 0 || j >= gBoard[i].length) continue;

                var elNegCell = document.querySelector(`.cell-${i}-${j}`);
                var elNegCellSpan = document.querySelector(`.cell-${i}-${j} span`);
                // call openCell on neg empty cells

                if (elNegCellSpan && isEmptyCell(elNegCellSpan) || isNumCell(elNegCellSpan)) {
                    openCell(elNegCell);
                }
            }
        }
    }
    if (isVictory()) {
        gameWon()
    }
}


function isEmptyCell(elCellSpan) {
    return elCellSpan.innerText === EMPTY;
}

function isNumCell(elCellSpan) {
    var str = '12345678'

    if (str.includes(parseInt(elCellSpan.innerText))) return true;

    return false;
}



function isVictory() {
    // count open cells
    var openCellsCount = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            if (!elCell.classList.contains('cell')) openCellsCount++
        }
    }

    if (openCellsCount === gNoMinesCellsCount &&
         gCorrectFlagsCount === 0 &&
         gFlagCount === 0) {
        return true;
    }
    return false;
}


function restart(status) {
    if (status === 'won') {
        $('.modal-won').fadeOut(500)
    }
    else {
        $('.modal-lost').fadeOut(500)
    }
    setTimeout(init, 500);
}


function gameWon() {
    gIsGameOn = false;
    clearInterval(gShowTime)

    // find cells with mine & flag, make sure mine won't appear
    var elTds = document.querySelectorAll('td')
    for (var i = 0; i < elTds.length; i++) {
        if (elTds[i].innerText.includes('💣' && '🚩')) {
            elTds[i].innerText = '🚩'
        }
        
    }

    // open all cells on board
    var elHiddens = document.querySelectorAll('.hidden')
    for (var i = 0; i < elHiddens.length; i++) {
        elHiddens[i].classList.remove('hidden')
    }

    var elCells = document.querySelectorAll('.cell')
    for (var i = 0; i < elCells.length; i++) {
        elCells[i].classList.remove('cell')
        elCells[i].classList.add('open-cell')

    }
    $('.modal-won').show()
}

function gameOver() {
    gIsGameOn = false;
    clearInterval(gShowTime);
    // find cells with mine & flag, make sure mine won't appear
    var elTds = document.querySelectorAll('td')
    for (var i = 0; i < elTds.length; i++) {
        if (elTds[i].innerText.includes('💣' && '🚩')) {
            elTds[i].innerText = '🚩'
        }
        
    }

    // reveal all hidden spans
    var elHiddens = document.querySelectorAll('.hidden')
    for (var i = 0; i < elHiddens.length; i++) {
        elHiddens[i].classList.remove('hidden')
    }
    
    // open all cells on board
    var elCells = document.querySelectorAll('.cell')
    for (var i = 0; i < elCells.length; i++) {
        elCells[i].classList.remove('cell')
        elCells[i].classList.add('open-cell')

    }
    $('.modal-lost').show()
}
