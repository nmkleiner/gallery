'use strict;'

var gSelectedSoldier
var gSelectedCellNum
var gCurrTurn = 'black'
var gBoard
var gNextId
const cellsCount = 26
init()



function init() {
    gBoard = createBoard()
    gNextId = 0
    createSoldiers()
    renderSoldiers()
}


function createBoard() {
    var board = []
    var cell
    for (var i = 0; i < cellsCount; i++) {
        cell = {
            cellNum: i,
            soldiers: [],
            whiteCount: 0,
            blackCount: 0,
            isPossibleMove: false
        }
        board.push(cell)
    }
    return board
}

function createSoldiers() {
    
    for (var i = 0; i < 2; i++) {
        gBoard[1].soldiers.push(createSoldier('white'))
        gBoard[1].whiteCount++

        gBoard[24].soldiers.push(createSoldier('black'))
        gBoard[24].blackCount++
    }
    for (var i = 0; i < 5; i++) {
        gBoard[12].soldiers.push(createSoldier('white'))
        gBoard[12].whiteCount++

        gBoard[19].soldiers.push(createSoldier('white'))
        gBoard[19].whiteCount++

        gBoard[6].soldiers.push(createSoldier('black'))
        gBoard[6].blackCount++

        gBoard[13].soldiers.push(createSoldier('black'))
        gBoard[13].blackCount++
        
    }
    for (var i = 0; i < 3; i++) {
        gBoard[17].soldiers.push(createSoldier('white'))
        gBoard[17].whiteCount++

        gBoard[8].soldiers.push(createSoldier('black'))
        gBoard[8].blackCount++
    }    
}

function createSoldier(color) {
    var soldier = {
        color: color,
        possibleMoves: [],
        isEaten: false,
        isOut: false,
        id: getId(),
        cell: 0,
        isLastInCell: false
    }

    return soldier;
}

function cleanBoard() {
    $('.soldier').remove()
}

function renderSoldiers() {
    for (var i = 0; i < gBoard.length; i++) {
        var cell = gBoard[i];
        for (var j = 0; j < cell.soldiers.length; j++) {
            // update soldier object
            var soldier = cell.soldiers[j]
            soldier.cell = i;
            if (j === cell.soldiers.length -1) {
                soldier.isLastInCell = true;
            } else {
                soldier.isLastInCell = false;
                soldier.possibleMoves = []
            }

            // render soldier
            var elCell = document.querySelector(`.cell-${i}`)
            var strHtml = `<div class="soldier soldier-${soldier.color}" onclick="onSoldierClick(event,this,${soldier.id})"></div>`
            elCell.innerHTML += strHtml        
        }
    }
}

function onSoldierClick(ev,elSoldier,soldierId) {
    ev.stopPropagation()
    var soldier = getSoldierById(soldierId)
    // if it's not clicked soldier's turn, do nothing
    if (soldier.color !== gCurrTurn) {
        return
    }

    // model
    
    gSelectedSoldier = createSelectedSoldier(soldier)
    gSelectedCellNum = soldier.cell

    // rendering
    selectSoldier(elSoldier, soldier)
    hidePossibleMoves()
    cancelPossibleMoves()

    showPossibleMoves(soldier)
    allowPossibleMoves(soldier)
}


function onCellClick(elCell, cellNum) {
    var destCell = gBoard[cellNum]
    if (!destCell.isPossibleMove) {
        return
    }
    moveSoldierTo(cellNum)
    hideSelectForAll()
    hidePossibleMoves()
    cancelPossibleMoves()
    cleanBoard()
    renderSoldiers()
    calculatePossibleMoves()
}

function onThrowDice(elBtn) {
    elBtn.disabled = 'true'
    throwDice()
    calculatePossibleMoves()
}