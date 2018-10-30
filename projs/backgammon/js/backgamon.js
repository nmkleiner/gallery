
// לבדוק האם כל המשתנים הגלובליים באמת נחוצים
// לסדר פונקציות בסדר הגיוני

//definitions of variables: soldiers, column,row&color of soldier being dragged
// array of new game, array of all get elements
var gCurrTriangle;
var gCurrTurn;
var elCurrTurn;
//cube numbers
var gNum1;
var gNum2;
var gSum;
var gIsDouble;
var gDoubleCount;
var gTriangles;
var gBoard;
var gPossibleMoves;
var cubesSound;
var beepSound;

var WHITE = "◯"




function init() {
    cubesSound = new Audio('sound/cubes.mp3');
    beepSound = new Audio('sound/beep.mp3');
    gBoard = []
    gTriangles = $('.triangle');
    gDoubleCount = 0
    
    var elCurrTurnChild = document.querySelector('.curr-turn div')
    gCurrTurn = (Math.random() > 0.5) ? 'white' : 'black'
    elCurrTurnChild.innerHTML = `<div class="soldier-const ${gCurrTurn} inline"></div>`;
    createBoard()
    renderBoard()
}


function createBoard() {
    for (var i = 0; i < 28; i++) {
        gBoard.push([])
    }

    // create white soldiers objects
    var whites = []
    for (var i = 0; i < 2; i++) {
        whites.push({ color: 'white', triangle: 1 })
    }
    for (var i = 0; i < 5; i++) {
        whites.push({ color: 'white', triangle: 12 })
    }
    for (var i = 0; i < 3; i++) {
        whites.push({ color: 'white', triangle: 17 })
    }
    for (var i = 0; i < 5; i++) {
        whites.push({ color: 'white', triangle: 19 })
    }

    // create black soldiers objects
    var blacks = []
    for (var i = 0; i < 2; i++) {
        blacks.push({ color: 'black', triangle: 24 })
    }
    for (var i = 0; i < 5; i++) {
        blacks.push({ color: 'black', triangle: 13 })
    }
    for (var i = 0; i < 3; i++) {
        blacks.push({ color: 'black', triangle: 8 })
    }
    for (var i = 0; i < 5; i++) {
        blacks.push({ color: 'black', triangle: 6 })
    }

    // create eaten black soldiers
    // blacks.push({ color: 'black', column: "middle", triangle: 27 })
    // blacks.push({ color: 'black', column: "middle", triangle: 27 })

    // push soldiers to gBoard
    for (var i = 0; i < whites.length; i++) {
        gBoard[whites[i].triangle].push(whites[i])
        gBoard[blacks[i].triangle].push(blacks[i])
    }

    var soldier
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            soldier = gBoard[i][j]
            soldier.column = calcColumn(gBoard[i][j])
        }
    }
}



function renderBoard() {
    var strHTML
    for (var i = 0; i <= 27; i++) {//i started from 0, changed to 1 without checking
        for (var j = 0; j < gBoard[i].length; j++) {
            var topOrBot
            if (i >= 0 && i <= 12 || i === 26) {
                topOrBot = 'top-row';
            } else {
                topOrBot = 'bot-row';
            }
            // init standard div string
            strHTML = `<div class="soldier ${gBoard[i][j].color} column-${gBoard[i][j].column} 
            ${topOrBot}-${j + 1}" col="${i}" triangle="${gBoard[i][j].triangle}"></div>`;

            gBoard[i][j].draggable = false;

            // can exit
            if (isExitAllowed(gCurrTurn) && (i !== 0 && i !== 25) && (j === gBoard[i].length - 1) &&
             (gCurrTurn === `${gBoard[i][j].color}`)) {

                strHTML = `<div class="soldier ${gBoard[i][j].color} column-${gBoard[i][j].column} ${topOrBot}-${j + 1}" 
                col="${i}" triangle="${gBoard[i][j].triangle}" draggable="true" ondragstart="drag(event)" 
                ondragend="cancelAllowDrop()" ondblclick="prepareToExitBoard(this)"></div>`;

                gBoard[i][j].draggable = true;
            }

            // can move
            else if ((i !== 0 && i !== 25) && (j === gBoard[i].length - 1) && (gCurrTurn === `${gBoard[i][j].color}`)) {

                strHTML = `<div class="soldier ${gBoard[i][j].color} column-${gBoard[i][j].column} ${topOrBot}-${j + 1}" 
                col="${i}" triangle="${gBoard[i][j].triangle}" draggable="true" ondragstart="drag(event)" 
                ondragend="cancelAllowDrop()" onmouseover="hover(event)" onmouseout="changeAllToOriginal()"></div>`;

                gBoard[i][j].draggable = true;
            }


            // exit board
            else if (i === 0) {
                strHTML = `<div class="soldier ${gBoard[i][j].color} column-${gBoard[i][j].column} top-exit-row-${j + 1}" 
                col="${i}" triangle="${gBoard[i][j].triangle}"></div>`;
            }

            else if (i === 25) {
                strHTML = `<div class="soldier ${gBoard[i][j].color} column-${gBoard[i][j].column} bot-exit-row-${j + 1}" 
                col="${i}" triangle="${gBoard[i][j].triangle}"></div>`;
            }

            $('#board').append(strHTML);
        }
    }
}

