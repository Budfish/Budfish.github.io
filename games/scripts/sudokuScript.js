
// init parameters and functions
let mainGrid = $('#main td');
let numberSet = $('#numberSet span')
let valid = true;
let t = 0;
let unsigned = [];
let lattices = [];
let signed = [];
let chosenId = -1;
let c = 0;
function startNewGame() {
    valid = true;
    t = 0;
    unsigned = [];
    lattices = [];
    signed = [];
    for (let i = 0; i < 81; i++) {
        unsigned.push(i);
        lattices.push(new lattice(i));
    }
    while (unsigned.length > 0) {
        if (!valid) break;
        lattices[unsigned[0]].assignRandom();
        if (t++ > 1000) {
            console.log('overloaded');
            break;
        }
    }
    if (!valid) {
        console.log('false');
        startNewGame();
    }
}
function lattice(id) {
    this.id = id;
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
        if (!valid) return;
        if (t++ > 1000) {
            console.log('overloaded');
            return;
        }
        this.number = num;
        this.signed = true;
        unsigned.splice(unsigned.indexOf(id), 1);
        $(mainGrid[id]).html(num);
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
                        valid = false;
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
        return;
    }
    chosenId = id;
    if (chosenId != -1)
        $(mainGrid[chosenId]).addClass('active');
}
let traceIndex = 0;
$(window).on('keydown', function (event) {
    if (event.keyCode == 37) {
        if (traceIndex <= 0) return;
        $(signed[--traceIndex]).css({ 'background-color': 'transparent' });
    }
    if (event.keyCode == 39) {
        if (traceIndex > 80) return;
        $(signed[traceIndex++]).css({ 'background-color': 'yellow' });
    }
});
$(window).on('click', function (event) {
    changeChosenId(-1);
})

// init work
startNewGame();

$.each(mainGrid, (ind, val) => {
    $(val).click(e => {
        changeChosenId(ind);
        console.log(`id:${lattices[ind].id}, \ncandidates:${lattices[ind].candidates}, \npartners:${lattices[ind].partners}`)
        return false;
    })
})
$.each(numberSet, (ind, val) => {
    $(val).click(e => {
        if (chosenId == -1) return;
        lattices[chosenId].setNumber(ind + 1);
    })
})