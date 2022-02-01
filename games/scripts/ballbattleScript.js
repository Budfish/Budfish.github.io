const windowMargin = 25;
const ballRadius = 25;
const fieldWidth = window.innerWidth - windowMargin * 2;
const fieldHeight = window.innerHeight - windowMargin * 2;
const locatedWidth = fieldWidth - ballRadius * 2;
const locatedHeight = fieldHeight - ballRadius * 2;
const maxSpeed = 800;//800
const initSpeed = 300;//300
const speedSetp = 10;
const minLocatedX = 0;
const maxLocatedX = locatedWidth;
const minLocatedY = -5;
const maxLocatedY = locatedHeight - 5;
let redWins = false;
let blueWins = false;

const ball = new ballObj($('#locator'));

$('body').css({
    padding: windowMargin,
});
$('#field').css({
    width: fieldWidth,
    height: fieldHeight,
    padding: ballRadius,
});
$('#locatedField').css({
    width: locatedWidth,
    height: locatedHeight
});
$('#locator').css({
    left: locatedWidth * 0.5,
    top: locatedHeight * 0.75,
});
$(window).dblclick(function (event) {
    event.preventDefault();
    return false;
});

$('#touchRegion').on('click', function (event) {
    if (!redWins && !blueWins) {
        clearTimeout(ball.nextPath);
        let [x, y] = coordinate(event);
        ball.directionX = ball.getX() - x;
        ball.directionY = ball.getY() - y;
        //console.log(`direction(${ball.directionX},${ball.directionY})`);
        let pos = ball.collisionPosition();
        ball.reflectX = false;
        ball.reflectY = false;
        ball.autoGo(pos);
    }
});


function ballObj(locator_jq) {
    let thisball = this;
    this.location = locator_jq;
    this.touchRegion = $(locator_jq.find('#touchRegion'))[0];
    this.getX = () => parseInt(locator_jq.css('left'));
    this.getY = () => parseInt(locator_jq.css('top'));
    this.speed = initSpeed;
    this.duration = 1000;
    this.directionX = 1;
    this.directionY = 1;
    this.reflectX = false;
    this.reflectY = false;
    this.nextPath = null;
    this.goto = function ([x, y]) {
        clearTimeout(thisball.nextPath);
        let centerX = thisball.getX();
        let centerY = thisball.getY();
        let Dx = x - centerX;
        let Dy = y - centerY;
        let distance = Math.sqrt(Dx * Dx + Dy * Dy);
        thisball.duration = 1000 * distance / thisball.speed;
        thisball.location.css({
            'left': x,
            'top': y,
            'transition-duration': `${thisball.duration}ms`,
        })
    }
    this.collisionPosition = function () {
        let x = minLocatedX;
        let y = minLocatedY;
        let ballX = thisball.getX();
        let ballY = thisball.getY();
        let dirX = thisball.directionX;
        let dirY = thisball.directionY;
        let calcX = minLocatedX;
        let calcY = minLocatedY;
        if (dirX >= 1 || dirX <= -1) {
            x = dirX > minLocatedX ? maxLocatedX : minLocatedX;
            calcY = (x - ballX) * dirY / dirX + ballY;
            calcY = calcY < minLocatedY ? minLocatedY : calcY > maxLocatedY ? maxLocatedY : calcY;
        } else {
            calcX = ballX;
            calcY = dirY < minLocatedY ? minLocatedY : maxLocatedY;
        }
        if (dirY >= 1 || dirY <= -1) {
            y = dirY > minLocatedY ? maxLocatedY : minLocatedY;
            calcX = (y - ballY) * dirX / dirY + ballX;
            calcX = calcX < minLocatedX ? minLocatedX : calcX > maxLocatedX ? maxLocatedX : calcX;
        } else {
            calcX = dirX < minLocatedX ? minLocatedX : maxLocatedX;
            calcY = dirY;
        }
        thisball.reflectX = false;
        thisball.reflectY = false;
        if (calcX == minLocatedX || calcX == maxLocatedX) thisball.reflectX = true;
        if (calcY == minLocatedY || calcY == maxLocatedY) thisball.reflectY = true;

        return [calcX, calcY];
    }
    this.autoGo = function () {
        //console.log('autoGO');
        thisball.speed = thisball.speed < maxSpeed - speedSetp ? thisball.speed + speedSetp : maxSpeed;
        thisball.directionX *= thisball.reflectX ? -1 : 1;
        thisball.directionY *= thisball.reflectY ? -1 : 1;
        thisball.goto(thisball.collisionPosition());
        thisball.nextPath = setTimeout(function () {
            varifyEnd();
            if (!redWins && !blueWins)
                thisball.autoGo();
        }, thisball.duration);
    }

}
function varifyEnd() {
    if (ball.getY() < minLocatedY + 5) redWins = true;
    if (ball.getY() > maxLocatedY - 5) blueWins = true;
    if (redWins || blueWins) {
        clearTimeout(ball.nextPath);
        ball.location.css({
            left: ball.getX(),
            top: ball.getY(),
        })
    }
}
function coordinate(event) {
    let bias = (windowMargin + ballRadius);
    let x = parseInt(event.clientX);
    let y = parseInt(event.clientY);
    return [x - bias, y - bias];
}