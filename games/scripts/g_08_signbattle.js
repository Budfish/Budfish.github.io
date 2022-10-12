const container = $('#container');
const signLetters = ['A', 'B', 'C'];
const attackTable = { 'A': 'B', 'B': 'C', 'C': 'A' };
const avoidTable = { 'A': 'C', 'B': 'A', 'C': 'B' };
const W = window.innerWidth;
const H = window.innerHeight;
const moveSpeed = 1.15;
const noise = 1;
const num = 12;
const size = 32;
const attackRatio = 1.2;
const avoidRatio = 0.9;
const changeTargetPeriod = 5;
let turn = 0;

function SignElement(element, type) {
    this.element = element;
    this.type = type
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = 0;
    this.vy = 0;
    this.attack = [];
    this.avoid = [];
    this._at = null;
    this._av = null;
    this.GetAttack = function () {
        this.attack = effect.SignSet.filter(elm => elm.type == attackTable[this.type]);
    }
    this.GetAvoid = function () {
        this.avoid = effect.SignSet.filter(elm => elm.type == avoidTable[this.type]);
    }
    this.Direct = function () {
        if (turn % changeTargetPeriod == 0) {
            this._at = this.attack[this.attack.length * Math.random() | 0];
            this._av = this.avoid[this.avoid.length * Math.random() | 0];

        }
        if (!this._at) {
            this.vx = (Math.random() - 0.5) * noise;
            this.vy = (Math.random() - 0.5) * noise;
            return;
        }
        let atx = this._at ? this._at.x : this.x;
        let aty = this._at ? this._at.y : this.y;
        let avx = this._av ? this._av.x : this.x;
        let avy = this._av ? this._av.y : this.y;
        let dx = (atx - this.x) * attackRatio + (this.x - avx) * avoidRatio;
        let dy = (aty - this.y) * attackRatio + (this.y - avy) * avoidRatio;
        let r = Math.sqrt(dx * dx + dy * dy);
        this.vx = dx / r * moveSpeed + (Math.random() - 0.5) * noise;
        this.vy = dy / r * moveSpeed + (Math.random() - 0.5) * noise;
    }
    this.Move = function () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = 0;
        if (this.x > W) this.x = W;
        if (this.y < 0) this.y = 0;
        if (this.y > H) this.y = H;
    }
    this.UpdateStatus = function () {
        this.GetAttack();
        this.GetAvoid();
        this.Direct();
        this.Move();
    }
    this.UpdatePosition = function () {
        $(this.element).css({
            "top": this.y,
            "left": this.x,
        })
    }
    this.UpdatePosition();
}
function Effect() {
    this.SignSet = [];
    this.Init = function () {
        $.each(signLetters, (_, val) => {
            $.each($('.' + val), (_, elm) => {
                this.SignSet.push(new SignElement(elm, val));
            })
        })
        $.each(this.SignSet, (_, sign) => {
            sign.GetAttack();
            sign.GetAvoid();
        })
    }
    this.ValidateLose = function () {
        $.each(signLetters, (_, val) => {
            let currentSet = this.SignSet.filter(elm => elm.type == val);
            let strongSet = this.SignSet.filter(elm => elm.type == avoidTable[val]);
            $.each(currentSet, (_, sign) => {
                $.each(strongSet, (_, strong) => {
                    if (Math.abs(sign.x - strong.x) <= size && Math.abs(sign.y - strong.y) <= size) {
                        $(sign.element).removeClass(val).addClass(avoidTable[val]);
                        sign.type = avoidTable[val];
                    }
                })
            })
        })
    }
    this.Update = function () {
        turn++;
        $.each(this.SignSet, (_, sign) => {
            sign.UpdateStatus();
            sign.UpdatePosition();
            this.ValidateLose();
        })
    }
}
function GenerateSigns(num) {
    for (let i = 0; i < num; i++) {
        $("#container").append(`<div class="A sign"></div>`);
        $("#container").append(`<div class="B sign"></div>`);
        $("#container").append(`<div class="C sign"></div>`);
    }
}


const effect = new Effect();
GenerateSigns(num);
effect.Init();

let timeout = 15;
function Animate() {
    effect.Update();
    //requestAnimationFrame(Animate);
    setTimeout(Animate, timeout);
}
Animate();