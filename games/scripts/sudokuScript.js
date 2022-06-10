
let mainGrid = $('#main td');

let t = 0;

let unsigned = [];
let lattices = [];
for (let i = 0; i < 81; i++) {
    unsigned.push(i);
    lattices.push(new lattice(i));
}
while (unsigned.length > 0) {
    lattices[unsigned[0]].assignRandom();
    if (t++ > 1000) {
        console.log('overloaded');
        break;
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
        if (t++ > 1000) {
            console.log('overloaded');
            return;
        }
        this.number = num;
        this.signed = true;
        unsigned.splice(unsigned.indexOf(id), 1);
        $(mainGrid[id]).html(num);
        for (let i = 0; i < this.partners.length; i++) {
            let pid = this.partners[i];
            let partner = lattices[pid];
            if (partner.signed)
                continue;
            let spliceIndex = partner.candidates.indexOf(num);
            if (spliceIndex != -1)
                partner.candidates.splice(spliceIndex, 1);
            if (partner.candidates.length == 1)
                partner.assign(partner.candidates[0])
        }
    }
    this.assignRandom = function () {
        let ind = Math.floor(Math.random() * this.candidates.length);
        let num = this.candidates[ind];
        this.assign(num);
    }

    this.getpartners();
}