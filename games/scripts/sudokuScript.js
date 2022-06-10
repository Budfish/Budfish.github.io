
let mainGrid = $('#main td');
let valid = true;
let t = 0;
let unsigned = [];
let lattices = [];
let signed = [];
startNewGame();

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

    this.getpartners();
}
