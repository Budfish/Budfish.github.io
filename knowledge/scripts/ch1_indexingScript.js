const courses = $(".course");
const lectureTitle = $("#lectureTitle");
const targetRow = $("#targetRow");
const answerRowsArea = $("#answerRowsArea");
const questionArrays = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], //一般順序
    [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3], //連續/循環
    [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4], //分組/重覆
    [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0], //反向取出
    [3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0], //Exercise 1
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1], //判斷組
    [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8], //Exercise 2-1
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], //拆解一般順序
    [0, 1, 2, 2, 1, 0, 3, 4, 5, 5, 4, 3, 6, 7, 8, 8, 7, 6], //Exercise 2-2
    [0, 1, 2, 0, 3, 4, 0, 5, 6, 0, 7, 8, 0, 9, 10], //Exercise 2-3
    [1, 1, 1, 2, 1, 3, 1, 4, 2, 1, 2, 2, 2, 3, 2, 4, 3, 1, 3, 2, 3, 3, 3, 4], //Exercise 3-1
    [0, 1, 2, 3, 4, 5, 1, 0, 3, 2, 5, 4, 6, 7, 8, 9, 10, 11, 7, 6, 9, 8, 11, 10], //Exercise 3-2
    [2, 1, 0, 1, 2, -1, 4, 3, 0, 3, 4, -1, 6, 5, 0, 5, 6, -1], //Exercise 3-3
];

let currentCourse = 0;
let currentRows = 0;
let answerRows = [];

function GetQuestionLetters(ind) {
    let str = "";
    let arr = questionArrays[ind];
    for (let i = 0; i < arr.length; i++) {
        str += `<div>${arr[i]}</div>`;
    }
    targetRow.html(str);
}
function ChangeCourse(ind, val) {
    currentCourse = ind;
    answerRowsArea.html("");
    lectureTitle.html(val.innerHTML);
    GetQuestionLetters(ind);
}
function ResetAnswerRowsArea() {
    answerRowsArea.html("");
    currentRows = 0;
    answerRows = [];
}
function OnInputChange(e) {
    let index = parseInt($(e.target).attr("ind"));
    let letterRow = $(`#row-${index}`).children(".letterRow")[0];
    let divs = $(letterRow).children("div");
    let evalStr = SetStringToIntegerDevide(e.target.value);
    for (let ind = 0; ind < divs.length; ind++) {
        let i = j = ind;
        try {
            if (evalStr == "") throw "empty";
            let indexing = eval(evalStr);
            divs[ind].innerHTML = indexing;
        } catch (ex) {
            $.each(divs, (_, val) => {
                val.innerHTML = "";
            })
            console.log(ex);
            break;
        }
    }
}
function SetStringToIntegerDevide(str) {
    let c = 0;
    let pt = 0;
    while (pt < str.length && str.substring(pt).indexOf("/") != -1 && c++ < 30) {
        let pos = pt + str.substring(pt).indexOf("/") + 1;
        while (pos < str.length && (str[pos] == " " || IsNumChar(str[pos]))) pos++;
        str = str.substring(0, pos) + "|0" + str.substring(pos);
        console.log(str);
        pt = pos;
    }
    return str;
}
function IsNumChar(char) {
    return char >= "0" && char <= "9";
}
function CreateNewRow() {
    let str =
        `<div id="row-${currentRows}" class="mb">
            <div class="letterRow"></div>
            <div class="answerArea">
                <input type="text" id="input-${currentRows}" ind="${currentRows}">
            </div>
        </div>`;
    answerRowsArea.append(str);

    let newRow = $(`#row-${currentRows}`).children(".letterRow")[0];
    let newInput = $(`#row-${currentRows}`).find("input")[0];
    let arr = questionArrays[currentCourse];
    let divstr = "";
    for (let i = 0; i < arr.length; i++) {
        divstr += `<div></div>`;
    }
    $(newInput).change(e => {
        OnInputChange(e);
    })
    $(newRow).html(divstr);
    answerRows.push(newRow);
    currentRows++;
}


$.each(courses, (ind, val) => {
    $(val).click(e => {
        ChangeCourse(ind, val);
    })
})
$("#addRowBtn").click(e => {
    CreateNewRow();
})

$(courses[0]).click();