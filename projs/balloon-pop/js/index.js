
// The Model
var gBalloons
var gIntervalFloat;

// init();

function init() {
    gBalloons = createBalloons(5);
    renderBalloons();
    floatBalloons()
}


function createBalloons(balloonsCount) {
    var balloons = [];

    for (var i = 0; i < balloonsCount; i++) {
        balloons.push({bottom: 10, speed: getRandomInt(10, 20)})
    }
    return balloons;

}

function renderBalloons() {

    var strHTML = '';
    for (var i = 0; i < gBalloons.length; i++) {
        // '<div class="balloon balloon'+(i+1)+'" onclick="balloonClick(this)" onmouseover="speedUp('+i+')"></div>'
        strHTML +=
            `<div class="balloon balloon${i + 1}" 
                  onclick="balloonClick(this)" 
                  onmouseover="speedUp(${i})"
                  style="left:${(i + 1) * 50}px;background-color:${getRandomColor()}">
             </div>`

    }


    document.querySelector('.sky').innerHTML = strHTML

}


function floatBalloons() {
    gIntervalFloat = setInterval(floatUp, 200)
}

function floatUp() {
    console.log('float Up')
    var elBalloons = document.querySelectorAll('.balloon');
    for (var i = 0; i < elBalloons.length; i++) {
        var currBalloon = gBalloons[i];
        // update model
        currBalloon.bottom += currBalloon.speed

        // update dom
        var elBalloon = elBalloons[i];
        elBalloon.style.bottom = currBalloon.bottom + 'px';


        if (currBalloon.bottom >= 600) {
            clearInterval(gIntervalFloat);
        }
    }
}

function speedUp(balloonIdx) {
    console.log('Balloon Speed!');
    gBalloons[balloonIdx].speed += 10;
}

function balloonClick(elBalloon) {
    console.log(elBalloon)
    elBalloon.style.opacity = 0;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }