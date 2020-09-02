import {hide, show} from "../lib/functions.js";
// import mindMap from "./mindmap.js";

const menBtn = document.getElementById('men');
const womenBtn = document.getElementById('women');
const lowKedBtn = document.getElementById('low-ked');
const highKedBtn = document.getElementById('high-ked');
const classicSoleBtn = document.getElementById('classicSole');
const highSoleBtn = document.getElementById('highSole');
const noseSoleBtn = document.getElementById('noseSole');
const choiceEl = document.getElementById('choice');
const cWrapper = document.getElementById('c-wrapper');
let isMen;
let isLow;
let mindMapModel;
let first;

menBtn.addEventListener('click', () => {
    isMen = true;
    showType();
});

womenBtn.addEventListener('click', () => {
    isMen = false;
    showType();
});

function showType() {
    hide(menBtn, womenBtn);
    show(lowKedBtn, highKedBtn);
}

lowKedBtn.addEventListener('click', () => {
    isLow = true;
    defineChoice(isMen, isLow);
    showSoleType();
});

function showSoleType() {
    hide(lowKedBtn, highKedBtn);
    show(classicSoleBtn, highSoleBtn, noseSoleBtn);

}

classicSoleBtn.addEventListener('click', () => {
    first = 0;
    // mindMapModel = mindMap[0];
    showIframe(first);
    hide(document.getElementById('c-center'));
});
highSoleBtn.addEventListener('click', () => {
    // mindMapModel = mindMap[1];
    first = 1;
    showIframe(first);
    hide(document.getElementById('c-center'));
});
noseSoleBtn.addEventListener('click', () => {
    // mindMapModel = mindMap[2];
    first = 2;
    showIframe(first);
    hide(document.getElementById('c-center'));
});

function showIframe(param) {
    cWrapper.innerHTML += `
    <iframe src="/src/?${param}" 
    height="${cWrapper.clientHeight}" 
    width="${cWrapper.clientWidth}"
    style="position:absolute" frameborder="0">
    </iframe>`
}

window.addEventListener('resize', (e) => {
    console.log(e);
    document.querySelector('iframe').height = `${cWrapper.clientHeight}`;
    document.querySelector('iframe').width = `${cWrapper.clientWidth}`;
});


function defineChoice(m, l) {
    choiceEl.textContent = l ? 'низкий кед' : 'высокий кед';
    choiceEl.textContent += m ? ' для мужчин' : ' для женщин';
}


//todo: сохранять обЪект и загружать его вновь
//todo: переделать на iframe