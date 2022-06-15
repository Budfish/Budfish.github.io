const difficultClues = [40, 30, 26, 22];

// init parameters and functions
let mainGrid = $('#mainTable td');
let numberSet = $('#numberSet span');
let functionSet = {
    'erase': $('#erase'),
    'reset': $('#reset'),
    'note': $('#note'),
    'hint': $('#hint'),
}
let difficultyList = $('#difficultyList .difficultyButton');
let validBoard = true;
let t = 0;
let lattices = [];
let unsigned = [];
let signed = [];
let clues = [];
let chosenId = -1;
let hintOn = false;
function startGame(difficulty) {
    resetBoard();
    generateSolution();
    setupClues(difficulty);
}
function resetBoard() {
    $.each(mainGrid, (ind, td) => {
        chosenId = -1;
        $(td).removeClass('active invalid clue').html('');
    })
}
function generateSolution() {
    validBoard = true;
    t = 0;
    unsigned = [];
    lattices = [];
    signed = [];
    for (let i = 0; i < 81; i++) {
        unsigned.push(i);
        lattices.push(new lattice(i));
    }
    while (unsigned.length > 0) {
        if (!validBoard) break;
        lattices[unsigned[0]].assignRandom();
        if (t++ > 1000) {
            alert('瀏覽器超載，請重新整理頁面。');
            break;
        }
    }
    if (!validBoard) {
        console.log('false');
        generateSolution();
    }
}
function lattice(id) {
    this.id = id;
    this.gametype = 0; // 0 for puzzle, 1 for clue
    this.signed = false;
    this.number = 0;
    this.candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9,];
    this.partners = [];
    this.getpartners = function () {
        this.partners = [];
        let rowhead = (id / 9 | 0) * 9;
        let colhead = id % 9;
        let blkhead = ((rowhead / 9) / 3 | 0) * 27 + (colhead / 3 | 0) * 3;
        for (let i = 0; i < 9; i++) {
            let rowelm = rowhead + i;
            let colelm = colhead + i * 9;
            let blkelm = blkhead + (i / 3 | 0) * 9 + (i % 3);
            if (this.partners.indexOf(rowelm) == -1) this.partners.push(rowelm);
            if (this.partners.indexOf(colelm) == -1) this.partners.push(colelm);
            if (this.partners.indexOf(blkelm) == -1) this.partners.push(blkelm);
        }
    }
    this.assign = function (num) {
        if (!validBoard) return;
        if (t++ > 1000) {
            console.log('overloaded');
            return;
        }
        this.number = num;
        this.signed = true;
        unsigned.splice(unsigned.indexOf(id), 1);
        //$(mainGrid[id]).html(num);
        signed.push(mainGrid[id]);
        for (let i = 0; i < this.partners.length; i++) {
            let pid = this.partners[i];
            let partner = lattices[pid];
            if (partner.signed)
                continue;
            let spliceIndex = partner.candidates.indexOf(num);
            if (spliceIndex != -1)
                partner.candidates.splice(spliceIndex, 1);
            if (partner.candidates.length == 1) {
                let pnum = partner.candidates[0];
                $.each(partner.partners, (ind, ppid) => {
                    let pp = lattices[ppid];
                    if (pp.number == pnum)
                        validBoard = false;
                })
                partner.assign(pnum);
            }
        }
    }
    this.assignRandom = function () {
        let ind = Math.floor(Math.random() * this.candidates.length);
        let num = this.candidates[ind];
        this.assign(num);
    }
    this.setNumber = function (num) {
        this.number = num;
        if (num == 0) {
            $(mainGrid[id]).html('');
        } else {
            $(mainGrid[id]).html(num);
        }
        this.validate();
        $.each(this.partners, (ind, pid) => {
            lattices[pid].validate();
        })
    }
    this.validate = function () {
        let invalid = false;
        $.each(this.partners, (ind, pid) => {
            if (!invalid && pid != id) {
                partner = lattices[pid];
                if (partner.number == this.number) {
                    invalid = true;
                }
            }
        })
        if (invalid) {
            $(mainGrid[id]).addClass(`invalid`);
        } else {
            $(mainGrid[id]).removeClass('invalid');
        }
    }
    this.getpartners();
}
function changeChosenId(id) {
    if (chosenId != -1)
        $(mainGrid[chosenId]).removeClass('active');
    if (id == chosenId) {
        chosenId = -1;
    } else {
        chosenId = id;
        if (chosenId != -1)
            $(mainGrid[chosenId]).addClass('active');
    }
    if (hintOn) showPartners(chosenId);
}
function getRandomIds(count) {
    let allIds = [];
    let res = [];
    for (let i = 0; i < 81; i++)
        allIds.push(i);
    for (let i = 0; i < count; i++) {
        let ind = Math.random() * allIds.length | 0;
        res.push(allIds[ind]);
        allIds.splice(ind, 1);
    }
    return res;
}
function setupClues(difficulty) {
    clues = getRandomIds(difficultClues[difficulty]);
    for (let id = 0; id < 81; id++) {
        if (clues.indexOf(id) == -1) {
            // it is a filling box
            lattices[id].number = 0;
            $(mainGrid[id]).addClass('puzzle').html('');
        } else {
            // it is a clue
            lattices[id].gametype = 1;
            $(mainGrid[id]).addClass('clue').html(lattices[id].number);
        }
    }
}
function removeShowings() {
    $.each($('.onShowing'), (_, td) => {
        $(td).removeClass('onShowing');
    })
}
function showPartners(id) {
    removeShowings();
    if (id != -1) {
        $.each(lattices[id].partners, (_, pid) => {
            $(mainGrid[pid]).addClass('onShowing');
        })
    }
}
function finished() {
    changeChosenId(-1);
    $('#finishCover').addClass('active');
    setTimeout(() => {
        $('#finishImg').addClass('active');
    }, 100);

}

//for traceing
/* let traceIndex = 0;
$(window).on('keydown', function (event) {
    if (event.keyCode == 37) {
        if (traceIndex <= 0) return;
        $(signed[--traceIndex]).css({ 'background-color': 'transparent' });
    }
    if (event.keyCode == 39) {
        if (traceIndex > 80) return;
        $(signed[traceIndex++]).css({ 'background-color': 'yellow' });
    }
}); */

// click function registration
$(window).click(e => {
    changeChosenId(-1);
})
$('#cover').click(e => {
    return false;
})
$.each(difficultyList, (ind, diff) => {
    $(diff).click(e => {
        startGame(ind);
        $('#difficultyList').addClass('hide');
        $('#cover').addClass('hide');
        setTimeout(() => {
            $('#cover').css({ 'display': 'none' });
        }, 300)
    })
})
$.each(mainGrid, (ind, val) => {
    $(val).click(e => {
        changeChosenId(ind);
        return false;
    })
})
$.each(numberSet, (ind, val) => {
    $(val).click(e => {
        if (chosenId == -1) return;
        if (clues.indexOf(chosenId) == -1)
            lattices[chosenId].setNumber(ind + 1);
        return false;
    })
})
$(functionSet['erase']).click(e => {
    if (chosenId == -1) return;
    if (clues.indexOf(chosenId) == -1) {
        $(mainGrid[chosenId]).html('');
        lattices[chosenId].setNumber(0);
    }
    return false;
})
$(functionSet['hint']).click(e => {
    hintOn = !hintOn;
    $('#hint i').toggleClass('fa-solid fa-regular color-on');
    if (!hintOn) removeShowings();
    if (chosenId != -1 && hintOn) showPartners(chosenId);
    return false;
})
