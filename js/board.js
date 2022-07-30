'use strict'

const MINE_IMG = '💣'
const MARKED_IMG = '🚩'
const HAPPY_FACE = '😃'
const SAD_FACE = '😞'
const COOL_FACE = '😎'
const HEART = 'img/heart.png'
const HEART_LOST = 'img/heart_lost.png'
const HINT = 'img/hint_icon.png'
const HINT_ON = 'img/hint_on.png'

const gLevel = {
    SIZE: 4,
    MINES: 2,
    isSuperSeven: false
}
const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    heartCount: 3,
    safeClickCount: 3,
    hintCount: 3
}
var gBoard
var gTimer
var gIsFirstTurn
var gIsHintMode


function initGame() {
    buildBoard()
    renderBoard()
    displayMenus()
    gGame.isOn = true
    gIsFirstTurn = true
}

function renderBoard() {
    const elBoard = document.querySelector('.board');
    var strHTML = ''

    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>\n'

        for (var j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            var classStr = getClassName({ i, j })
            classStr += currCell.isShown || currCell.isShownTemp ? ' shown' : ''
            const minesAround = currCell.minesAround > 0 ? currCell.minesAround : ''

            strHTML += `\t<td class="cell ${classStr}" onmousedown="CellClicked(${i}, ${j}, event)" >\n`

            if (currCell.isShown || currCell.isShownTemp) strHTML += currCell.isMine ? MINE_IMG : minesAround
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
    gIsFirstTurn = false
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
    displayHints()
}

function displayTimer() {
    const elTimer = document.querySelector('.timer')
    elTimer.innerText = `${gGame.secsPassed}`
}

function displayHints() {
    const elHintsDisplay = document.querySelector('.hints')

    var strHTML = ''
    for (var i = 0; i < gGame.hintCount; i++) {
        strHTML += `<img src="${HINT}" alt="hint" onClick="getHint(this)">`
    }

    elHintsDisplay.innerHTML = strHTML
}

function displayNumOfMinesLeft() {
    const elMinesDisplay = document.querySelector('.mines')
    const minesLeft = gLevel.MINES - (3 - gGame.heartCount)

    elMinesDisplay.innerText = minesLeft - gGame.markedCount
}

function displayCurrentStatus(face) {
    const elFace = document.querySelector('.face')
    elFace.innerText = face
}

function displayHearts() {
    const elHeartsDisplay = document.querySelector('.hearts')

    var strHTML = ''
    for (var i = 0; i < gGame.heartCount; i++) {
        strHTML += `<img src="${HEART}" alt="heart">`
    }

    elHeartsDisplay.innerHTML = strHTML
}

function changeLostHeart() {
    const elHeartsDisplay = document.querySelector('.hearts img:last-of-type')
    elHeartsDisplay.src = HEART_LOST
    setTimeout(displayHearts, 600)
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
    elSafeClicksDisplay.innerText = gGame.safeClickCount
}

function checkGameOver() {
    const numberCellsAmount = Math.pow(gLevel.SIZE, 2) - gLevel.MINES
    const heartsUsed = 3 - gGame.heartCount

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

    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.heartCount = 3
    gGame.safeClickCount = 3
    gGame.hintCount = 3

    initGame()
}

function setNewHighScore() {
    if (gGame.secsPassed < localStorage[gLevel.SIZE] || !localStorage[gLevel.SIZE]) {
        localStorage[gLevel.SIZE] = gGame.secsPassed
    }
}

function safeClick() {
    if (gGame.safeClickCount === 0) return

    const safeCell = drawEmptyCell()
    const elCell = getCellByClass(safeCell)
    elCell.classList.add('safe')
    setTimeout(() => elCell.classList.remove('safe'), 3000)

    gGame.safeClickCount--
    displaySafeClicks()
}

function getHint(elHint) {
    if (!gGame.isOn || gIsHintMode) return
    elHint.src = HINT_ON
    gIsHintMode = true
}



