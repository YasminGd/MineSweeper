'use strict'

function setMinesNegsCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            const currCell = board[i][j]
            if (currCell.isMine) continue
            currCell.minesAround = countMinesAround(board, { i, j })
        }
    }
}

function CellClicked(elCell, i, j, event) {
    if (!gGame.isOn && !gFirstTurn) return
    if (gFirstTurn) beginGame({ i, j })

    const cell = gBoard[i][j]
    if (cell.isShown) return

    if (event.button === 2) {
        if (cell.isMarked) {
            gGame.markedCount--
        } else {
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
        if (cell.isMine) {
            gGame.hearts--
            displayHearts()
            displayNumOfMinesLeft()
            if (gGame.hearts === 0) {
                defeat(elCell)
                return
            }
        }
    }
    renderBoard(gBoard)
    checkGameOver()
}