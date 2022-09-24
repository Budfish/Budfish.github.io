
const Container = $("#container");
const lattices = $("#playtable td");
const playerEnum = { 0: "blackPlayer", 1: "whitePlayer" };

let player = 0;

$($("#showtable td")[105]).html(`<div class="chess" style="width:30%;height:30%;background-color:black;position:absolute;top:-15%;left:-15%;"></div>`)
$.each(lattices, (ind, val) => {
    $(val).click(e => {
        if ($(val).html() != "") return;
        $(val).html(`<div class="chess ${playerEnum[player]}"></div>`);
        player = (player + 1) % 2;
    })
})