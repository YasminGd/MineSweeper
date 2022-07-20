'use strict'
const MINE_IMG = '💣'
const MARKED_IMG = '🚩'

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

function initGame() {
    buildBoard()

    renderBoard(gBoard)
    console.log(gBoard);
}

function setRandomMines() {
    for (var i = 0; i < gLevel.MINES; i++) {
        const pos = drawEmptyCell()
        gBoard[pos.i][pos.j].isMine = true
    }
}

function setMinesNegsCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            const currCell = board[i][j]
            if (currCell.isMine) continue
            currCell.minesAroundCount = countMinesAround(board, { i, j })
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
            cellClass += cellClass.isShown ? '' : ' covered'

            strHTML += `\t<td class="cell ${cellClass}"  onmousedown="CellClicked(this, ${i}, ${j},event)" >\n`

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML
    console.log(strHTML);
}

function CellClicked(elCell, i, j, event) {
    if (!gGame.isOn) {
        setRandomMines()
        setMinesNegsCount(gBoard)
        gStartTime = new Date().getTime()
        gTimer = setInterval(setTimer, 1000)
        gGame.isOn = true
    }

    const cell = gBoard[i][j]
    if (cell.isShown) return

    if (event.button === 2) {
        cell.isMarked = !cell.isMarked
    }
    else if (event.button === 0) {
        if (cell.isMarked) return
        cell.isShown = true
    }

    var textStr = ''
    if (cell.isShown) {
        textStr = cell.isMine ? MINE_IMG : cell.minesAroundCount
    } else {
        textStr = cell.isMarked ? MARKED_IMG : ''
    }
    elCell.innerText = textStr
}

function setTimer() {
    const currTime = new Date().getTime()
    const timePassed = new Date(currTime - gStartTime)
    const seconds = timePassed.getSeconds()
    const elTimer = document.querySelector('.timer')

    elTimer.innerText = `${seconds}`
}

function displayNumOfMinesLeft() {
    const elMinesDisplay = document.querySelector('.mines')

    elMinesDisplay.innerText = gLevel.MINES
}