//called from specific triangle element on dragover to allow drop of dragged soldier
function allowDrop(ev) {
    ev.preventDefault();
}

function hover(ev) {
    soldier = ev.path[0]
    gCurrTriangle = parseInt(soldier.getAttribute('triangle'));
    var possibleMovesObject = getObjBySrc(gPossibleMoves, gCurrTriangle)
    if (gCurrTurn === 'white') {

        if (possibleMovesObject.moves[0] !== null) {
            changeToGreen(possibleMovesObject.moves[0])
        }
        if (possibleMovesObject.moves[1] !== null) {
            changeToGreen(possibleMovesObject.moves[1])
        }
        if (possibleMovesObject.moves[2] !== null) {
            changeToGreen(possibleMovesObject.moves[2])
        }
        if (gIsDouble) {
            if (possibleMovesObject.moves[3] !== null) {
                changeToGreen(possibleMovesObject.moves[3])
            }
        }
    }

    if (gCurrTurn === 'black') {
        if (possibleMovesObject.moves[0] !== null) {
            changeToGreen(possibleMovesObject.moves[0])
        }
        if (possibleMovesObject.moves[1] !== null) {
            changeToGreen(possibleMovesObject.moves[1])
        }
        if (possibleMovesObject.moves[2] !== null) {
            changeToGreen(possibleMovesObject.moves[2])
        }
        if (gIsDouble) {
            if (possibleMovesObject.moves[3] !== null) {
                changeToGreen(possibleMovesObject.moves[3])
            }
        }
    }
}




