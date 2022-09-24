
const Container = $("#container");
const lattices = $("#playtable td");
const playerEnum = { 0: "blackPlayer", 1: "whitePlayer" };
const boardMax = 15 * 15;
const directionNumber = [1, 16, 15, 14];

let player = 0;
let boardStatue = [];

function Init() {
    player = 0;
    boardStatue = [];
    for (let i = 0; i < boardMax; i++) boardStatue.push(-1);
    $.each(lattices, (ind, val) => {
        $(val).html("");
    })
}
function GetDirectionCount(ind, dir) {
    let dirnum = directionNumber[dir];
    let count = 1;
    let curr = -1;

    curr = ind;
    while (curr + dirnum < boardMax) {
        curr += dirnum;
        if (boardStatue[curr] != player) break;
        count++;
    }
    curr = ind;
    while (curr - dirnum >= 0) {
        curr -= dirnum;
        if (boardStatue[curr] != player) break;
        count++;
    }
    return count;
}
function ValidateWin(ind) {
    for (let i = 0; i < 4; i++)
        if (GetDirectionCount(ind, i) >= 5) return true;
    return false;
}


Init();
$($("#showtable td")[105]).html(`<div class="chess" style="width:30%;height:30%;background-color:black;position:absolute;top:-15%;left:-15%;"></div>`)
$("#cover").click(e => {
    $(e.target).removeClass("activate");
    Init();
})
$.each(lattices, (ind, val) => {
    $(val).click(e => {
        if ($(val).html() != "") return;
        $(val).html(`<div class="chess ${playerEnum[player]}"></div>`);
        boardStatue[ind] = player;
        if (ValidateWin(ind))
            $("#cover").addClass("activate");
        player = (player + 1) % 2;
    })
})

