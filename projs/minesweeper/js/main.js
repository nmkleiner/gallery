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

const WINNER = "😎"
const DEAD = "😵"
const AFRAID = "😮"
const REGULAR = "🙂"



function init() {

    // gSafeCellsCount gets value inside 
    gIsGameOn = true;

    gOpenCellsCount = 0;
    var diff = getDiff()

    gBoard = createMat(diff)

    var cellsCount = gSize ** 2;
    var minesCount = gFlagCount
    gNoMinesCellsCount = cellsCount - minesCount

    console.table(gBoard)
    renderBoard(gBoard, '.board-container')
    restartTime()
    clearInterval(gShowTime)
    updateFlagsCountDisplay()
}

// get diff from user via form buttons
function getDiff() {
    var elDropdown = document.querySelector('.difficulty')
    var diff = elDropdown.value
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
    }
    gSize = size;
    // build empty mat

    var mat = []
    for (var i = 0; i < size; i++) {
        mat.push([])
        for (var j = 0; j < size; j++) {
            mat[i][j] = {
                open: false,
                mine: false,
                flag: false,
                detector: 0,
                i,
                j
            }
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
    }

    //CR: We don't need three variables here.****need to think about it
    gCorrectFlagsCount = gFlagCount = minesCount;

    return minesCount
}

// gets mat and mines, randomly locates the mines inside the mat and returns mat
function plantMines(mat, minesCount) {
    var i
    var j
    for (var idx = 0; idx < minesCount; idx++) {
        i = getRandomInt(0, mat.length);
        j = getRandomInt(0, mat.length);
        if (mat[i][j].mine === true) {
            idx--
            continue;
        }
        mat[i][j].mine = true;
    }
    return mat;
}

// run all over the mat and call countMinesAround() on every empty cell
// if count > 0 puts count inside cell
function calcDetectors(mat) {
    var detector
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat.length; j++) {

            if (mat[i][j].mine) continue;

            detector = countNeighbours(mat, i, j)
            if (detector !== 0) mat[i][j].detector = detector;
        }
    }
    return mat;
}


function renderBoard(mat, selector) {
    var elContainer = document.querySelector(selector);
    var strHTML = `<div class="table-header"> 
                    <div class="flag-count">0</div>
                    <div class="emoj" onclick="restart()">${REGULAR}</div>
                    <div class="timer">0</div>
                </div>
                <table border="0" class="board">
                    <tbody>`;

    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];

            var className = 'cell-' + i + '-' + j + ' cell' 
            
            if (mat[i][j].mine) {
                className = 'cell-' + i + '-' + j + ' mine cell' 
                cell = MINE;
            } 
            
            else if (mat[i][j].detector) {
                switch (mat[i][j].detector) {
                    case 1:
                        className = 'cell-' + i + '-' + j + ' one cell' 
                        break;
                    case 2:
                        className = 'cell-' + i + '-' + j + ' two cell' 
                        break;
                    case 3:
                        className = 'cell-' + i + '-' + j + ' three cell' 
                        break;
                    case 4:
                        className = 'cell-' + i + '-' + j + ' four cell' 
                        break;
                    case 5:
                        className = 'cell-' + i + '-' + j + ' five cell' 
                        break;
                    case 6:
                        className = 'cell-' + i + '-' + j + ' six cell' 
                        break;
                    case 7:
                        className = 'cell-' + i + '-' + j + ' seven cell' 
                        break;
                    case 8:
                        className = 'cell-' + i + '-' + j + ' eight cell' 
                        break;
                }
                cell = cell.detector
            }
            else {
                cell = ''
            }

            strHTML += '<td class="' + className +
                '" onmousedown="clickHandler(event,this)"> ' +
                '<span class="hidden">' + cell + '</span>' + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
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
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = 0
}