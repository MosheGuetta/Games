'use strict'

const GHOST = '<img src="img/ghost.png" class="pacman">'

const GHOST_COLORS = ['hue-rotate(0deg)', 'hue-rotate(180deg)', 'hue-rotate(90deg)', 
                        'hue-rotate(270deg)', 'hue-rotate(45deg)']



var gGhosts = []
var gEatenGhosts = []
var gIntervalGhosts

function createGhosts(board) 
{
    // DONE: 3 ghosts and an interval
    gGhosts = []
    for (var i = 0; i < 5; i++) 
    {
        createGhost(board)
    }
    gIntervalGhosts = setInterval(moveGhosts, 400)

}


function createGhost(board) 
{
    // Choose a color filter for the ghost
    const ghostColorFilter = GHOST_COLORS[gGhosts.length % GHOST_COLORS.length]

    const ghost = {
        location: { 
            i: getRandomIntInclusive(1, gBoard.length - 2), 
            j: getRandomIntInclusive(1, gBoard[0].length - 2) 
        },
        currCellContent: FOOD,
        colorFilter: ghostColorFilter,
    }

    board[ghost.location.i][ghost.location.j] = GHOST
    gGhosts.push(ghost)
}


function moveGhosts() {
    // DONE: loop through ghosts
    for (var i = 0; i < gGhosts.length; i++) {
        const ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    // DONE: figure out moveDiff, nextLocation, nextCell
    const moveDiff = getMoveDiff()
    const nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j,
    }
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    // DONE: return if cannot move
    if (nextCell === WALL) return
    if (nextCell === GHOST) return

    // DONE: hitting a pacman? call gameOver
    if (nextCell === PACMAN) {
        gameOver()
        return
    }


    // DONE: moving from current location:
    // DONE: update the model (restore prev cell contents)
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // DONE: update the DOM
    renderCell(ghost.location, ghost.currCellContent)


    // DONE: Move the ghost to new location:
    // DONE: update the model (save cell contents)
    ghost.location = nextLocation
    ghost.currCellContent = nextCell
    gBoard[nextLocation.i][nextLocation.j] = GHOST
    // DONE: update the DOM
    renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    const filter = gPacman.isSuper ? 'invert(47%) sepia(91%) saturate(4588%) hue-rotate(166deg) brightness(88%) contrast(107%)' : ghost.colorFilter;
    return `<img src="img/ghost.png" class="ghost" style="filter: ${filter};">`;
}