// defines what happens when a soldier is dragged
// gets the location & color of dragged soldier, sets which triangles will allow drop and changes them to green
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);

    soldier = ev.path[0]
    gCurrTriangle = parseInt(soldier.getAttribute('triangle'));
    var possibleMovesObject = getObjBySrc(gPossibleMoves, gCurrTriangle)

    if (gCurrTurn === 'white') {
        // for move1
        if (possibleMovesObject.moves[0] !== null) {
            changeToGreen(possibleMovesObject.moves[0])
            //allowing drop on exit board
            if (isExitAllowed(gCurrTurn) && possibleMovesObject.moves[0] > 24) {
                $('.hidden-bot')[0].setAttribute("ondragover", "allowDrop(event)");
                $('.hidden-bot')[0].setAttribute("ondrop", "drop(event)");
            }
            //allowing drop on bottom row
            else if (possibleMovesObject.moves[0] > 12) {
                gTriangles[36 - possibleMovesObject.moves[0]].setAttribute("ondragover", "allowDrop(event)");
                gTriangles[36 - possibleMovesObject.moves[0]].setAttribute("ondrop", "drop(event)");
            }
            //allowing drop on top row
            else if (possibleMovesObject.moves[0] < 25) {
                gTriangles[possibleMovesObject.moves[0] - 1].setAttribute("ondragover", "allowDrop(event)");
                gTriangles[possibleMovesObject.moves[0] - 1].setAttribute("ondrop", "drop(event)");
            }
        }
        if (possibleMovesObject.moves[1] !== null) {
            changeToGreen(possibleMovesObject.moves[1])
            if (isExitAllowed(gCurrTurn) && possibleMovesObject.moves[1] > 24) {
                $('.hidden-bot')[0].setAttribute("ondragover", "allowDrop(event)");
                $('.hidden-bot')[0].setAttribute("ondrop", "drop(event)");
            }
            else if (possibleMovesObject.moves[1] > 12) {
                gTriangles[36 - possibleMovesObject.moves[1]].setAttribute("ondragover", "allowDrop(event)");
                gTriangles[36 - possibleMovesObject.moves[1]].setAttribute("ondrop", "drop(event)");
            } else if (possibleMovesObject.moves[0] < 25) {
                gTriangles[possibleMovesObject.moves[1] - 1].setAttribute("ondragover", "allowDrop(event)");
                gTriangles[possibleMovesObject.moves[1] - 1].setAttribute("ondrop", "drop(event)");
            }
        }
        if (possibleMovesObject.moves[2] !== null) {
            changeToGreen(possibleMovesObject.moves[2])
            if (isExitAllowed(gCurrTurn) && possibleMovesObject.moves[2] > 24) {
                $('.hidden-bot')[0].setAttribute("ondragover", "allowDrop(event)");
                $('.hidden-bot')[0].setAttribute("ondrop", "drop(event)");
            }
            else if (possibleMovesObject.moves[2] > 12) {
                gTriangles[36 - possibleMovesObject.moves[2]].setAttribute("ondragover", "allowDrop(event)");
                gTriangles[36 - possibleMovesObject.moves[2]].setAttribute("ondrop", "drop(event)");
            }
            else if (possibleMovesObject.moves[2] < 25) {
                gTriangles[possibleMovesObject.moves[2] - 1].setAttribute("ondragover", "allowDrop(event)");
                gTriangles[possibleMovesObject.moves[2] - 1].setAttribute("ondrop", "drop(event)");
            }
        }
        if (gIsDouble) {
            if (possibleMovesObject.moves[3] !== null) {
                changeToGreen(possibleMovesObject.moves[3])
                if (isExitAllowed(gCurrTurn) && possibleMovesObject.moves[3] > 24) {
                    $('.hidden-bot')[0].setAttribute("ondragover", "allowDrop(event)");
                    $('.hidden-bot')[0].setAttribute("ondrop", "drop(event)");
                }
                else if (possibleMovesObject.moves[3] > 12) {
                    gTriangles[36 - possibleMovesObject.moves[3]].setAttribute("ondragover", "allowDrop(event)");
                    gTriangles[36 - possibleMovesObject.moves[3]].setAttribute("ondrop", "drop(event)");
                }
                else if (possibleMovesObject.moves[3] < 25) {
                    gTriangles[possibleMovesObject.moves[3] - 1].setAttribute("ondragover", "allowDrop(event)");
                    gTriangles[possibleMovesObject.moves[3] - 1].setAttribute("ondrop", "drop(event)");
                }
            }
        }
    }

    if (gCurrTurn === 'black') {
        if (possibleMovesObject.moves[0] !== null) {
            changeToGreen(possibleMovesObject.moves[0])
            if (possibleMovesObject.moves[0] > 12) {
                gTriangles[36 - possibleMovesObject.moves[0]].setAttribute("ondragover", "allowDrop(event)");
                gTriangles[36 - possibleMovesObject.moves[0]].setAttribute("ondrop", "drop(event)");
            } else if (isExitAllowed(gCurrTurn) && possibleMovesObject.moves[0] < 1) {
                $('.hidden-top')[0].setAttribute("ondragover", "allowDrop(event)");
                $('.hidden-top')[0].setAttribute("ondrop", "drop(event)");
            } else if (possibleMovesObject.moves[0] > 0) {
                gTriangles[possibleMovesObject.moves[0] - 1].setAttribute("ondragover", "allowDrop(event)");
                gTriangles[possibleMovesObject.moves[0] - 1].setAttribute("ondrop", "drop(event)");
            }
        }
        if (possibleMovesObject.moves[1] !== null) {
            changeToGreen(possibleMovesObject.moves[1])
            if (possibleMovesObject.moves[1] > 12) {
                gTriangles[36 - possibleMovesObject.moves[1]].setAttribute("ondragover", "allowDrop(event)");
                gTriangles[36 - possibleMovesObject.moves[1]].setAttribute("ondrop", "drop(event)");
            } else if (isExitAllowed(gCurrTurn) && possibleMovesObject.moves[1] < 1) {
                $('.hidden-top')[0].setAttribute("ondragover", "allowDrop(event)");
                $('.hidden-top')[0].setAttribute("ondrop", "drop(event)");
            } else if (possibleMovesObject.moves[1] > 0) {
                gTriangles[possibleMovesObject.moves[1] - 1].setAttribute("ondragover", "allowDrop(event)");
                gTriangles[possibleMovesObject.moves[1] - 1].setAttribute("ondrop", "drop(event)");
            }
        }
        if (possibleMovesObject.moves[2] !== null) {
            changeToGreen(possibleMovesObject.moves[2])
            if (possibleMovesObject.moves[2] > 12) {
                gTriangles[36 - possibleMovesObject.moves[2]].setAttribute("ondragover", "allowDrop(event)");
                gTriangles[36 - possibleMovesObject.moves[2]].setAttribute("ondrop", "drop(event)");
            } else if (isExitAllowed(gCurrTurn) && possibleMovesObject.moves[2] < 1) {
                $('.hidden-top')[0].setAttribute("ondragover", "allowDrop(event)");
                $('.hidden-top')[0].setAttribute("ondrop", "drop(event)");
            } else if (possibleMovesObject.moves[2] > 0) {
                gTriangles[possibleMovesObject.moves[2] - 1].setAttribute("ondragover", "allowDrop(event)");
                gTriangles[possibleMovesObject.moves[2] - 1].setAttribute("ondrop", "drop(event)");
            }
        }
        if (gIsDouble) {
            if (possibleMovesObject.moves[3] !== null) {
                changeToGreen(possibleMovesObject.moves[3])
                if (possibleMovesObject.moves[3] > 12) {
                    gTriangles[36 - possibleMovesObject.moves[3]].setAttribute("ondragover", "allowDrop(event)");
                    gTriangles[36 - possibleMovesObject.moves[3]].setAttribute("ondrop", "drop(event)");
                } else if (isExitAllowed(gCurrTurn) && possibleMovesObject.moves[3] < 1) {
                    $('.hidden-top')[0].setAttribute("ondragover", "allowDrop(event)");
                    $('.hidden-top')[0].setAttribute("ondrop", "drop(event)");
                } else if (possibleMovesObject.moves[3] > 0) {
                    gTriangles[possibleMovesObject.moves[3] - 1].setAttribute("ondragover", "allowDrop(event)");
                    gTriangles[possibleMovesObject.moves[3] - 1].setAttribute("ondrop", "drop(event)");
                }
            }
        }
    }
}



