'use strict'

const MINE_IMG = '💣'
const MARKED_IMG = '🚩'
const HAPPY_FACE = '😃'
const SAD_FACE = '😞'
const COOL_FACE = '😎'
const HEART = '💛'

var gBoard
const gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    hearts: 3,
    safeClicks: 3
}
var gTimer
var gFirstTurn

function initGame() {
    buildBoard()
    renderBoard()
    displayMenus()
    gGame.isOn = true
    gFirstTurn = true
}

function renderBoard() {
    const elBoard = document.querySelector('.board');
    var strHTML = ''

    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>\n'

        for (var j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            var classStr = getClassName({ i, j })
            classStr += currCell.isShown ? ' shown' : ''
            const minesAround = currCell.minesAround > 0 ? currCell.minesAround : ''

            strHTML += `\t<td class="cell ${classStr}" onmousedown="CellClicked(${i}, ${j}, event)" >\n`

            if (currCell.isShown) strHTML += currCell.isMine ? MINE_IMG : minesAround
            else if (currCell.isMarked) strHTML += MARKED_IMG

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML
}

function beginGame(pos) {
    setRandomMines(pos)
    setMinesNegsCount()
    gTimer = setInterval(setTimer, 1000)
    gFirstTurn = false
}

function setRandomMines(pos) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var cell = drawEmptyCell()
        while (pos.i === cell.i && pos.j === cell.j) cell = drawEmptyCell()
        gBoard[cell.i][cell.j].isMine = true
    }
}

function setTimer() {
    gGame.secsPassed++
    displayTimer()
}

function displayMenus() {
    displayTimer()
    displayNumOfMinesLeft()
    displayCurrentStatus(HAPPY_FACE)
    displayHearts()
    displayBestTime()
    displaySafeClicks()
}

function displayTimer() {
    const elTimer = document.querySelector('.timer')
    elTimer.innerText = `${gGame.secsPassed}`
}

function displayNumOfMinesLeft() {
    const elMinesDisplay = document.querySelector('.mines')
    const minesLeft = gLevel.MINES - (3 - gGame.hearts)

    elMinesDisplay.innerText = minesLeft - gGame.markedCount
}

function displayCurrentStatus(face) {
    const elFace = document.querySelector('.face')
    elFace.innerText = face
}

function displayHearts() {
    const elHeartsDisplay = document.querySelector('.hearts')
    const hearts = HEART.repeat(gGame.hearts)

    elHeartsDisplay.innerText = hearts
}

function displayBestTime() {
    const elBestTimeDisplay = document.querySelector('.best-score')

    if (localStorage[gLevel.SIZE]) {
        elBestTimeDisplay.innerText = `Best time in this category is: ${localStorage[gLevel.SIZE]} seconds!`
    } else {
        elBestTimeDisplay.innerText = ''
    }
}

function displaySafeClicks() {
    const elSafeClicksDisplay = document.querySelector('button span')
    elSafeClicksDisplay.innerText = gGame.safeClicks
}

function checkGameOver() {
    const numberCellsAmount = Math.pow(gLevel.SIZE, 2) - gLevel.MINES
    const heartsUsed = 3 - gGame.hearts

    if (gGame.shownCount - heartsUsed === numberCellsAmount &&
        gGame.markedCount + heartsUsed === gLevel.MINES) {
        setNewHighScore()
        stopGame(COOL_FACE)
    }
}

function defeat() {
    stopGame(SAD_FACE)

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) gBoard[i][j].isShown = true
        }
    }

    renderBoard(gBoard)

}

function stopGame(face) {
    gGame.isOn = false
    clearInterval(gTimer)
    displayCurrentStatus(face)
}

function changeLevel(size) {
    gLevel.SIZE = +size

    switch (+size) {
        case 4:
            gLevel.MINES = 2
            break
        case 8:
            gLevel.MINES = 12
            break
        case 12:
            gLevel.MINES = 30
            break
    }
    restartGame()
}

function restartGame() {
    clearInterval(gTimer)
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        hearts: 3,
        safeClicks: 3
    }
    initGame()
}

function setNewHighScore() {
    if (gGame.secsPassed < localStorage[gLevel.SIZE] || !localStorage[gLevel.SIZE]) {
        localStorage[gLevel.SIZE] = gGame.secsPassed
    }
}

function safeClick() {
    if (gGame.safeClicks === 0) return

    const safeCell = drawEmptyCell()
    const elCell = getCellByClass(safeCell)
    elCell.classList.add('safe')
    setTimeout(() => elCell.classList.remove('safe'), 3000)
    gGame.safeClicks--
    displaySafeClicks()
}


