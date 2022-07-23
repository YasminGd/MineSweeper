'use strict'

function CellClicked(i, j, event) {
    if (!gGame.isOn) return
    
    const cell = gBoard[i][j]

    if (cell.isShown) return

    if (gIsFirstTurn) beginGame({ i, j })

    if (gIsHintMode) {
        showCells({ i, j })
        gIsHintMode = false
        gGame.hintCount--
        displayHints()
        return
    }

    if (event.button === 2) {
        cell.isMarked ? gGame.markedCount-- : gGame.markedCount++

        cell.isMarked = !cell.isMarked
        displayNumOfMinesLeft()
    }
    else if (event.button === 0) {
        if (cell.isMarked) return

        cell.isShown = true
        gGame.shownCount++

        if (cell.minesAround === 0) expandShown({ i, j })

        if (cell.isMine) {
            gGame.heartCount--
            changeLostHeart()
            displayNumOfMinesLeft()

            if (gGame.heartCount === 0) {
                defeat()
                return
            }
        }
    }
    renderBoard(gBoard)
    checkGameOver()
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine) continue
            currCell.minesAround = countMinesAround({ i, j })
        }
    }
}

function expandShown(pos) {

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[pos.i].length) continue
            if (pos.i === i && pos.j === j) continue

            const currCell = gBoard[i][j]
            if (currCell.isShown || currCell.marked || currCell.isMine) continue
            currCell.isShown = true
            gGame.shownCount++

            if (currCell.minesAround === 0) expandShown({ i, j })
        }
    }
}

function showCells(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            const currCell = gBoard[i][j]
            if (!currCell.isShown) {
                currCell.isShownTemp = true
                currCell.isShown = true
            }
        }
    }
    renderBoard()
    setTimeout(() => hideCells(pos), 1000)
}

function hideCells(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            const currCell = gBoard[i][j]
            if (currCell.isShownTemp) {
                currCell.isShownTemp = false
                currCell.isShown = false
            }
        }
    }
    renderBoard()
}
