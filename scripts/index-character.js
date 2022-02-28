const characterConst = {
    width: 55,
    height: 40,
    height_squ: 33,
    lattice_x: 55,
    lattice_y: 30,
    lattice_x_margin: 5,
    lattice_y_margin: 5,

};

function ObjCharacter() {
    let character = this;

    this.html = $('#character');
    this.x = 5;
    this.y = 1;
    this.move = function (direction) {
        if (move_ing) return;
        if (move_bc) clearTimeout(move_bc);
        move_ing = true;

        switch (direction) {
            case 'l':
                character.x = character.x - 1 < 0 ? 0 : character.x - 1;
                break;
            case 'r':
                character.x = character.x + 1 > 10 ? 10 : character.x + 1;
                break;
            case 'u':
                character.y = character.y + 1 > 10 ? 10 : character.y + 1;
                break;
            case 'd':
                character.y = character.y - 1 < 0 ? 0 : character.y - 1;
                break;
        }

        $('#character').css({
            'height': characterConst.height_squ,
            'left': character.x * characterConst.lattice_x + characterConst.lattice_x_margin,
            'bottom': character.y * characterConst.lattice_y + characterConst.lattice_y_margin,
            'z-index': 10 - character.y,
        });
        move_bc = setTimeout(bounceoff, 300);
        setTimeout(() => { move_ing = false; }, 500);
        function bounceoff() {
            $('#character').css('height', characterConst.height);
        }
    }
    let move_bc = null;
    let move_ing = false;
}