function calcPossibleMoves() {
    // first check if eaten, if so call calcPossibleMovesEaten and skip the rest
    if (gCurrTurn === 'white') {
        if (gBoard[26].length !== 0) {
            return calcPossibleMovesEaten();
        }
        var mult = 1
    }
    else {
        if (gBoard[27].length !== 0) {
            return calcPossibleMovesEaten();
        }
        var mult = -1
    }

    var possibleMoves = []
    var draggableSoldiersObjects = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].draggable === true) draggableSoldiersObjects.push(gBoard[i][j])
        }
    }
    var move1
    var move2
    var move3
    var move4
    if (!gIsDouble) {
        for (var i = 0; i < draggableSoldiersObjects.length; i++) {
            var triangle = draggableSoldiersObjects[i].triangle;

            if (gNum1 === null) {
                move1 = null;
            } else {
                var move1 = triangle + mult * gNum1
            }
            if (gNum2 === null) {
                move2 = null;
            } else {
                var move2 = triangle + mult * gNum2
            }
            // don't change zero conditions here
            //  because (null <= 0 && null < 1) is always true
            if (move1 > 24 || move1 < 0 || move1 === 0) {
                move2 = move3 = null
            }

            else if (gSum === null || move2 > 24 || move2 < 1) {
                move3 = null;
            } else {
                var move3 = triangle + mult * gSum
            }
            possibleMoves.push({ src: triangle, moves: [move1, move2, move3, move4] })
        }
    }
    // if double calc moves object based on src and cube number 1
    if (gIsDouble) {
        for (var i = 0; i < draggableSoldiersObjects.length; i++) {
            var triangle = draggableSoldiersObjects[i].triangle; // same bs
            var moves = [];

            for (var j = 0; j < 4; j++) {
                moves[j] = triangle + mult * (j + 1) * gNum1;
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
            possibleMoves.push({ src: triangle, moves: moves })
        }
    }

    // get locations of triangles that are opponent "houses", so they are illegal to drop on 
    var oppdot1ntSoldiers = getOppdot1ntSoldiersLocations()
    //  remove from possiblemoves, all triangles that have oppdot1nt "house"
    //  and remove all moves that are outside of board when isExitAllowed() is false
    var len = possibleMoves.length;
    // debugger;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < oppdot1ntSoldiers.length; j++) {
            // define moves to make statements more readable
            move1 = possibleMoves[i].moves[0];
            move2 = possibleMoves[i].moves[1];
            move3 = possibleMoves[i].moves[2];
            move4 = possibleMoves[i].moves[3];
            if (move1 === move2 && move2 === move3 && move3 === move4 && move1 === null) continue;
            // if move1 is where oppdot1nt soldiers or if move1 is outside board and exit is not allowed, make it null
            if (move1 === oppdot1ntSoldiers[j] || ((move1 > 24 || move1 < 1) && (!isExitAllowed(gCurrTurn)))) {
                move1 = null;
                // if move1 is null and it's a double all moves are null
                if (gIsDouble) {
                    move2 = move3 = move4 = null;
                }
            }
            // same as move1
            if (move2 === oppdot1ntSoldiers[j] || ((move2 > 24 || move2 < 1) && (!isExitAllowed(gCurrTurn)))) {
                move2 = null;
                // if move2 is null and it's double move3 and move4 are null
                if (gIsDouble) {
                    move3 = move4 = null;
                }
            }
            // if move3 is on oppdot1nt soldiers or if outside board when not allowed or if move1 and move2 are null
            // move3 is null
            if ((move3 === oppdot1ntSoldiers[j]) || ((move3 > 24 || move3 < 1) && (!isExitAllowed(gCurrTurn)))
                || (move1 === null && move2 === null)) {
                move3 = null;
                if (gIsDouble) {
                    move4 = null;
                }
            }
            if (gIsDouble && move4 === oppdot1ntSoldiers[j] || ((move4 > 24 || move4 < 1) && (!isExitAllowed(gCurrTurn)))) {
                move4 = null;
            }
            // bring new moves values back to gPossibleMoves
            possibleMoves[i].moves[0] = move1;
            possibleMoves[i].moves[1] = move2;
            possibleMoves[i].moves[2] = move3;
            possibleMoves[i].moves[3] = move4;
        }
    }
    return possibleMoves
}

