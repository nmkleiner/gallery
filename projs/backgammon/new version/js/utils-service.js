'use strict;'

function getSoldierById(soldierId) {
    var reqSoldier
    gBoard.forEach(function(cell) {
        cell.soldiers.forEach(function(soldier) {
            if (soldier.id === soldierId)  reqSoldier = soldier;
        })
    })

    return reqSoldier
}

function getId() {
    gNextId++
    return gNextId
}

function getAllSoldiers() {
    var soldiers = []
    for (var i = 0; i < gBoard.length; i++) {
        var cell = gBoard[i]
        for (var j = 0; j < cell.soldiers.length; j++) {
            var soldier = cell.soldiers[j]
            soldiers.push(soldier)
        }
    }
    return soldiers
}

function isDouble() {
    return (gNum1 === gNum2 && gNum1 !== null)
}