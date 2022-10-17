
// configuration variables
const nodeGap = 2;
const nodeWidth = 3.5;
const stageHeight = 2.5;

// variables
const container = $("#container")[0];
const line = $(".line")[0];
const halfGap = nodeGap / 1.6;
const halfWidth = nodeWidth / 2;
const rem = parseFloat($('body').css('font-size'));
let allNode = [];

// classes
class TreeNode {
    constructor(val, stage = 0, id = "_") {
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
        allNode.push(this);
    }
    CreateNodeElement() {
        let elementStr = `
            <div class="nodeDiv" id="${this.id}" style="top: ${this.stage * stageHeight + 2}rem;">
                <div class="node">${this.val}</div>
                <div class="add left" style="left: -.8rem;" onclick="AddNode(${this.id},0)"></div>
                <div class="add right" style="left: .8rem;" onclick="AddNode(${this.id},1)"></div>
            </div>
        `;
        $(container).append(elementStr);
        this.element = $(`#${this.id}`);
    }
    AddLeft(val) {
        this.left = new TreeNode(val, this.stage + 1, this.id + "l");
        UpdateNodes(root);
    }
    AddRight(val) {
        this.right = new TreeNode(val, this.stage + 1, this.id + "r");
        UpdateNodes(root);
    }
}

// functions
function UpdateNodes(node) {
    UpdateBandWidth(node);
    RefreshHorizontal(node);
    CreateLine(node);
    RemoveAddButton(node);
}
function UpdateBandWidth(node) {
    if (!node) return;
    UpdateBandWidth(node.left);
    UpdateBandWidth(node.right);
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
function RefreshHorizontal(node, left = 0) {
    if (!node) return;
    $(node.element).css('left', `${left}rem`);
    RefreshHorizontal(node.left, left - node.leftBand);
    RefreshHorizontal(node.right, left + node.rightBand);
}
function CreateLine(node) {
    if (!node) return;
    $(node.element).children(".line").remove();
    if (node.left) {
        let lineStr = GetLineStr(node, 0);
        $(node.element).append(lineStr);
    }
    if (node.right) {
        let lineStr = GetLineStr(node, 1);
        $(node.element).append(lineStr);
    }
    CreateLine(node.left);
    CreateLine(node.right);
}
function GetLineStr(node, type) {
    // type: 1->right, 0->left;
    let band = type ? node.rightBand : node.leftBand;
    let angle = Math.atan(stageHeight / band) * 57.295779;
    if (!type) angle = 180 - angle;
    let length = Math.sqrt(stageHeight * stageHeight + band * band) * rem;
    let styleStr = `transform:rotate(${angle}deg);width:${length}px;`;
    return `<div class="line" style="${styleStr}"></div>`;
}
function RemoveAddButton(node) {
    if (!node) return;
    if (node.left) $(node.element).children(".add.left").remove();
    if (node.right) $(node.element).children(".add.right").remove();
    RemoveAddButton(node.left);
    RemoveAddButton(node.right);
}
function AddNode(nodeId, type) {
    nodeId = $(nodeId).attr("id")
    let node = GetNodeById(root, nodeId);
    if (type)
        node.AddRight(num++);
    else
        node.AddLeft(num++);
}
function GetNodeById(node, nodeId) {
    if (!node) return null;
    if (node.id == nodeId) return node;
    let searchResult = undefined;
    searchResult = GetNodeById(node.left, nodeId);
    if (searchResult) return searchResult;
    searchResult = GetNodeById(node.right, nodeId);
    if (searchResult) return searchResult;
    return null;

}

// initialization
let num = 0;
let root = new TreeNode(num++);