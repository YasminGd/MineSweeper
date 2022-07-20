'use strict'
// separate victory and defeat
//recursion
// clean up messy functions
//CellClicked is horrible, deal with it later

/*Functionality and Features
● Show a timer that starts on first click (right / left) and stops
when game is over.                                                       DONE
● Left click reveals the cell’s content                                  DONE
● Right click flags/unflags a suspected cell (you cannot reveal a
flagged cell)                                                            DONE
● Game ends when:
o LOSE: when clicking a mine, all mines should be revealed               DONE
o WIN: all the mines are flagged, and all the other cells are
shown                                                                    DONE
● Support 3 levels of the game
o Beginner (4*4 with 2 MINES)
o Medium (8 * 8 with 12 MINES)
o Expert (12 * 12 with 30 MINES)
● If you have the time, make your Minesweeper look great.
● Expanding: When left clicking on cells there are 3 possible
cases we want to address:
o MINE – reveal the mine clicked
o Cell with neighbors – reveal the cell alone
o Cell without neighbors – expand it and its 1st degree
neighbors*/

const MINE_IMG = '💣'
const MARKED_IMG = '🚩'
const HAPPY_FACE = '😃'
const SAD_FACE = '😞'
const COOL_FACE = '😎'

var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gStartTime
var gTimer
var gFirstTurn

function initGame() {
    buildBoard()
    renderBoard(gBoard)
    displayNumOfMinesLeft()
    displayCurrentStatus(HAPPY_FACE)
    gFirstTurn = true
}

function setRandomMines(forbiddenCell) {
    for (var i = 0; i < gLevel.MINES; i++) {
        const pos = drawEmptyCell()
        if (pos.i === forbiddenCell.i && pos.j === forbiddenCell.j) {
            i--
            continue
        }
        gBoard[pos.i][pos.j].isMine = true
    }
}

function setMinesNegsCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            const currCell = board[i][j]
            if (currCell.isMine) continue
            currCell.minesAround = countMinesAround(board, { i, j })
        }
    }
}

function renderBoard(board) {
    const elBoard = document.querySelector('.board');
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'

        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i, j })

            strHTML += `\t<td class="cell ${cellClass}"  onmousedown="CellClicked(this, ${i}, ${j},event)" >\n`

            if (currCell.isShown) strHTML += currCell.isMine ? MINE_IMG : currCell.minesAround
            else if (currCell.isMarked) strHTML += MARKED_IMG

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML
}

function CellClicked(elCell, i, j, event) {
    if (!gGame.isOn && !gFirstTurn) return
    if (gFirstTurn) beginGame({ i, j })

    const cell = gBoard[i][j]
    if (cell.isShown) return

    if (event.button === 2) {
        if (cell.isMarked) {
            gLevel.MINES++
            gGame.markedCount--
        } else {
            if (gLevel.MINES > 0) gLevel.MINES--
            gGame.markedCount++
        }
        cell.isMarked = !cell.isMarked
        displayNumOfMinesLeft()
    }
    else if (event.button === 0) {
        if (cell.isMarked) return

        cell.isShown = true
        gGame.shownCount++

        if (cell.minesAround === 0) expandShown({ i, j })
        if (cell.isMine) defeat(elCell)
    }
    renderBoard(gBoard)
    checkGameOver()
}

function setTimer() {
    // const currTime = new Date().getTime()
    // const timePassed = new Date(currTime - gStartTime)
    // gGame.secsPassed = timePassed.getSeconds()
    const elTimer = document.querySelector('.timer')
    console.log(gGame.secsPassed)
    gGame.secsPassed++
    elTimer.innerText = `${gGame.secsPassed}`
}

function displayNumOfMinesLeft() {
    const elMinesDisplay = document.querySelector('.mines')

    elMinesDisplay.innerText = gLevel.MINES
}

function displayCurrentStatus(face) {
    const elFace = document.querySelector('.face')
    elFace.innerText = face
}

function checkGameOver() {
    if (gGame.shownCount + gGame.markedCount === Math.pow(gLevel.SIZE, 2)) {
        gGame.isOn = false
        clearInterval(gTimer)
        displayCurrentStatus(COOL_FACE)
    }
}

function defeat(elCell) {
    gGame.isOn = false
    clearInterval(gTimer)
    displayCurrentStatus(SAD_FACE)

    for(var i = 0; i < gBoard.length; i++){
        for(let j = 0; j < gBoard[i].length; j++){
            if (gBoard[i][j].isMine) gBoard[i][j].isShown = true
        }
    }

    renderBoard(gBoard)
    
}

function beginGame(pos) {
    setRandomMines(pos)
    setMinesNegsCount(gBoard)
    gTimer = setInterval(setTimer, 1000)
    gGame.isOn = true
    gFirstTurn = false
}

function expandShown(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[pos.i].length) continue
            var currCell = gBoard[i][j]
            if (!currCell.isShown) {
                currCell.isShown = true
                gGame.shownCount++
            }
        }
    }
    renderBoard(gBoard)
}

function changeLevel(size) {
    switch (+size) {
        case 4:
            gLevel.SIZE = size
            gLevel.MINES = 2
            break
        case 8:
            gLevel.SIZE = size
            gLevel.MINES = 12
            break
        case 12:
            gLevel.SIZE = size
            gLevel.MINES = 30
            break
    }
    initGame()
}

function restartGame() {

}