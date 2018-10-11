var gSize;
var gTable;
var gCount
var gStrikeCount


function init() {
    gSize = 16;
    gCount = 1;
    gStrikeCount = 3;
    gTable = createTable();
    console.log(gTable);
    renderStrikes()
    renderTable(gTable);
}

function createTable() {
    var nums = [];
    for (var i = 0; i < gSize; i++) {
        nums.push(i + 1)
    }
    nums = shuffle(nums);
    return nums
}

function renderStrikes() {
    var txt = `${gStrikeCount}`
    var elSpan = document.querySelector('.strikes-count span');
    elSpan.innerText = txt;
}

function renderTable(table) {
    var strHTML = '<table border="1"><col width="50">\
    <col width="50">\
    <col width="50">\
    <col width="50">\
    '
    for (var i = 0; i < gSize; i += 4) {
        strHTML += '<tr>';
        for (var j = 0; j < Math.sqrt(gSize); j++) {
            strHTML += `<td onclick="clickNum(${table[i + j]},this)">`
            strHTML += table[i + j]
            strHTML += '</td>'
        }
        strHTML += '</tr>';
    }
    strHTML += '</table>';

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML += strHTML;
}


function clickNum(n, elNum) {

    if (gCount === 16) wonGame()

    if (checkNum(n)) {
        gCount++;
        elNum.style.backgroundColor = 'green';
    }
    else {
        strike()
    }
}

function checkNum(n) {
    return (n === gCount);
}

function wonGame() {
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = '<div class="game-end won">Wow You Won The Game!</div>'
}

function lostGame() {
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = '<div class="game-end lost">Wow You Lost The Game!</div>'
}

function strike() {
    gStrikeCount--
    renderStrikes()
    if (gStrikeCount < 1) lostGame()
}




function shuffle(array) {
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
}