function calcPossibleMovesEaten() {
    var elCurrTurnSoldiers = $(`.${gCurrTurn}`)
    for (var i = 0; i < elCurrTurnSoldiers.length; i++) {
        if (elCurrTurnSoldiers[i].classList[2] !== 'column-middle') {
            elCurrTurnSoldiers[i].setAttribute('draggable', 'null');
            elCurrTurnSoldiers[i].setAttribute('onmouseover', 'null');
        }
    }
    var move1
    var move2
    var move3
    var move4
    var possibleMoves = [];

    if (gCurrTurn === 'white') {
        var mult = 1;
        var triangle = 0;

    } else {
        var mult = -1;
        var triangle = 25;
    }

    if (!gIsDouble) {

        if (gNum1 === null) {
            move1 = null;

        } else {
            var move1 = triangle + mult * gNum1
        }

        if (gNum2 === null) {
            move2 = null;

        } else {
            var move2 = triangle + mult * gNum2
        }

        if (gSum !== null) {
            var move3 = triangle + mult * gSum
        }
        possibleMoves.push({ src: triangle, moves: [move1, move2, move3, move4] })
    }


    // if double calc moves object based on src and cube number 1
    if (gIsDouble) {
        var moves = []
        for (var j = 0; j < 4; j++) {
            moves[j] = triangle + (j + 1) * mult * gNum1
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
        possibleMoves.push({ src: triangle, moves: moves })
    }

    var oppdot1ntSoldiers = getOppdot1ntSoldiersLocations()
    var len = possibleMoves.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < oppdot1ntSoldiers.length; j++) {

            var moves = possibleMoves[i].moves

            if (moves[0] === oppdot1ntSoldiers[j] || ((moves[0] > 24 || moves[0] < 1))) {
                moves[0] = null;
                if (gIsDouble) {
                    moves[1] = moves[2] = moves[3] = null;
                }
            }

            if (moves[1] === oppdot1ntSoldiers[j] || ((moves[1] > 24 || moves[1] < 1))) {
                moves[1] = null;
                if (gIsDouble) {
                    moves[2] = moves[3] = null;
                }
            }

            if ((moves[2] === oppdot1ntSoldiers[j]) || ((moves[2] > 24 || moves[2] < 1)) || (moves[0] === null && moves[1] === null)) {
                moves[2] = null;
                if (gIsDouble) {
                    moves[3] = null;
                }
            }

            if (gIsDouble && moves[3] === oppdot1ntSoldiers[j] || ((moves[3] > 24 || moves[3] < 1))) {
                moves[3] = null;
            }
            possibleMoves[i].moves = moves;
        }
    }
    return possibleMoves;
}


function isAllNull(movesObjects) {
    var count = 0
    for (var i = 0; i < movesObjects.length; i++) {
        if (movesObjects[i].moves[0] === null && movesObjects[i].moves[1] === null &&
            movesObjects[i].moves[2] === null && (movesObjects[i].moves[3] === null || movesObjects[i].moves[3] === undefined)) {
            count++
        }
    }
    if (count === movesObjects.length) return true;
    else {
        return false;
    }
}



function drop(ev) {
    ev.preventDefault();
    var desTriangle = parseInt(ev.path[0].getAttribute('data-triangle'));
    if (isNaN(desTriangle)) {
        exitBoard(ev);
        cleanBoard();
        renderBoard();
        return;
    }

    //if drop back to src triangle
    if (desTriangle === gCurrTriangle) {
        cleanBoard()
        renderBoard()
        return;
    }
    //pushes soldier from currTriangle to dest in array (backend move)
    gBoard[desTriangle].push(gBoard[gCurrTriangle][gBoard[gCurrTriangle].length - 1])
    // removes moved soldier from src in array 
    gBoard[gCurrTriangle].pop()
    // changes triangle property in moved soldier object to desTriangle
    var currSoldier = gBoard[desTriangle][gBoard[desTriangle].length - 1];
    currSoldier.triangle = desTriangle;
    // set moved soldier column based on it's triangle
    currSoldier.column = calcColumn(currSoldier);
    if (gCurrTriangle === 26) gCurrTriangle = 0
    if (gCurrTriangle === 27) gCurrTriangle = 25
    var moveDist = Math.abs(desTriangle - gCurrTriangle)

    // get's rid of the num that was used in this turn
    if (!gIsDouble) {
        if (gNum1 === moveDist) {
            gNum1 = null;
            gSum = null;
        }
        else if (gNum2 === moveDist) {
            gNum2 = null;
            gSum = null;
        }
        else if (gSum === moveDist) {
            gNum1 = null;
            gNum2 = null;
            gSum = null;
        }
    }

    if (gIsDouble) {
        if (moveDist === gNum1) {
            gDoubleCount--;
            gSum -= gNum1;
        }
        if (moveDist === gNum1 * 2) {
            gDoubleCount -= 2
            gSum -= gNum1*2;
        }
        if (moveDist === gNum1 * 3) {
            gDoubleCount -= 3
            gSum -= gNum1*3;
        }
        if (moveDist === gNum1 * 4) {
            gDoubleCount -= 4
        }
        if (gDoubleCount === 0) {
            gNum1 = gNum2 = gSum = null;
        }
    }

    if (gBoard[desTriangle][0].color !== gCurrTurn) {
        eat(desTriangle)
    }

    // set the board
    fillCubeText()
    cleanBoard()
    renderBoard()
    gPossibleMoves = calcPossibleMoves()
    if (isAllNull(gPossibleMoves)) {
        endTurn()
        cleanBoard()
        renderBoard()
    }
}


