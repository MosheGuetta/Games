'use strict'

const WALL = '<img src="img/wall.png" class="pacman">'
const FOOD = '* '
const EMPTY = ' '
const SUPER_FOOD = '🍫'
const CHERRY = '🍒'


let gFoodCount
var gCherryInterval

const gGame = {
    score: 0,
    isOn: false,
    isVictory: false,
    foodCount: -1,
    lives: 3,
}

var gBoard

function onInit() {
    gGame.score = 0
    gGame.foodCount = 0 
    gGame.isVictory = false 
    gGame.lives = 3
    updateScore(0)
    updateLivesDisplay()
    gBoard = buildBoard()

    createGhosts(gBoard)
    createPacman(gBoard) 

    renderBoard(gBoard)
    gGame.isOn = true
    closeModal()
    gCherryInterval = setInterval(placeCherry, 5000);

}


function buildBoard() {
    let height = 19
    let width = 11
    const board = []

    // Initialize the board with food
    for (let i = 0; i < width; i++) 
    {
        board.push([])
        for (let j = 0; j < height; j++) 
        {
            board[i][j] = FOOD
            gGame.foodCount ++
        }
    }

    // Create the border walls
    for (let i = 0; i < width; i++) {
        board[i][0] = WALL
        board[i][height - 1] = WALL
        gGame.foodCount --
    }
    for (let j = 0; j < height; j++) {
        board[0][j] = WALL
        board[width - 1][j] = WALL
        gGame.foodCount --
    }

    // Add new walls as specified
    const wallPositions = [
        { i: 2, j: 2 }, { i: 2, j: 3 }, { i: 2, j: 4 }, { i: 2, j: 8 }, { i: 2, j: 9 }, 
        { i: 2, j: 10 }, { i: 2, j: 14 }, { i: 2, j: 15 }, { i: 2, j: 16 }, { i: 4, j: 2 }, 
        { i: 4, j: 4 }, { i: 4, j: 5 }, { i: 4, j: 7 }, { i: 4, j: 11 }, { i: 4, j: 13 }, 
        { i: 4, j: 14 }, { i: 5, j: 7 }, { i: 5, j: 11 }, { i: 6, j: 2 }, { i: 6, j: 4 }, 
        { i: 6, j: 14 }, { i: 6, j: 16 },{ i: 8, j: 2 }, { i: 8, j: 8 }, { i: 8, j: 9 }, 
        { i: 8, j: 10 }, { i: 8, j: 16 }, { i: 1, j: 2 }, { i: 8, j: 3 }, { i: 9, j: 3 },
        { i: 9, j: 9 }, { i: 5, j: 1 }, { i: 5, j: 17}, { i: 5, j: 13}, { i: 5, j: 12},
        { i: 1, j: 9}, { i: 8, j: 5}, { i: 8, j: 6}, { i: 8, j: 13}, { i: 8, j: 14},
        { i: 5, j: 9}, { i: 6, j: 9}
    ]

    // Place the walls on the board
    for (const pos of wallPositions) {
        board[pos.i][pos.j] = WALL
        gGame.foodCount --
    }

    // Set Pacman's initial position
    creatPowerFood(board)
    return board
}


function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}


// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function creatPowerFood(board){
    board[1][1] = SUPER_FOOD
    board[1][board[0].length - 2] = SUPER_FOOD
    board[board.length - 2][1] = SUPER_FOOD
    board[board.length - 2][board[0].length - 2] = SUPER_FOOD
    gGame.foodCount -= 4 
}

function updateScore(diff) {
    // DONE: update model
    if (diff) {
        gGame.score += diff
    } else {
        gGame.score = 0
    }
    // DONE and dom
    document.querySelector('span.score').innerText = gGame.score
}

function gameOver() {
    console.log('Game Over')
    // TODO
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)
    renderCell(gPacman.location, '🪦')
    gGame.isOn = false
    var msg = gGame.isVictory ? "You won!" : "Game over!"
    showModal(msg)
}

function showModal(msg)
{
    const elModal = document.querySelector('.modal')
    const elMsg = document.querySelector('.modal .msg')

    elMsg.innerText = msg
    elModal.style.display = "block"
    
}

function closeModal()
{
    const elModal = document.querySelector('.modal')
    elModal.style.display = "none"

}

function checkIsVictory()
{
    if (gGame.foodCount === 0)
    {
        gGame.isVictory = true
        gameOver()
    }      
}

function placeCherry() {
    const emptyCells = getEmptyCell();
    if (emptyCells.length === 0) return; // Stop if no empty cell is found

    const randIdx =  Math.floor(Math.random() * emptyCells.length);
    const randCell = emptyCells[randIdx];

    // Update MODEL to place CHERRY
    gBoard[randCell.i][randCell.j] = CHERRY;

    // Update DOM
    renderCell(randCell, CHERRY);

}

function getEmptyCell()
{
	const emptyCell = []
	for (var i = 1; i < gBoard.length - 1; i++) 
		{
        for (var j = 1; j < gBoard[i].length - 1; j++) 
			{
				const currCell = gBoard[i][j]
				if(currCell === EMPTY)
				{
					emptyCell.push({i:i, j:j})
				}
			}
		}

		return emptyCell
}