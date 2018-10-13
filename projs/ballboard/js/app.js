const WALL = 'WALL';
const FLOOR = 'FLOOR';
const BALL = 'BALL';
const GAMER = 'GAMER';
const GLUE = 'GLUE';

const GAMER_IMG = '<img src="img/gamer.png">';
const BALL_IMG = '<img src="img/ball.png">';
const GLUE_IMG = '<img src="img/GLUE.jpg">';
const audioCollect = new Audio('sound/1.mp3');

var gGamerPos;
var gBoard;
var gGameInterval
var gGlueInterval
var gCollectedBallsCount


// משתנה גלובלי isGamerGlued
// when real moveTo has an if that just returns;

function init() {
	gGamerPos = { i: 2, j: 5 };
	gCollectedBallsCount = 0;
	showCount()
	gBoard = buildBoard();
	renderBoard(gBoard);
	gBallInterval = setInterval(createNewBall, 3000)
	gGlueInterval = setInterval(createGlue, 5000)
}


function createNewBall() {
	var coor = { i: getRandomInt(1, 9), j: getRandomInt(1, 11) }
	gBoard[coor.i][coor.j].gameElement = BALL;
	if (!(gBoard[coor.i][coor.j].gameElement === 'GAMER')) renderCell(coor, BALL_IMG);

}

function createGlue() {
	var coor = { i: getRandomInt(1, 9), j: getRandomInt(1, 11) }
	gBoard[coor.i][coor.j].gameElement = GLUE;
	if (!(gBoard[coor.i][coor.j].gameElement === 'GAMER')) renderCell(coor, GLUE_IMG);
	setTimeout(function () {
		gBoard[coor.i][coor.j].gameElement = null;
		renderCell(coor, '')
	}, 3000)
}

function showCount() {
	if (gCollectedBallsCount === 0) {
		var elCount = document.querySelector('.balls-count')
		elCount.style.visibility = 'hidden'

	}
	else if (gCollectedBallsCount === 1) {
		var elCount = document.querySelector('.balls-count')
		elCount.style.visibility = 'visible'
	}
	var elCount = document.querySelector('.balls-count')
	elCount.innerHTML = 'Balls Collected:' + gCollectedBallsCount


}

function isGameWon() {
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			if (gBoard[i][j].gameElement === BALL) {
				// console.log('still working')
				return false;
			}
		}
	}
	console.log('game won')
	return true;
}

// build the model
function buildBoard() {
	// Create the Matrix
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var cell = { type: FLOOR, gameElement: null };
			// Place Walls at edges
			if ((i === 0 && j !== 5) || (i === board.length - 1 && j !== 5) ||
				(j === 0 && i !== 5) || (j === board[0].length - 1 && i !== 5)) {
				cell.type = WALL;
			}
			board[i][j] = cell;
		}
	}
	// Place the gamer
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls
	board[getRandomInt(1, 9)][getRandomInt(1, 11)].gameElement = BALL;
	board[getRandomInt(1, 9)][getRandomInt(1, 11)].gameElement = BALL;

	console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var elBoard = document.querySelector('.board');
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += '\t' + GAMER_IMG + '\n';
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	console.log('strHTML is:');
	console.log(strHTML);
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {

	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			audioCollect.play()
			targetCell.gameElement = GAMER
			gCollectedBallsCount++
			showCount()
			if (isGameWon()) {
				clearInterval(gBallInterval)
				clearInterval(gGlueInterval)
				endGame()
			}
		}

		//any changes should be made in moveThrough() too
		if (targetCell.gameElement === GLUE) {
			console.log('glue')
			targetCell.gameElement = GAMER
			var body = document.querySelector('body')

			body.setAttribute('onkeydown','undefined')
			setTimeout(function() {
				body.setAttribute('onkeydown','handleKey(event)')
			}, 3000)
		}

		// MOVING
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		renderCell(gGamerPos, '');

		gGamerPos.i = i;
		gGamerPos.j = j;

		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		renderCell(gGamerPos, GAMER_IMG);

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}
function moveThrough(i, j) {

	// getting out of src 
	gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
	renderCell(gGamerPos, '');

	// updating the model
	gGamerPos.i = i;
	gGamerPos.j = j;

	// getting in destination
	gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
	renderCell(gGamerPos, GAMER_IMG);
}

function endGame() {
	var btn = document.querySelector('.restart-btn');
	btn.style.display = 'inline-block'
}

function restart() {
	var btn = document.querySelector('.restart-btn');
	btn.style.display = 'none'
	init()
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {
	var i = gGamerPos.i;
	var j = gGamerPos.j;

	switch (event.key) {
		case 'ArrowLeft':
			if (i === 5 && j === 0) {
				console.log(i, gBoard[0].length - 1)
				moveThrough(i, gBoard[0].length - 1)
				break;
			}
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			if (i === 5 && j === gBoard[0].length - 1) {
				moveThrough(i, 0)
				break;
			}
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			if (i === 0 && j === 5) {
				moveThrough(gBoard.length - 1, j)
				break;
			}
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			if (i === gBoard.length - 1 && j === 5) {
				console.log(i, gBoard[0].length - 1)
				moveThrough(0, j)
				break;
			}
			moveTo(i + 1, j);
			break;
	}
}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}


function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}