function endTurn() {
    gNum1 = gNum2 = gSum = null;
    gIsDouble = false;
    gDoubleCount = 0;
    if (gCurrTurn === 'white') {
        gCurrTurn = 'black';
    }
    else gCurrTurn = 'white';

    var elCurrTurnChild = document.querySelector('.curr-turn div')
    elCurrTurnChild.innerHTML = `<div class="soldier-const ${gCurrTurn} inline"></div>`;

    throwCubes()
}
//checks for 15 soldiers in white or black (currTurn) in player's house or exit,(triangles  0-6 for black 19-25 for white)
// returns bool to drag()

function eat(triangle) {
    if (gCurrTurn === 'white') {
        var eatenIdx = 27;
        gBoard[triangle][0].src = 25;
    } else {
        eatenIdx = 26;
        gBoard[triangle][0].src = 0;
    }
    // moving eaten soldier to its new place in array 
    gBoard[triangle][0].column = 'middle'
    gBoard[triangle][0].triangle = eatenIdx
    gBoard[eatenIdx].push(gBoard[triangle][0]);
    gBoard[triangle].shift();

}

function isExitAllowed(color) {
    if (color === 'white') {
        var count = 0;
        for (var i = 19; i <= 25; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (gBoard[i][j].color === color) count++
            }
        }
        if (count === 15) {
            return true;
        }
    }
    if (color === 'black') {
        var count = 0;
        for (var i = 0; i <= 6; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (gBoard[i][j].color === color) {
                    count++
                }
            }
        }
        if (count === 15) return true;
    }
    return false;
}

function prepareToExitBoard(ev) {
    gCurrTriangle = ev.getAttribute('triangle');
    if (gCurrTurn === 'white') {
        if (Math.abs(gCurrTriangle - 25) > (gNum1 + gNum2)) {
            ev.setAttribute('ondblclick', 'null');
            return;
        }
    } else {
        if (gCurrTriangle > (gNum1 + gNum2)) {
            ev.setAttribute('ondblclick', 'null');
            return;
        }
    }
    exitBoard()
}

function exitBoard() {
    if (gCurrTurn === 'white') {
        var currSoldier = gBoard[gCurrTriangle][gBoard[gCurrTriangle].length - 1]
        gBoard[25].push(currSoldier)
        gBoard[gCurrTriangle].pop()
        var moveDist = 25 - gCurrTriangle
        // update model
        var soldier = gBoard[25][gBoard[25].length - 1]
        soldier.column = 25
        soldier.triangle = 25
        soldier.column = calcColumn(soldier)
    }
    if (gCurrTurn === 'black') {
        var currSoldier = gBoard[gCurrTriangle][gBoard[gCurrTriangle].length - 1]
        gBoard[0].push(currSoldier)
        gBoard[gCurrTriangle].pop()
        var moveDist = gCurrTriangle
        // update model
        var soldier = gBoard[0][gBoard[0].length - 1]
        soldier.column = 0
        soldier.triangle = 0
        soldier.column = calcColumn(soldier)
    }

    if (!gIsDouble) {

        if (moveDist <= gNum1) {
            gNum1 = gSum = null;
        }

        else if (moveDist <= gNum2) {
            gNum2 = gSum = null;
        }

        else if (moveDist > gNum2) {
            gNum1 = gNum2 = gSum = null;
        }
    }
    if (gIsDouble) {
        if (moveDist > gNum1 * 3) {
            gDoubleCount -= 4
        }
        else if (moveDist > gNum1 * 2) {
            gDoubleCount -= 3
        }
        else if (moveDist > gNum1 * 1) {
            gDoubleCount -= 2
        }
        else if (moveDist <= gNum1) {
            gDoubleCount--
        }
        if (gDoubleCount === 0) {
            gNum1 = gNum2 = gSum = null;
        }
        fillCubeText()
    }
    cleanBoard()
    renderBoard()
    gPossibleMoves = calcPossibleMoves()
    //check if end turn, and then endturn cleanboard setboard

    if (isEndGame()) {
        $('#winner-is').append(`${gCurrTurn} Won This Game!`).css('display','inline')

        cancelAllowDrop()
        var soldiers = $('.soldier')
        for (var i = 0; i < soldiers.length; i++) {
            soldiers[i].setAttribute('draggable', 'null')
        }
        if (isMars()) {
            $('#mars').append(`Mars`).css('display','inline')
            if (isTurkishMars()) {
                $('#mars').empty(`Turkish Mars`)
                $('#mars').append(`Turkish Mars`)
            }
        }
        return;
    }
    if (isAllNull(gPossibleMoves)) {
        endTurn()
        renderBoard()
    }
}

function isEndGame() {
    if (gCurrTurn === 'white') {
        if (gBoard[25].length === 15) return true;
    }
    if (gCurrTurn === 'black') {
        if (gBoard[0].length === 15) return true;
    }
}

function isMars() {

    if (gCurrTurn === 'white' && gBoard[0].length === 0) return true;

    else if (gCurrTurn === 'black' && gBoard[25].length === 0) return true;

    return false;
}

