function throwDice() {
    // cubesSound.play()
    $('.throw-cube').css('display', 'none')
    $('.cube').css('animation-name', 'spin')
    $('.cube').css('animation-duration', '0.1s')
    $('.cube').css('animation-iteration-count', '10')
    // $('#cube-section').css('animation-name', 'flicker')
    // $('#cube-section').css('animation-duration', '0.1s')
    // $('#cube-section').css('animation-iteration-count', '10')
    gNum1 = Math.round(Math.random() * 5 + 1);
    gNum2 = Math.round(Math.random() * 5 + 1);
    if (gNum1 > gNum2) {
        var num3 = gNum2;
        gNum2 = gNum1;
        gNum1 = num3;
    }

    gSum = gNum1 + gNum2;

    if (gNum1 !== gNum2) {
        gIsDouble = false;
        gDoubleCount = 0;
    } else {
        gIsDouble = true
        gDoubleCount = 4
        gSum *= 2
    }
    setTimeout(function () {

        // for testing Double stuff make num1 === num2
        // gNum2 = gNum1
        displayDiceDots('.cube1',gNum1)
        displayDiceDots('.cube2',gNum2)

        $('.cube').css('animation-name', 'none')
        $('.cube').css('animation-duration', 'none')
        $('.cube').css('animation-iteration-count', 'none')
        // $('.cube-section').css('animation-name', 'none')
        // $('.cube-section').css('animation-duration', 'none')
        // $('.cube-section').css('animation-iteration-count', 'none')

        
        // if (isAllNull(gPossibleMoves)) {
        //     setTimeout(function(){
        //         beepSound.play()
        //         endTurn()
        //         cleanBoard()
        //         renderBoard()

        //     },1000)
        // }
        // fillCubeText()
    }, 1000)
}

function displayDiceDots(dice,num) {
    switch (num) {
        case 1:
            display(`${dice} .dot7`)
            notDisplay(`${dice} .dot1`)
            notDisplay(`${dice} .dot2`)
            notDisplay(`${dice} .dot3`)
            notDisplay(`${dice} .dot4`)
            notDisplay(`${dice} .dot5`)
            notDisplay(`${dice} .dot6`)
            break;
            case 2:
            notDisplay(`${dice} .dot7`)
            display(`${dice} .dot1`)
            notDisplay(`${dice} .dot2`)
            notDisplay(`${dice} .dot3`)
            notDisplay(`${dice} .dot4`)
            notDisplay(`${dice} .dot5`)
            display(`${dice} .dot6`)
            break;
            case 3:
            display(`${dice} .dot7`)
            display(`${dice} .dot1`)
            notDisplay(`${dice} .dot2`)
            notDisplay(`${dice} .dot3`)
            notDisplay(`${dice} .dot4`)
            notDisplay(`${dice} .dot5`)
            display(`${dice} .dot6`)
            break;
            case 4:
            notDisplay(`${dice} .dot7`)
            display(`${dice} .dot1`)
            notDisplay(`${dice} .dot2`)
            display(`${dice} .dot3`)
            display(`${dice} .dot4`)
            notDisplay(`${dice} .dot5`)
            display(`${dice} .dot6`)
            break;
            case 5:
            display(`${dice} .dot7`)
            display(`${dice} .dot1`)
            notDisplay(`${dice} .dot2`)
            display(`${dice} .dot3`)
            display(`${dice} .dot4`)
            notDisplay(`${dice} .dot5`)
            display(`${dice} .dot6`)
            break;
            case 6:
            notDisplay(`${dice} .dot7`)
            display(`${dice} .dot1`)
            display(`${dice} .dot2`)
            display(`${dice} .dot3`)
            display(`${dice} .dot4`)
            display(`${dice} .dot5`)
            display(`${dice} .dot6`)
    }
}
    

//these functions show or remove the dots from the cubes
function display(el) {
    $(el).css('visibility', 'visible')
}
function notDisplay(el) {
    $(el).css('visibility', 'hidden')
}
