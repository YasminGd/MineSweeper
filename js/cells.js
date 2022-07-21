'use strict'

function CellClicked(i, j, event) {
    if (!gGame.isOn) return
    if (gFirstTurn) beginGame({ i, j })

    const cell = gBoard[i][j]
    if (cell.isShown) return

    if (event.button === 2) {
        if (cell.isMarked) gGame.markedCount--
        else gGame.markedCount++

        cell.isMarked = !cell.isMarked
        displayNumOfMinesLeft()
    }
    else if (event.button === 0) {
        if (cell.isMarked) return

        cell.isShown = true
        gGame.shownCount++

        if (cell.minesAround === 0) expandShown({ i, j })
        if (cell.isMine) {
            gGame.hearts--
            displayHearts()
            displayNumOfMinesLeft()

            if (gGame.hearts === 0) {
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