function isTurkishMars() {
    if (gCurrTurn === 'white') {
        var count = 0
        for (var i = 0; i < 7; i++) {
            count += gBoard[i].length
        }
        return (count < 15) ? true : false;
    }

    else {
        var count = 0
        for (var i = 19; i < 25; i++) {
            count += gBoard[i].length
        }
        return (count < 15) ? true : false;
    }
}

function calcColumn(soldier) {
    var column
    if (soldier.triangle > 0 && soldier.triangle <= 12) {
        column = soldier.triangle;
    }
    else if (soldier.triangle > 12 && soldier.triangle <= 24) {
        column = 25 - soldier.triangle;
    }
    else if (soldier.triangle === 0 || soldier.triangle === 25) {
        column = 0;
    }
    else if (soldier.triangle === 26 || soldier.triangle === 27) {
        column = 'middle';
    }
    return column;
}



function cleanBoard() {
    $('.soldier').remove();
    cancelAllowDrop()
}

function cancelAllowDrop() {
    for (var i = 0; i < gTriangles.length; i++) {
        gTriangles[i].setAttribute("ondragover", "null")
        gTriangles[i].setAttribute("ondrop", "null");
        changeToOriginal(i)
    }
    $('.hidden-bot')[0].setAttribute("ondragover", "null")
    $('.hidden-bot')[0].setAttribute("ondrop", "null");
    $('.hidden-top')[0].setAttribute("ondragover", "null")
    $('.hidden-top')[0].setAttribute("ondrop", "null");
}


function getObjBySrc(objects, src) {
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].src === 0 || objects[i].src === 25) {
            return objects[0];
        }
        if (objects[i].src === src) {
            return objects[i];
        }
    }
}


function changeToGreen(i) {
    i--;
    // if (i < 0 && isExitAllowed(gCurrTurn)) {
    //     document.querySelector('.hidden-top').classList.add('green')
    // }
    // if (i > 23 && isExitAllowed(gCurrTurn)) {
    //     document.querySelector('.hidden-bot').classList.add('green')
        
    // } 
    // bottom row  indexes are opposite direction

    if (i > 11) i = 35 - i;
    if (gTriangles[i].classList.contains('blackTr')) {
        gTriangles[i].classList.remove('blackTr')
        gTriangles[i].classList.add('greenTr')
    }
    else if (gTriangles[i].classList.contains('redTr')) {
        gTriangles[i].classList.remove('redTr')
        gTriangles[i].classList.add('greenTr')
    }
}


function changeAllToOriginal() {
    for (var i = 0; i < gTriangles.length; i++) {
        changeToOriginal(i)
    }
}

function changeToOriginal(i) {
    // bottom row taken care of
    if (document.querySelector('.hidden-top').classList.contains('green')) {
        document.querySelector('.hidden-top').classList.remove('green')
    }
    if (document.querySelector('.hidden-bot').classList.contains('green')) {
        document.querySelector('.hidden-bot').classList.remove('green')
    }
    if (i > 11) i = 35 - i;
    if (gTriangles[i].classList.contains('greenTr')) {
        gTriangles[i].classList.remove('greenTr')
        if (i <= 11) {
            if (i % 2 === 0) {
                // is black
                gTriangles[i].classList.add('blackTr')
                
            }
            else {
                // is red
                gTriangles[i].classList.add('redTr')
            }
        }
        if (i > 11) {
            if (i % 2 === 0) {
                // is red
                gTriangles[i].classList.add('redTr')
            }
            else {
                // is black
                gTriangles[i].classList.add('blackTr')
            }
        }
    }
}

function getOppdot1ntSoldiersLocations() {
    var oppdot1ntSoldiers = [];
    for (var i = 0; i < gBoard.length; i++) {
        if ((gBoard[i].length > 1) && (gBoard[i][0].color !== gCurrTurn)) {
            oppdot1ntSoldiers.push(parseInt(gBoard[i][0].triangle));
        }
    }
    return oppdot1ntSoldiers
}

