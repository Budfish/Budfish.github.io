
let mainGrid = $('#main td');
let board = getBoard();
console.log(board)

$.each(mainGrid, (ind, elm) => {
    $(elm).html(board[(ind / 9 | 0) + 1][ind % 9 + 1]);
})

async function getBoard() {
    function emprow() {
        let res = [];
        for (let i = 0; i <= 9; i++)res.push(false);
        return res;
    }
    let board = [];
    let row = [];
    for (let i = 0; i <= 9; i++)board.push([]);
    for (let i = 0; i <= 9; i++)board[i].push(0);
    for (let i = 0; i <= 9; i++)row.push(emprow());
    for (let num = 1; num <= 9; num++) {
        //console.log(`num=${num}`)
        let block;
        let col = emprow();
        for (let r = 1; r <= 9; r++) {
            if (r % 3 == 1) block = emprow();
            let cand = [];
            for (let n = 1; n <= 9; n++) {
                if (!row[r][n] && !col[n] && !block[n]) cand.push(n);
            }
            let ind = Math.floor(Math.random() * cand.length);
            let pos = cand[ind];
            //console.log(`pos=${pos}, cand:${cand}`)
            board[r][pos] = num;
            row[r][pos] = true;
            col[pos] = true;
            for (let j = 1; j <= 3; j++) {
                block[((pos - 1) / 3 | 0) * 3 + j] = true;
            }
            $(mainGrid[(r - 1) * 9 + pos - 1]).html(num);
            await new Promise(r => setTimeout(r, 50));
        }
    }
    return board;
}