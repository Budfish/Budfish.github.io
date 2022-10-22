
// configuration variables
const nodeGap = 2;
const nodeWidth = 3.5;
const stageHeight = 3;

// variables
const treeArea = $("#treeArea")[0];
const bottomArea = $("#bottomArea")[0];
const resetTreeBtn = $("#resetTreeBtn")[0];
const valueShower = $("#valueShower");
const line = $(".line")[0];
const halfGap = nodeGap / 1.6;
const halfWidth = nodeWidth / 2;
const rem = parseFloat($('body').css('font-size'));
const globalShift = parseFloat($(treeArea).css("width")) / rem / 2;
const bottomAreaBias = $(bottomArea).position();
const code_GetHeight =
    `function GetHeight(node){
    if(!node) return 0;
    let L_height = GetHeight(node.left);
    let R_height = GetHeight(node.right);
    let ans = max(L_height,R_height) + 1;
    return ans;
}`;
let resettingTree = false;
let allNode = [];
let moveWindowId = null;

// classes
class TreeNode {
    constructor(val, factory, stage = 0, id = "_") {
        this.val = val;
        this.left = null;
        this.right = null;
        this.leftBand = 0;
        this.rightBand = 0;
        this.leftWidth = halfWidth;
        this.rightWidth = halfWidth;
        this.stage = stage;
        this.id = id;
        this.CreateNodeElement();
        this.factory = factory;
        allNode.push(this);
    }
    CreateNodeElement() {
        let elementStr = `
            <div class="nodeDiv" id="${this.id}" style="top: ${this.stage * stageHeight + 2}rem;">
                <div class="node">${this.val}</div>
                <div class="add left" style="left: -.8rem;" onclick="treeFactory.AddNode(${this.id},0)"></div>
                <div class="add right" style="left: .8rem;" onclick="treeFactory.AddNode(${this.id},1)"></div>
            </div>
        `;
        $(treeArea).append(elementStr);
        this.element = $(`#${this.id}`);
    }
    AddLeft(val) {
        this.left = new TreeNode(val, this.factory, this.stage + 1, this.id + "l");
        this.factory.Update();
    }
    AddRight(val) {
        this.right = new TreeNode(val, this.factory, this.stage + 1, this.id + "r");
        this.factory.Update();
    }
}
class TreeNodeFactory {
    constructor() {
        this.num = 0;
    }
    Init() {
        $(treeArea).html("");
        this.num = 0;
        this.root = new TreeNode(this.num++, this);
        this.Update();
    }
    Reset() {
        resettingTree = true;
        $(resetTreeBtn).addClass("update");
        this.Init();
        $(bottomArea).html("");
        setTimeout(() => {
            $(resetTreeBtn).removeClass("update");
            resettingTree = false;
        }, 1000);
    }
    Update() {
        $(bottomArea).html("");
        this.UpdateBandWidth(this.root);
        this.RefreshHorizontal(this.root);
        this.CreateLine(this.root);
        this.RemoveAddButton(this.root);
    }
    UpdateBandWidth(node) {
        if (!node) return;
        this.UpdateBandWidth(node.left);
        this.UpdateBandWidth(node.right);
        if (node.left) {
            let left = node.left;
            node.leftBand = left.rightWidth;
            node.leftWidth = left.rightWidth + left.leftWidth;
        }
        if (node.right) {
            let right = node.right;
            node.rightBand = right.leftWidth;
            node.rightWidth = right.leftWidth + right.rightWidth;
        }
    }
    RefreshHorizontal(node, left = 0) {
        if (!node) return;
        $(node.element).css('left', `${globalShift + left}rem`);
        this.RefreshHorizontal(node.left, left - node.leftBand);
        this.RefreshHorizontal(node.right, left + node.rightBand);
    }
    CreateLine(node) {
        if (!node) return;
        $(node.element).children(".line").remove();
        if (node.left) {
            let lineStr = this.GetLineStr(node, 0);
            $(node.element).append(lineStr);
        }
        if (node.right) {
            let lineStr = this.GetLineStr(node, 1);
            $(node.element).append(lineStr);
        }
        this.CreateLine(node.left);
        this.CreateLine(node.right);
    }
    GetLineStr(node, type) {
        // type: 1->right, 0->left;
        let band = type ? node.rightBand : node.leftBand;
        let angle = Math.atan(stageHeight / band) * 57.295779;
        if (!type) angle = 180 - angle;
        let length = Math.sqrt(stageHeight * stageHeight + band * band) * rem;
        let styleStr = `transform:rotate(${angle}deg);width:${length}px;`;
        return `<div class="line" style="${styleStr}"></div>`;
    }
    RemoveAddButton(node) {
        if (!node) return;
        if (node.left) $(node.element).children(".add.left").remove();
        if (node.right) $(node.element).children(".add.right").remove();
        this.RemoveAddButton(node.left);
        this.RemoveAddButton(node.right);
    }
    AddNode(nodeId, type) {
        nodeId = $(nodeId).attr("id")
        let node = this.GetNodeById(this.root, nodeId);
        if (type)
            node.AddRight(this.num++);
        else
            node.AddLeft(this.num++);
    }
    GetNodeById(node, nodeId) {
        if (!node) return null;
        if (node.id == nodeId) return node;
        let searchResult = undefined;
        searchResult = this.GetNodeById(node.left, nodeId);
        if (searchResult) return searchResult;
        searchResult = this.GetNodeById(node.right, nodeId);
        if (searchResult) return searchResult;
        return null;
    }
}
class CodeFactory {
    constructor() {
        this.fwid = "_";
        this.getHeightFactory = new Code_GetHeightFactory();
    }
    RunGetHeight() {
        this.fwid = "_";
        this.ct = 0;
        $(bottomArea).html("");
        this.GetHeight(treeFactory.root, null);
        this.ListenHoverVariables();
        this.ListenFunctionSpan();
        this.ListenWindowHeader();
        $("#fw_").addClass("show");
    }
    GetHeight(node, parent, lr = 0) {
        // lr: 0->l, 1->r;
        this.CreateFunctionWindow(this.fwid);
        if (!node) {
            this.getHeightFactory.EarlyReturn(this.fwid, parent, lr);
            return 0;
        }

        this.getHeightFactory.UpdateLine_0(this.fwid, node);
        this.fwid += "l";
        let L_height = this.GetHeight(node.left, node, 0);
        this.Cutfwdid();

        this.getHeightFactory.UpdateLine_1(this.fwid, node, L_height);
        this.fwid += "r";
        let R_height = this.GetHeight(node.right, node, 1);
        this.Cutfwdid();

        this.getHeightFactory.UpdateLine_2(this.fwid, L_height, R_height);
        let ans = max(L_height, R_height) + 1;

        this.getHeightFactory.UpdateLine_3(this.fwid, ans);
        return ans;
    }
    CreateFunctionWindow(fwid) {
        let fwStr =
            `<div id="fw${fwid}" style="top:${this.ct}rem" class="functionWindow">
            <div id="hd${fwid}" class="header"></div>
            <div id="fta${fwid}" class="functionTextArea"></div>
            </div>`;
        this.ct += 2;

        $(bottomArea).append(fwStr);
    }
    Cutfwdid() {
        this.fwid = this.fwid.substring(0, this.fwid.length - 1);
    }
    ListenHoverVariables() {
        let variables = $('.variable');
        $.each(variables, (_, varelm) => {
            let _varelm = $(varelm);
            if (_varelm.hasClass("node")) {
                this.ListenNode(_varelm);
            } else {
                this.ListenNumber(_varelm);
            }
        })
    }
    ListenNumber(_elm) {
        _elm.mouseenter(() => {
            valueShower.html(_elm.attr("val"));
            valueShower.addClass("show");
        })
        _elm.mousemove((e) => {
            valueShower.css({
                "top": e.clientY - 2 * rem - 5,
                "left": e.clientX + 5,
            })
        })
        _elm.mouseout(() => {
            valueShower.removeClass("show");
            valueShower.html("");
        })
    }
    ListenNode(_elm) {
        let nodeid = _elm.attr("nodeid");
        let node = $(`#${nodeid}`)[0];
        let _node = null;
        if (node) {
            _node = $($(node).children(".node")[0]);
        } else {
            let lr = nodeid[nodeid.length - 1] == "l" ? "left" : "right";
            nodeid = nodeid.substring(0, nodeid.length - 1);
            _node = $($(`#${nodeid}`).children(`.add.${lr}`)[0]);
        }
        _elm.mouseenter(() => {
            _node.addClass("show");
        })
        _elm.mouseout(() => {
            _node.removeClass("show");
        })
    }
    ListenFunctionSpan() {
        let fcSpans = $(".functionSpan");
        $.each(fcSpans, (_, elm) => {
            let _elm = $(elm);
            let fwid = _elm.attr("fwid");
            let _fw = $(`#fw${fwid}`);
            _elm.click((e) => {
                let biasX = $(e.target).offset().left;
                let biasY = $(e.target).offset().top;
                if (!_fw.hasClass("show")) {
                    _fw.css({
                        left: biasX - bottomAreaBias["left"] + 6 * rem,
                        top: biasY - bottomAreaBias["top"],
                    })
                }
                _fw.toggleClass("show");
            })
        })
    }
    ListenWindowHeader() {
        $.each($(".functionWindow .header"), (_, elm) => {
            let _elm = $(elm);
            _elm.on("mousedown", (e) => {
                moveWindowId = _elm.attr("id").replace("hd", "");
            })
        })
    }
}
class Code_GetHeightFactory {
    constructor() { }
    EarlyReturn(fwid, parent, lr) {
        let nodeReplace = `<span nodeid="${parent.id + (lr ? "r" : "l")}" class="variable node">node</span>`;
        let HeadGetHeightReplace = `<span fwid="${fwid}" class="functionSpan">GetHeight</span>`
        let str = `
        <p>function GetHeight(node){</p>
        <p> &nbsp&nbsp&nbsp&nbspif(!node) return 0;</p>`.replace(/\bnode\b/g, nodeReplace).replace(/\bGetHeight\b/g, HeadGetHeightReplace);
        str += `
        <p class="gray"> &nbsp&nbsp&nbsp&nbsplet L_height = GetHeight(node.left);</p>
        <p class="gray"> &nbsp&nbsp&nbsp&nbsplet R_height = GetHeight(node.right);</p>
        <p class="gray"> &nbsp&nbsp&nbsp&nbsplet ans = max(L_height,R_height)+1;</p>
        <p class="gray"> &nbsp&nbsp&nbsp&nbspreturn ans;</p>
        <p>}</p>`;
        $(`#fta${fwid}`).append(str);
    }
    UpdateLine_0(fwid, node) {
        let nodeReplace = `<span nodeid="${node.id}" class="variable node">node</span>`;
        let leftReplace = `<span nodeid="${node.id}l" class="variable node">left</span>`;
        let L_heightReplace = `<span id="lh0${fwid}" class="variable">L_height</span>`;
        let GetHeightReplace = `<span fwid="${fwid}l" class="functionSpan">GetHeight</span>`
        let HeadGetHeightReplace = `<span fwid="${fwid}" class="functionSpan">GetHeight</span>`
        let firstGetHeight = true;
        let str = `
        <p>function GetHeight(node){</p>
        <p> &nbsp&nbsp&nbsp&nbspif(!node) return 0;</p>
        <p> &nbsp&nbsp&nbsp&nbsplet L_height = GetHeight(node.left);</p>`;
        str = str.replace(/\bnode\b/g, nodeReplace);
        str = str.replace(/\bleft\b/g, leftReplace);
        str = str.replace(/\bL_height\b/g, L_heightReplace);
        str = str.replace(/\bGetHeight\b/g, (a, b) => {
            if (firstGetHeight) {
                firstGetHeight = false;
                return HeadGetHeightReplace;
            }
            return GetHeightReplace;
        });
        $(`#fta${fwid}`).append(str);
    }
    UpdateLine_1(fwid, node, L_height) {
        $(`#lh0${fwid}`).attr("val", L_height);
        let nodeReplace = `<span nodeid="${node.id}" class="variable node">node</span>`;
        let rightReplace = `<span nodeid="${node.id}r" class="variable node">right</span>`;
        let R_heightReplace = `<span id="rh0${fwid}" class="variable">R_height</span>`;
        let GetHeightReplace = `<span fwid="${fwid}r" class="functionSpan">GetHeight</span>`
        let str = `<p> &nbsp&nbsp&nbsp&nbsplet R_height = GetHeight(node.right);</p>`;
        str = str.replace(/\bnode\b/g, nodeReplace);
        str = str.replace(/\bright\b/g, rightReplace);
        str = str.replace(/\bR_height\b/g, R_heightReplace);
        str = str.replace(/\bGetHeight\b/g, GetHeightReplace);
        $(`#fta${fwid}`).append(str);
    }
    UpdateLine_2(fwid, L_height, R_height) {
        $(`#rh0${fwid}`).attr("val", R_height);
        let ans = max(L_height, R_height) + 1;
        let ansReplace = `<span  val="${ans}" class="variable">ans</span>`;
        let L_heightReplace = `<span val="${L_height}" class="variable">L_height</span>`;
        let R_heightReplace = `<span val="${R_height}" class="variable">R_height</span>`;
        let str = `<p> &nbsp&nbsp&nbsp&nbsplet ans = max(L_height,R_height)+1;</p>`;
        str = str.replace(/\bans\b/g, ansReplace);
        str = str.replace(/\bL_height\b/g, L_heightReplace);
        str = str.replace(/\bR_height\b/g, R_heightReplace);
        $(`#fta${fwid}`).append(str);
    }
    UpdateLine_3(fwid, ans) {
        let ansReplace = `<span  val="${ans}" class="variable">ans</span>`;
        let str = `<p> &nbsp&nbsp&nbsp&nbspreturn ans;</p><p>}</p>`;
        str = str.replace(/\bans\b/g, ansReplace);
        $(`#fta${fwid}`).append(str);
    }
}
class DragWindowFactory {
    constructor() {
        $(bottomArea).on("mousedown", (e) => {
            this._window = $(`#fw${moveWindowId}`);
            if (!this._window[0]) return;
            let bias = this._window.position();
            this.biasY = e.clientY - bias['top'];
            this.biasX = e.clientX - bias['left'];

        })
        $(bottomArea).mousemove((e) => {
            if (!moveWindowId) return;
            this.MoveWindow(e);
        })
        $(document).on("mouseup", (e) => {
            moveWindowId = null;
        })
    }
    MoveWindow(e) {
        this._window.css({
            "top": e.clientY - this.biasY,
            "left": e.clientX - this.biasX,
        })
    }
}

function max(a, b) {
    if (a > b) return a;
    return b;
}

// initialization
$("#userCode").val(code_GetHeight);
let treeFactory = new TreeNodeFactory();
let codeFactory = new CodeFactory();
let dragFactory = new DragWindowFactory();
treeFactory.Init();

$("#runCode").click((e) => {
    if ($(bottomArea).html()) {
        $("#fw_").addClass("show");
        return;
    }
    codeFactory.RunGetHeight();
})
$(resetTreeBtn).click((e) => {
    if (!resettingTree) {
        treeFactory.Reset();
    }
})
