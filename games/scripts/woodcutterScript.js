const treeRate = [.02, .35, .63]; // 無, 延續, 交換
let treeArray = [0];
let curpos = 1;
resetTreeArray();



let tree1 = new treeObj($('#tree1'));
let tree2 = new treeObj($('#tree2'));
tree1.getCurrent();
tree2.getCurrent();
let char1 = new characterObj($('#char1'), $('#player1Area'));
let char2 = new characterObj($('#char2'), $('#player2Area'));

let turnEnds = false;

$(window).on('keydown', function (event) {
    if (!turnEnds && !char1.isDead && !char2.isDead) {
        if (event.keyCode == 37) {
            char1.moveLeft();
            if (treeArray[tree1.height] == 1) char1.dies();
            else {
                char1.hit();
                tree1.leftHit();
                tree1.height++;
                setTimeout(tree1.getCurrent, 100);
                $('#score1').html(tree1.height);
                if (treeArray[tree1.height] == 1) char1.dies();
            }
        }
        if (event.keyCode == 39) {
            char1.moveRight();
            if (treeArray[tree1.height] == 2) char1.dies();
            else {
                char1.hit();
                tree1.rightHit();
                tree1.height++;
                setTimeout(tree1.getCurrent, 100);
                $('#score1').html(tree1.height);
                if (treeArray[tree1.height] == 2) char1.dies();
            }
        }

        if (event.keyCode == 65) {
            char2.moveLeft();
            if (treeArray[tree2.height] == 1) char2.dies();
            else {
                char2.hit();
                tree2.leftHit();
                tree2.height++;
                setTimeout(tree2.getCurrent, 100);
                $('#score2').html(tree2.height);
                if (treeArray[tree2.height] == 1) char2.dies();
            }
        }
        if (event.keyCode == 68) {
            char2.moveRight();
            if (treeArray[tree2.height] == 2) char2.dies();
            else {
                char2.hit();
                tree2.rightHit();
                tree2.height++;
                setTimeout(tree2.getCurrent, 100);
                $('#score2').html(tree2.height);
                if (treeArray[tree2.height] == 2) char2.dies();
            }
        }


        if (char1.isDead || char2.isDead) {
            turnEnds = true;
            if (char1.isDead) char2.getPoint();
            else char1.getPoint();

        } else {
            let diff = tree1.height - tree2.height;
            //console.log(diff);
            if (diff >= 20) {
                turnEnds = true;
                char1.getPoint();
            } else if (diff <= -20) {
                turnEnds = true;
                char2.getPoint();
            }
        }
        if (turnEnds) {
            if (char1.points >= 3) {
                setTimeout(() => {
                    $('#theMessage').html(`<span style="color:blue">Player1</span> wins!`);
                    gameOver();
                }, 1200);
                return;
            } else if (char2.points >= 3) {
                setTimeout(() => {
                    $('#theMessage').html(`<span style="color:red">Player2</span> wins!`);
                    gameOver();
                }, 1200);
                return;
            }

            setTimeout(restartTurn, 1500);
        }
    }
});

$('#playAgain').on('click', function () {
    gameStart();
});

function gameStart() {
    $('#playAgainBox').addClass('hide');
    $('#theMessage').removeClass('winning');
    char1.clearPoints();
    char2.clearPoints();
    restartTurn();
}
function gameOver() {
    $('#theMessage').removeClass('hide');
    $('#theMessage').addClass('winning');
    $('#playAgainBox').removeClass('hide');
}

function getStart() {
    turnEnds = false;
    char1.isDead = false;
    char2.isDead = false;
}
function resetStatus() {
    resetTreeArray();
    tree1.height = 0;
    tree2.height = 0;
    tree1.getCurrent();
    tree2.getCurrent();
    char1.htmlElm.removeClass('dead');
    char2.htmlElm.removeClass('dead');
    char1.moveLeft();
    char2.moveLeft();
    $('#score1').html(0);
    $('#score2').html(0);
}
function resetTreeArray() {
    treeArray = [0];
    for (let i = 0; i < 2000; i++) {
        if (i % 2 == 0) {
            treeArray.push(0);
        } else {
            let seed = Math.random();
            if (seed < treeRate[0]) {
                treeArray.push(0);
            } else if (seed < treeRate[0] + treeRate[1]) {
                treeArray.push(curpos);
            } else {
                curpos = curpos == 1 ? 2 : 1;
                treeArray.push(curpos);
            }
        }
    }
}
let countDownMsg = ['3', '2', '1', 'Start!', ''];
let countDownInd = 0;
function restartTurn() {
    $('#theMessage').removeClass('hide');
    if (countDownInd < 5) {
        $('#theMessage').removeClass('shrink');
        $('#theMessage').html(countDownMsg[countDownInd]);
        setTimeout(() => {
            $('#theMessage').addClass('shrink');
        }, 100);

        if (countDownInd == 0) {
            resetStatus();
        }
        if (countDownInd == 4) {
            getStart();
        }
        setTimeout(restartTurn, 1000);
        countDownInd++;

    } else {
        $('#theMessage').addClass('hide');
        countDownInd = 0;
    }
}


function characterObj(char, playerArea) {
    let thisChar = this;
    this.points = 0;
    this.htmlElm = char;
    this.area = playerArea;
    this.hit = function () {
        setTimeout(function () {
            $(char.children('.axPosition')).addClass('hit');
            setTimeout(() => {
                $(char.children('.axPosition')).removeClass('hit');
            }, 100);
        }, 50);
    }
    this.moveLeft = function () {
        char.addClass('left');
        $(playerArea.find('.standArea.left')).append(char);
    }
    this.moveRight = function () {
        char.removeClass('left');
        $(playerArea.find('.standArea.right')).append(char);
    }
    this.isDead = false;
    this.dies = function () {
        thisChar.isDead = true;
        char.addClass('dead');
    }
    this.lights = $($(playerArea.find('.wins')[0]).children());
    this.getPoint = function () {
        //console.log(thisChar.lights)
        $(thisChar.lights[thisChar.points]).addClass('win');
        thisChar.points++;
    }
    this.clearPoints = function () {
        thisChar.points = 0;
        $.each(thisChar.lights, function (ind, elm) {
            $(elm).removeClass('win');
        });
    }
}


function treeObj(tree) {
    let thisTree = this;
    this.htmlElm = tree;
    this.height = 0;
    this.getCurrent = function () {
        //console.log(thisTree);
        tree.html("");
        for (let i = 4; i >= 0; i--) {
            switch (treeArray[thisTree.height + i]) {
                case 0:
                    tree.append('<div class="block "></div>');
                    break;
                case 1:
                    tree.append('<div class="block left"></div>');
                    break;
                case 2:
                    tree.append('<div class="block right"></div>');
                    break;

            }
        }
    }
    this.leftHit = function () {
        $(tree.children()[4]).addClass('leftcut');
    }
    this.rightHit = function () {
        $(tree.children()[4]).addClass('rightcut');
    }
}