function throwCubes() {
    cubesSound.play()
    $('.throw-cube').css('display', 'none')
    $('.cube').css('animation-name', 'spin')
    $('.cube').css('animation-duration', '0.1s')
    $('.cube').css('animation-iteration-count', '10')
    $('#cube-section').css('animation-name', 'flicker')
    $('#cube-section').css('animation-duration', '0.1s')
    $('#cube-section').css('animation-iteration-count', '10')
    setTimeout(function () {
        gNum1 = Math.round(Math.random() * 5 + 1);
        gNum2 = Math.round(Math.random() * 5 + 1);

        // for testing Double stuff make num1 === num2
        // gNum2 = gNum1

        switch (gNum1) {
            case 1:
                display('.cube1 .dot7')
                notDisplay('.cube1 .dot1')
                notDisplay('.cube1 .dot2')
                notDisplay('.cube1 .dot3')
                notDisplay('.cube1 .dot4')
                notDisplay('.cube1 .dot5')
                notDisplay('.cube1 .dot6')
                break;
            case 2:
                display('.cube1 .dot1')
                display('.cube1 .dot6')
                notDisplay('.cube1 .dot2')
                notDisplay('.cube1 .dot3')
                notDisplay('.cube1 .dot4')
                notDisplay('.cube1 .dot5')
                notDisplay('.cube1 .dot7')
                break;
            case 3:
                display('.cube1 .dot1')
                display('.cube1 .dot7')
                display('.cube1 .dot6')
                notDisplay('.cube1 .dot2')
                notDisplay('.cube1 .dot3')
                notDisplay('.cube1 .dot4')
                notDisplay('.cube1 .dot5')
                break;
            case 4:
                display('.cube1 .dot1')
                display('.cube1 .dot2')
                display('.cube1 .dot5')
                display('.cube1 .dot6')
                notDisplay('.cube1 .dot7')
                notDisplay('.cube1 .dot3')
                notDisplay('.cube1 .dot4')
                break;
            case 5:
                display('.cube1 .dot1')
                display('.cube1 .dot2')
                display('.cube1 .dot5')
                display('.cube1 .dot6')
                display('.cube1 .dot7')
                notDisplay('.cube1 .dot3')
                notDisplay('.cube1 .dot4')
                break;
            case 6:
                display('.cube1 .dot1')
                display('.cube1 .dot2')
                display('.cube1 .dot3')
                display('.cube1 .dot4')
                display('.cube1 .dot5')
                display('.cube1 .dot6')
                notDisplay('.cube1 .dot7')

        }

        switch (gNum2) {
            case 1:
                display('.cube2 .dot7')
                notDisplay('.cube2 .dot1')
                notDisplay('.cube2 .dot2')
                notDisplay('.cube2 .dot3')
                notDisplay('.cube2 .dot4')
                notDisplay('.cube2 .dot5')
                notDisplay('.cube2 .dot6')
                break;
            case 2:
                display('.cube2 .dot1')
                display('.cube2 .dot6')
                notDisplay('.cube2 .dot2')
                notDisplay('.cube2 .dot3')
                notDisplay('.cube2 .dot4')
                notDisplay('.cube2 .dot5')
                notDisplay('.cube2 .dot7')
                break;
            case 3:
                display('.cube2 .dot1')
                display('.cube2 .dot7')
                display('.cube2 .dot6')
                notDisplay('.cube2 .dot2')
                notDisplay('.cube2 .dot3')
                notDisplay('.cube2 .dot4')
                notDisplay('.cube2 .dot5')
                break;
            case 4:
                display('.cube2 .dot1')
                display('.cube2 .dot2')
                display('.cube2 .dot5')
                display('.cube2 .dot6')
                notDisplay('.cube2 .dot7')
                notDisplay('.cube2 .dot3')
                notDisplay('.cube2 .dot4')
                break;
            case 5:
                display('.cube2 .dot1')
                display('.cube2 .dot2')
                display('.cube2 .dot5')
                display('.cube2 .dot6')
                display('.cube2 .dot7')
                notDisplay('.cube2 .dot3')
                notDisplay('.cube2 .dot4')
                break;
            case 6:
                display('.cube2 .dot1')
                display('.cube2 .dot2')
                display('.cube2 .dot3')
                display('.cube2 .dot4')
                display('.cube2 .dot5')
                display('.cube2 .dot6')
                notDisplay('.cube2 .dot7')

        }
        $('.cube').css('animation-name', 'none')
        $('.cube').css('animation-duration', 'none')
        $('.cube').css('animation-iteration-count', 'none')
        $('#cube-section').css('animation-name', 'none')
        $('#cube-section').css('animation-duration', 'none')
        $('#cube-section').css('animation-iteration-count', 'none')

        //make sure num1 <= num2
        if (gNum1 > gNum2) {
            var num3 = gNum2;
            gNum2 = gNum1;
            gNum1 = num3;
        }
        gSum = gNum1 + gNum2;

        if (gNum1 !== gNum2) {
            gIsDouble = false;
            gDoubleCount = 0;
        } else {
            gIsDouble = true
            gDoubleCount = 4
            gSum *= 2
        }
        gPossibleMoves = calcPossibleMoves()
        if (isAllNull(gPossibleMoves)) {
            setTimeout(function(){
                beepSound.play()
                endTurn()
                cleanBoard()
                renderBoard()

            },1000)
        }
        fillCubeText()
    }, 1000)
}

function fillCubeText() {
    $('#cube-text').empty()
    if (gDoubleCount !== 0) {
        $('#cube-text').append(`double! ${gDoubleCount} X ${gNum1} = ${gSum}`);
    }
    else if (gNum1 !== null && gNum2 !== null) {
        $('#cube-text').append(`${gNum1} + ${gNum2} = ${gSum}`);
    }
    else if (gNum1 !== null && gNum2 === null) {
        $('#cube-text').append(gNum1);
    }
    else if (gNum1 === null && gNum2 !== null) {
        $('#cube-text').append(gNum2);
    }
}

//these functions show or remove the dots from the cubes
function display(el) {
    $(el).css('visibility', 'visible')

}
function notDisplay(el) {
    $(el).css('visibility', 'hidden')
}