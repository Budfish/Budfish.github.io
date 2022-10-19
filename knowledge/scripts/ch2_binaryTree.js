
// configuration variables
const nodeGap = 2;
const nodeWidth = 3.5;
const stageHeight = 3;

// variables
const treeArea = $("#treeArea")[0];
const line = $(".line")[0];
const halfGap = nodeGap / 1.6;
const halfWidth = nodeWidth / 2;
const rem = parseFloat($('body').css('font-size'));
const globalShift = parseFloat($(treeArea).css("width")) / rem / 2;
let allNode = [];

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
        let self = this;
        this.root = new TreeNode(this.num++, self);
        this.Update();
    }
    Update() {
        this.UpdateNodes(this.root);
    }
    UpdateNodes(node) {
        this.UpdateBandWidth(node);
        this.RefreshHorizontal(node);
        this.CreateLine(node);
        this.RemoveAddButton(node);
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

// initialization
let treeFactory = new TreeNodeFactory();
treeFactory.Init();