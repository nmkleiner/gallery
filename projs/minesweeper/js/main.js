'use srict;'
// functions used:
// init    getDiff     createMat   plantMines  calcDetectors   countMinesAround
// renderBoard      updateFlagsCountDisplay     restartTimer    gameWon
// gameOver     clickHandler    flagCell    isFlagCorrect      openCell
// isEmptyCell  isNumCell   isVictory   restart 




var gBoard
var gSize
var gIsGameOn

var gFlagCount
var gOpenCellsCount
var gNoMinesCellsCount
var gCorrectFlagsCount

var gShowTime


const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''
const OPEN = ' '


function init() {

    // gSafeCellsCount gets value inside 
    gIsGameOn = true;
    clearInterval(gShowTime)
    restartTime()

    gOpenCellsCount = 0;
    //CR: Why to use a global? // corrected
    var diff = getDiff()

    gBoard = createMat(diff)
    
    var cellsCount = gSize ** 2;
    var minesCount = gFlagCount
    gNoMinesCellsCount = cellsCount - minesCount

    console.table(gBoard)
    renderBoard(gBoard, '.board-container')
    updateFlagsCountDisplay()
}

// get diff from user via form buttons
function getDiff() {
    var elRadios = document.querySelectorAll('.radio-row')
    for (var i = 0; i < elRadios.length; i++) {
        if (elRadios[i].checked) {
            var diff = elRadios[i].value
            break;
        }
    }
    return diff
}



// gets diff, sets size of mat, creates empty mat, calls plantMines(), returns mat
function createMat(diff) {
    // decide mat size
    var size;
    switch (diff) {
        case 'Easy':
            size = 4;
            break;
        case 'Medium':
            size = 6;
            break;
        case 'Hard':
            size = 8;
            break;
        case 'Extreme':
            size = 12;
            break;
    }
    gSize = size;
    // build empty mat

    // CR: You Did not use the cell object as written at the PDF. // that would be hard to change
    var mat = []
    for (var i = 0; i < size; i++) {
        mat.push([])
        for (var j = 0; j < size; j++) {
            mat[i][j] = EMPTY
        }
    }
    // fill mat with mines and numbers
    mat = plantMines(mat, createMines(diff))
    mat = calcDetectors(mat)
    return mat;
}


// gets diff, sets number of mines, creates and returns array of mines for plantMines()
function createMines(diff) {
    var minesCount;
    switch (diff) {
        case 'Easy':
            minesCount = 2;
            break;
        case 'Medium':
            minesCount = 5;
            break;
        case 'Hard':
            minesCount = 15;
            break;
        case 'Extreme':
            minesCount = 30;
            break;
    }

    //CR: We don't need three variables here.****need to think about it
    gCorrectFlagsCount = gFlagCount = minesCount;
    
    return minesCount
    // CR: Why Array? :// corrected
    
}

// gets mat and mines, randomly locates the mines inside the mat and returns mat
function plantMines(mat, minesCount) {
    var i
    var j
    for (var idx = 0; idx < minesCount; idx++) {
        i = getRandomInt(0, mat.length);
        j = getRandomInt(0, mat.length);
        if (mat[i][j] === MINE) {
            idx--
            continue;
        }
        mat[i][j] = MINE;
    }
    return mat;
}

// run all over the mat and call countMinesAround() on every empty cell
// if count > 0 puts count inside cell
function calcDetectors(mat) {
    var detector
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat.length; j++) {

            if (mat[i][j] === MINE) continue;

            detector = countNeighbours(mat, i, j)
            if (detector !== 0) mat[i][j] = detector;
        }
    }
    return mat;
}



function renderBoard(mat, selector) {

    var elContainer = document.querySelector(selector);
    var strHTML = '<table border="0" ><tbody>';

    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];


            var className = 'cell cell-' + i + '-' + j;

            switch (mat[i][j]) {
                case MINE:
                    className = 'mine cell cell-' + i + '-' + j;
                    break;
                case 1:
                    className = 'one cell cell-' + i + '-' + j;
                    break;
                case 2:
                    className = 'two cell cell-' + i + '-' + j;
                    break;
                case 3:
                    className = 'three cell cell-' + i + '-' + j;
                    break;
                case 4:
                    className = 'four cell cell-' + i + '-' + j;
                    break;
                case 5:
                    className = 'five cell cell-' + i + '-' + j;
                    break;
                case 6:
                    className = 'six cell cell-' + i + '-' + j;
                    break;
                case 7:
                    className = 'seven cell cell-' + i + '-' + j;
                    break;
                case 8:
                    className = 'eight cell cell-' + i + '-' + j;
                    break;
            }

            strHTML += '<td class="' + className +
                '" onmousedown="clickHandler(event,this)"> ' +
                '<span class="hidden">' + cell + '</span>' + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    // console.log('strHTML', strHTML);
    elContainer.innerHTML = strHTML;
}


function updateFlagsCountDisplay() {
    var elFlagCount = document.querySelector('.flag-count');
    elFlagCount.innerText = gFlagCount;
    if (gFlagCount >= 0) {
        $('.flag-count').css({
            color: 'black',
            backgroundColor: 'orange'
        })
    }
    if (gFlagCount < 0) {
        $('.alert').html('Too much 🚩!')
        $('.alert').fadeToggle(200).delay(300).fadeToggle(100)
        $('.flag-count').css({
            color: 'red',
            backgroundColor: 'black'
        })
    }
}


function startTimer() {
    if (gOpenCellsCount === 1) {
        var startTime = Date.now();

        gShowTime = setInterval(function () {
            var millis = Date.now() / 1000 - startTime / 1000;
            var elTime = document.querySelector('.timer');
            elTime.innerText = ' ' + ((millis).toFixed(0));
        }, 1000);
    }
}

function restartTime() {
    // CR: Where is the model? you restarted only the DOM.
    // 
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = 0
}