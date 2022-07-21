'use strict'
// separate victory and defeat
//recursion
// clean up messy functions
//CellClicked is horrible, deal with it later

const MINE_IMG = '💣'
const MARKED_IMG = '🚩'
const HAPPY_FACE = '😃'
const SAD_FACE = '😞'
const COOL_FACE = '😎'
const HEART = '💛'

var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    hearts: 3
}
var gTimer
var gFirstTurn

function initGame() {
    buildBoard()
    renderBoard(gBoard)
    displayTimer()
    displayNumOfMinesLeft()
    displayCurrentStatus(HAPPY_FACE)
    displayHearts()
    gFirstTurn = true
}

function renderBoard(board) {
    const elBoard = document.querySelector('.board');
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'

        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            const classStr = currCell.isShown ? ' shown' : ''
            const minesAround = currCell.minesAround > 0 ? currCell.minesAround : ''

            strHTML += `\t<td class="cell${classStr}" onmousedown="CellClicked(this, ${i}, ${j}, event)" >\n`

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
    setMinesNegsCount(gBoard)
    gTimer = setInterval(setTimer, 1000)
    gGame.isOn = true
    gFirstTurn = false
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

function setTimer() {
    gGame.secsPassed++
    displayTimer()
}

function displayTimer() {
    const elTimer = document.querySelector('.timer')
    elTimer.innerText = `${gGame.secsPassed}`
}

function displayNumOfMinesLeft() {
    const elMinesDisplay = document.querySelector('.mines')
    const minesLeft = gLevel.MINES - (3 - gGame.hearts)

    elMinesDisplay.innerText = minesLeft - gGame.markedCount > 0 ? minesLeft - gGame.markedCount : 0
}

function displayCurrentStatus(face) {
    const elFace = document.querySelector('.face')
    elFace.innerText = face
}

function displayHearts() {
    const hearts = HEART.repeat(gGame.hearts)
    const elHeartsDisplay = document.querySelector('.hearts')
    elHeartsDisplay.innerText = hearts
}

function expandShown(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[pos.i].length) continue
            var currCell = gBoard[i][j]
            if (!currCell.isShown && !currCell.isMarked) {
                currCell.isShown = true
                gGame.shownCount++
            }
        }
    }
    renderBoard(gBoard)
}

// function expandShown(pos) {
//     for (var i = pos.i - 1; i <= pos.i + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue
//         for (var j = pos.j - 1; j <= pos.j + 1; j++) {
//             if (j < 0 || j >= gBoard[pos.i].length) continue
//             var currCell = gBoard[i][j]
//             if (!currCell.isShown && !currCell.isMarked) {
//                 currCell.isShown = true
//                 gGame.shownCount++
//             }
//         }
//     }
//     renderBoard(gBoard)
// }

function expandShown(pos) {
    if (pos.i < 0 || pos.i > gBoard.length ||
        pos.j < 0 || pos.j > gBoard[0].length) return

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[pos.i].length) continue
            if (pos.i === i && pos.j === j) continue
            var currCell = gBoard[i][j]
            if (currCell.isShown) continue
            if (currCell.minesAround !== 0) {
                currCell.isShown = true
                gGame.shownCount++
                continue
            }
            if (!currCell.isMine) {
                currCell.isShown = true
                gGame.shownCount++
                console.log(i, j);
                expandShown({ i, j })
            }
        }
    }
}


function checkGameOver() {
    const numberCellsAmount = Math.pow(gLevel.SIZE, 2) - gLevel.MINES
    const heartsUsed = 3 - gGame.hearts
    if (gGame.shownCount - heartsUsed === numberCellsAmount && gGame.markedCount + heartsUsed === gLevel.MINES) {
        gGame.isOn = false
        clearInterval(gTimer)
        displayCurrentStatus(COOL_FACE)
    }
}

function defeat() {
    gGame.isOn = false
    clearInterval(gTimer)
    displayCurrentStatus(SAD_FACE)

    for (var i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) gBoard[i][j].isShown = true
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
    restartGame()
}

function restartGame() {
    clearInterval(gTimer)
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.hearts = 3

    initGame()
}

