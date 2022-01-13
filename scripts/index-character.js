function ObjCharacter() {
    let character = this;

    this.html = $('#character');
    this.x = 0;
    this.y = 0;
    this.move = function (direction) {
        if (move_ing) return;
        if (move_bc) clearTimeout(move_bc);
        move_ing = true;
        switch (direction) {
            case 'l':
                character.x--;
                break;
            case 'r':
                character.x++;
                break;
            case 'u':
                character.y++;
                break;
            case 'd':
                character.y--;
                break;
        }

        $('#character').css({
            'height': 33,
            'left': character.x * 55,
            'bottom': character.y * 30,
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