'use strict'

const PACMAN = '<img src="img/pac-man-right.gif" class="ghost">'
var gPacman


function createPacman(board) {
    gPacman = {
        location: { 
            i: 2, 
            j: 4 
        },
        isSuper: false,
        direction: 'right' 
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN;
    gGame.foodCount--
}


function onMovePacman(ev) {
    if (!gGame.isOn) return

    // Get next location and the cell content at that location
    const nextLocation = getNextLocation(ev.key)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    // Return if cannot move
    if (nextCell === WALL) return

    // Update Pacman direction based on the key press
    switch (ev.key) {
        case 'ArrowUp':
            gPacman.direction = 'up'
            break
        case 'ArrowRight':
            gPacman.direction = 'right'
            break
        case 'ArrowDown':
            gPacman.direction = 'down'
            break
        case 'ArrowLeft':
            gPacman.direction = 'left'
            break
    }

    // Hitting a ghost? Call gameOver
    if (nextCell === GHOST) {
        if (gPacman.isSuper){
            eatGhost(nextLocation)
        }
        else {
            loseLife()
            return;
        }

    }

    // If next cell is FOOD, update score and check victory
    if (nextCell === FOOD) {
        updateScore(1)
        gGame.foodCount--
        checkIsVictory(); // Check victory only after eating food
    }

    if (nextCell === SUPER_FOOD) {
        if (!gPacman.isSuper) {
            handleSuperFood()
        } else {
            return
        }
    }

    if (nextCell === CHERRY) {
        updateScore(10)
    }

    // Moving from current location: update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    renderCell(gPacman.location, EMPTY)

    // Move the Pacman to new location: update the model
    gBoard[nextLocation.i][nextLocation.j] = PACMAN
    gPacman.location = nextLocation
    renderCell(gPacman.location, getPacmanHTML())
}



function getPacmanHTML() {
    switch (gPacman.direction) {
        case 'up':
            return '<img src="img/pac-man-up.gif" class="pacman">'
        case 'right':
            return '<img src="img/pac-man-right.gif" class="pacman">'
        case 'down':
            return '<img src="img/pac-man-down.gif" class="pacman">'
        case 'left':
            return '<img src="img/pac-man-left.gif" class="pacman">'
    }
}





function getNextLocation(eventKeyboard) {

    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    // DONE: figure out nextLocation
    switch (eventKeyboard) {
        case 'ArrowUp':
            nextLocation.i--
            break
        case 'ArrowRight':
            nextLocation.j++
            break
        case 'ArrowDown':
            nextLocation.i++
            break
        case 'ArrowLeft':
            nextLocation.j--
            break
    }
    return nextLocation
}

function handleSuperFood()
{
    updateScore(1)
    gGame.foodCount--
    checkIsVictory()
    gPacman.isSuper = true

    setTimeout (() => {
        gPacman.isSuper = false
        restoreGhosts()
        }, 5000)
}


function eatGhost(location) 
{
    // Find the ghost in the array and remove it
    for (var i = 0; i < gGhosts.length; i++) 
    {
        if (gGhosts[i].location.i === location.i && gGhosts[i].location.j === location.j) 
        {
            const eatenGhost = gGhosts.splice(i, 1)[0] // Remove the ghost from the array
            gEatenGhosts.push(eatenGhost) // Add the ghost to the eaten ghosts array
            break
        }
    }

    // Update the board model to remove the ghost
    gBoard[location.i][location.j] = EMPTY;
    // Immediately update the DOM to reflect the removal
    renderCell(location, EMPTY);
}



function restoreGhosts() 
{
    while (gEatenGhosts.length > 0) 
    {
        const ghost = gEatenGhosts.pop() // Remove a ghost from the eaten ghosts array
        gGhosts.push(ghost) // Add the ghost back to the active ghosts array

        // Place the ghost back on the board
        gBoard[ghost.location.i][ghost.location.j] = GHOST
        renderCell(ghost.location, getGhostHTML(ghost))
    }
}


function loseLife() 
{
    gGame.lives--
    updateLivesDisplay()

    if (gGame.lives === 0) 
    {
        gameOver()
    } else {
        // Reset Pacman's position
        resetPacmanPosition()
    }
}


function resetPacmanPosition() 
{
    // Clear Pacman's current position
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    renderCell(gPacman.location, EMPTY)

    // Set Pacman's initial position
    gPacman.location = { i: 2, j: 4 }
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
    renderCell(gPacman.location, getPacmanHTML())
}


function updateLivesDisplay() 
{
    document.querySelector('.lives').innerText = gGame.lives
}