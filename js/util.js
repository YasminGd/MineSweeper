'use strict'

function buildBoard() {
    gBoard = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        const row = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = {
                isShown: false,
                isMine: false,
                isMarked: false
            }
            row.push(cell)
        }
        gBoard.push(row)
    }
}

function countMinesAround(pos) {
    var mineCount = 0

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue

            const currCell = gBoard[i][j]
            if (currCell.isMine) mineCount++
        }
    }
    return mineCount
}

function getEmptyCells() {
    const emptyCells = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) emptyCells.push({ i, j })
        }
    }
    return emptyCells
}

function drawEmptyCell() {
    const emptyCells = getEmptyCells()
    var emptyCellIdx = getRandomInt(0, emptyCells.length)
    var emptyCell = emptyCells.splice(emptyCellIdx, 1)[0]

    return emptyCell
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function getClassName(location) {
    const cellClass = `cell-${location.i}-${location.j}`
    return cellClass
}

function getCellByClass(location) {
    const cellSelector = '.' + getClassName(location)
    const elCell = document.querySelector(cellSelector)
    return elCell
}



