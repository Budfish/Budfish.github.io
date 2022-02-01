const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const screenMargin = 25;
const fieldWidth = screenWidth - screenMargin * 2;
const fieldHeight = screenHeight - screenMargin * 2;
const ballDiameter = 50;
const ballRadius = ballDiameter / 2;
const ballClickSide = 150;
const ballDelta = (ballClickSide - ballDiameter) / 2;

let ball = new ballObj($('#ball'));

$('body').css({
    'padding': screenMargin,
})
$('#container').css({
    'width': fieldWidth,
    'height': fieldHeight,
});
$('#ball').css({
    'width': ballDiameter,
    'height': ballDiameter,
    'left': (screenWidth - ballDiameter) / 2,
    'top': 3 * (screenHeight - ballDiameter) / 4,

});
$('#ballClicker').css({
    'width': ballClickSide,
    'height': ballClickSide,
    'transform': `translate(${-ballDelta}px,${-ballDelta}px)`,
});



$(window).on('click', function (event) {
});



$('#ballClicker').click(function (event) {
    let bcx = ball.centerX();
    let bcy = ball.centerY();
    let xlb = ballClickSide / 2;
    let xub = screenWidth - screenMargin - ballClickSide / 2;
    let ylb = ballClickSide / 2;
    let yub = screenHeight - screenMargin - ballClickSide / 2;
    if (xlb < bcx && bcx < xub && ylb < bcy && bcx < yub) {
        console.log(ball.nextPath);
        clearTimeout(ball.nextPath);

        console.log(`click at (${event.clientX},${event.clientY})`);
        console.log(`center: (${bcx},${bcy})`);

        ball.redirect(event);
        console.log(`direction: (${ball.directionX},${ball.directionY})`);
        ball.bouncePosition.get();

        ball.goto(ball.bouncePosition.x, ball.bouncePosition.y);
        console.log(`bouncePosition: (${ball.bouncePosition.x},${ball.bouncePosition.y})`);
    }
});
$(window).dblclick(function (event) {
    event.preventDefault();
    return false;
});


function ballObj(ball) {
    let thisBall = this;
    this.jq = ball;
    this.speed = 300;
    this.directionX = -1;
    this.directionY = -1;
    this.centerX = () => parseInt(ball.css('left')) + ballRadius;
    this.centerY = () => parseInt(ball.css('top')) + ballRadius;
    this.bouncePosition = new bouncePositionObj();
    this.nextPath = null;
    this.goto = function (x, y) {
        //框內座標系
        clearTimeout(thisBall.nextPath);
        let delaX = thisBall.centerX() - x;
        let delaY = thisBall.centerY() - y;
        let distance = Math.sqrt(delaX * delaX + delaY * delaY);
        let duration = 1000 * distance / thisBall.speed;
        $('#ball').css({
            'left': x,
            'top': y,
            'transition-duration': `${duration}ms`,
        });

        thisBall.nextPath = setTimeout(function () {
            thisBall.directionX *= thisBall.bouncePosition.reflectX ? -1 : 1;
            thisBall.directionY *= thisBall.bouncePosition.reflectY ? -1 : 1;
            thisBall.bouncePosition.get();

            thisBall.goto(thisBall.bouncePosition.x, thisBall.bouncePosition.y);
        }, duration);

        console.log(`direction:(${thisBall.directionX}, ${thisBall.directionY})`);
        console.log(`position:(${thisBall.bouncePosition.x}, ${thisBall.bouncePosition.y})`);

    }
    this.redirect = e => {
        thisBall.directionX = thisBall.centerX() + screenMargin - parseInt(e.clientX);
        thisBall.directionY = thisBall.centerY() + screenMargin - parseInt(e.clientY);
    }


    function bouncePositionObj() {
        let thisbcp = this;
        this.x = 0;
        this.y = 0;
        this.reflectX = false;
        this.reflectY = false;
        this.get = function () {
            let bcx = 0;
            let bcy = 0;
            let x = 0;
            let y = 0;

            if (thisBall.directionX < 0) x = ballRadius;
            if (thisBall.directionX >= 0) x = fieldWidth - ballRadius;
            if (thisBall.directionY < 0) y = ballRadius;
            if (thisBall.directionY >= 0) y = fieldHeight - ballRadius;

            bcy = thisBall.centerY() + thisBall.directionY * (x - thisBall.centerX()) / thisBall.directionX;
            bcx = thisBall.centerX() + thisBall.directionX * (y - thisBall.centerY()) / thisBall.directionY;

            if (thisBall.directionX < 0) bcx = bcx < x ? x : bcx;
            if (thisBall.directionX >= 0) bcx = bcx > x ? x : bcx;
            if (thisBall.directionY < 0) bcy = bcy < y ? y : bcy;
            if (thisBall.directionY >= 0) bcy = bcy > y ? y : bcy;

            thisbcp.reflectX = bcx == x ? true : false;
            thisbcp.reflectY = bcy == y ? true : false;

            thisbcp.x = bcx;
            thisbcp.y = bcy;
        }
    }
}

