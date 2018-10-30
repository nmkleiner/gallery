'use strict;'

var gNum1
var gNum2
var gSum
var gDoubleCount


function selectSoldier(elSoldier, soldier) {
    // hide select for all soldiers
    hideSelectForAll()

    if (soldier.isLastInCell) {
        showSelect(elSoldier, soldier)
    }
}


function showSelect(elSoldier, soldier) {
    if (soldier.color === 'white') {
        elSoldier.style.borderColor = 'blue'
    }
    else {
        elSoldier.style.borderColor = 'yellow'
    }

}

function hideSelectForAll() {
    var elSoldiers = document.querySelectorAll('.soldier')
    for (var i = 0; i < elSoldiers.length; i++) {
        var elSol = elSoldiers[i]
        hideSelect(elSol)
    }
}

function hideSelect(elSoldier) {
    if (elSoldier.classList.contains('soldier-white')) {
        elSoldier.style.borderColor = 'black'
    }
    else {
        elSoldier.style.borderColor = 'white'
    }
}


// very weird bugs, tried many things but no solution
function calculatePossibleMoves() {
    var soldiers = getAllSoldiers()

    // remove irrelevant soldiers by color and cell location
    for (var i = 0; i < soldiers.length; i++) {
        var soldier = soldiers[i]
        if (soldier.color !== gCurrTurn || !soldier.isLastInCell) {
            soldiers.splice(i, 1)
            i--
        }
    }
    // console.log('soldiers before calc', soldiers)
    // calculate moves not double
    // if (!isDouble()) {
    //     debugger
    //     for (var i = 0; i < soldiers.length; i++) {
    //         var soldier = soldiers[i]
    //         if (gNum1) {
    //             soldier.possibleMoves[0] = soldier.cell + mult * gNum1
    //         } else {
    //             soldier.possibleMoves[0] = null
    //         }
    //         if (gNum2) {
    //             soldier.possibleMoves[1] = soldier.cell + mult * gNum2
    //         } else {
    //             soldier.possibleMoves[1] = null
    //         }
    //         if (gNum1 && gNum2) {
    //             soldier.possibleMoves[2] = soldier.cell + mult * gSum
    //         } else {
    //             soldier.possibleMoves[2] = null
    //         }
    //     }
    //     // calculate moves when double
    // } else {
    //     for (var i = 0; i < soldiers.length; i++) {
    //         for (var i = 0; i < 4; i++) {
    //             soldier.possibleMoves[i] = soldier.cell + mult * gNum1 * (i + 1)
    //         }

    //         switch (gDoubleCount) {
    //             case 3:
    //                 soldier.possibleMoves[3] = null
    //                 break;
    //             case 2:
    //                 soldier.possibleMoves[2] = soldier.possibleMoves[3] = null
    //                 break;
    //             case 1:
    //                 soldier.possibleMoves[1] = soldier.possibleMoves[2] = soldier.possibleMoves[3] = null
    //                 break;
    //         }
    //     }
    // }
    var possibleMoves = []
    var move1
    var move2
    var move3
    var move4
    var mult = (gCurrTurn === 'white') ? 1 : -1;

    if (!isDouble()) {
        for (var i = 0; i < soldiers.length; i++) {
            var cell = soldiers[i].cell;

            if (gNum1 === null) {
                move1 = null;
            } else {
                var move1 = cell + mult * gNum1
            }
            if (gNum2 === null) {
                move2 = null;
            } else {
                var move2 = cell + mult * gNum2
            }
            // don't change zero conditions here
            //  because (null <= 0 && null < 1) is always true
            if (isOutsideBoard(move1)) {
                move2 = move3 = null
            }

            else if (gSum === null || isOutsideBoard(move2)) {
                move3 = null;
            } else {
                var move3 = cell + mult * gSum
            }
            possibleMoves.push({ srcCell: cell, moves: [move1, move2, move3, move4] })
        }
    }


    // if double calc moves object based on src and cube number 1
    if (isDouble()) {
        for (var i = 0; i < soldiers.length; i++) {
            var cell = soldiers[i].cell; // same bs
            var moves = [];

            for (var j = 0; j < 4; j++) {
                moves[j] = cell + mult * (j + 1) * gNum1;
            }
            switch (gDoubleCount) {
                case 0:
                    moves[0] = moves[1] = moves[2] = moves[3] = null
                    break;

                case 1:
                    moves[1] = moves[2] = moves[3] = null
                    break;

                case 2:
                    moves[2] = moves[3] = null
                    break;

                case 3:
                    moves[3] = null
                    break;
            }
            possibleMoves.push({ srcCell: cell, moves: moves })
        }
    }
    console.log('possibleMoves',possibleMoves)
    for (var i = 0; i < soldiers.length; i++) {
        soldier = soldiers[i]
        for (var j = 0; j < possibleMoves.length; j++) {

            if (soldier.cell === possibleMoves[j].srcCell) soldier.possibleMoves = possibleMoves[j].moves
        }
        
    }
    
    console.log(soldiers)

    // first put null wherever needed, later disable sums and stuff like that
    var opponent = (gCurrTurn === 'white') ? 'black' : 'white'
    // debugger
    for (var i = 0; i < soldiers.length; i++) {
        var soldier = soldiers[i]
        if (!isDouble()) {

            // if move is inside board, check if opponent cell
            for (var j = 0; j < 3; j++) {
                var move = soldier.possibleMoves[j]
                console.log('soldier', soldier)
                if (move === null) continue;
                if (!isOutsideBoard(move)) {
                    if (gBoard[move][`${opponent}Count`] > 1) {
                        soldier.possibleMoves[j] = null;
                    }
                }
                else if (isOutsideBoard(move) && !canExit(gCurrTurn)) {
                    soldier.possibleMoves[j] = null;
                }
            }


            // if move1 or 2 is outside or on opponent cell then move3 is null
            if (isOutsideBoard(soldier.possibleMoves[0]) || soldier.possibleMoves[0] === null ||
                isOutsideBoard(soldier.possibleMoves[1]) || soldier.possibleMoves[1] === null) {
                soldier.possibleMoves[2] = null;
            }
        }
        // isDouble
        else {

            // if opponent cell or if outside when exit is not allowed
            for (var j = 0; j < 4; j++) {
                var move = soldier.possibleMoves[j]
                if (!isOutsideBoard(move)) {
                    if (gBoard[move][`${opponent}Count`] > 1) {
                        soldier.possibleMoves[j] = null;
                    }
                }

                else if (isOutsideBoard(move) && !canExit(gCurrTurn)) {
                    soldier.possibleMoves[j] = null;
                }
            }

            // if move1 or 2 or 3 is outside or on opponent cell then move4 is null
            // if a move is outside when exit is not allowed then it is null

            if (isOutsideBoard(soldier.possibleMoves[0]) || soldier.possibleMoves[0] === null) {
                soldier.possibleMoves[1] = soldier.possibleMoves[2] = soldier.possibleMoves[3] = null
            }
            else if (isOutsideBoard(soldier.possibleMoves[1]) || soldier.possibleMoves[1] === null) {
                soldier.possibleMoves[2] = soldier.possibleMoves[3] = null
            }
            else if (isOutsideBoard(soldier.possibleMoves[2]) || soldier.possibleMoves[2] === null) {
                soldier.possibleMoves[3] = null
            }
        }
    }
    console.log('soldiers at end of calc', soldiers)
}





function isOutsideBoard(move) {
    return move < 1 || move > 24
}


// never tested
function canExit(color) {
    var soldiersCount = 0
    if (color === 'white') {
        // 19 - 25
        for (var i = 19; i <= 25; i++) {
            var cell = gBoard[i]
            for (var j = 0; j < cell.soldiers.length; j++) {
                var soldier = cell.soldiers[j]
                if (soldier.color === 'white') soldiersCount++
            }
        }

    }
    else {
        // 0 - 6
        for (var i = 0; i <= 6; i++) {
            var cell = gBoard[i]
            for (var j = 0; j < cell.soldiers.length; j++) {
                var soldier = cell.soldiers[j]
                if (soldier.color === 'black') soldiersCount++
            }
        }
    }
    return soldiersCount === 15
}




function showPossibleMoves(soldier) {
    var moves = soldier.possibleMoves
    for (var i = 0; i < moves.length; i++) {
        var move = moves[i]
        // verifying good inputs
        if (move === null || move === undefined) continue;
        if (move > 25) move = 25
        if (move < 0) move = 0
        // get cell
        console.log('move',move)
        var elCell = document.querySelector(`.cell-${move} div:first-child`)
        // change color
        if (move === 25 || move === 0) {
            elCell.classList.add('green-bg')
        }
        else {
            elCell.classList.add('triangle-green')
        }
    }
}

function allowPossibleMoves(soldier) {
    var moves = soldier.possibleMoves
    for (var i = 0; i < moves.length; i++) {
        var move = moves[i]
        // verifying good inputs
        if (move === null || move === undefined) continue;
        if (move > 25) move = 25
        if (move < 0) move = 0
        // get cell
        var cell = gBoard[move]
        cell.isPossibleMove = true
    }
}


function hidePossibleMoves() {

    var elCells = document.querySelectorAll('.triangle div:first-child')
    for (var i = 0; i < elCells.length; i++) {
        var elCell = elCells[i]
        elCell.classList.remove('triangle-green')
    }

    var elOutsideCells = document.querySelectorAll('.outside div div:first-child');
    for (var i = 0; i < elOutsideCells.length; i++) {
        var elCell = elOutsideCells[i]
        elCell.classList.remove('green-bg')
    }
}

function cancelPossibleMoves() {
    for (var i = 0; i < gBoard.length; i++) {
        var cell = gBoard[i]
        cell.isPossibleMove = false
    }
}

function moveSoldierTo(cellNum) {
    var destCell = gBoard[cellNum]

    // delete soldier from source
    var srcCell = gBoard[gSelectedCellNum]
    srcCell.soldiers.splice(srcCell.length - 1, 1)


    // move soldier to cell
    gSelectedSoldier.cell = cellNum
    destCell.soldiers.push(gSelectedSoldier)
    var moves = gSelectedSoldier.possibleMoves
    console.log('moves', moves)
    // update gNums
    if (!isDouble()) {
        for (var i = 0; i < moves.length; i++) {
            var move = moves[i]
            console.log(move, cellNum)
            if (move === cellNum) {
                console.log('should null')
                switch (i) {
                    case 0:
                        gNum1 = gSum = null
                        break;
                    case 1:
                        gNum2 = gSum = null
                        break;
                    case 2:
                        gNum1 = gNum2 = gSum = null

                        break;
                }
            }
        }

    }
}



function endTurn() {

    document.querySelector('.throw-dice').disabled = 'false'
}


function createSelectedSoldier(soldier) {
    var newSoldier = {}
    newSoldier.color = soldier.color
    newSoldier.possibleMoves = soldier.possibleMoves
    newSoldier.isEaten = soldier.isEaten
    newSoldier.isOut = soldier.isOut
    newSoldier.id = soldier.id
    newSoldier.cell = soldier.cell
    newSoldier.isLastInCell = soldier.isLastInCell
    return newSoldier
}