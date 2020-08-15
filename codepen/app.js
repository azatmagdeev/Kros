const menBtn = document.getElementById('men');
const womenBtn = document.getElementById('women');
const lowKedBtn = document.getElementById('low-ked');
const highKedBtn = document.getElementById('high-ked');

let isMen;
let isLow;

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

function hide(...els) {
    els.forEach(el => {
        el.style.display = 'none';
    })
}

function show(...els) {
    els.forEach(el => {
        el.style.display = 'flex';
    })
}

lowKedBtn.addEventListener('click',()=>{
    isLow = true;
    defineChoice(isMen,isLow);
    hide(document.getElementById('c-center'));
    loadmodel();
});

function defineChoice(m,l){
    // console.log({m,l});
    const choiceEl = document.getElementById('choice');
    choiceEl.textContent = l ?  'низкий кед': 'высокий кед';
    choiceEl.textContent += m ?  ' для мужчин': ' для женщин';
}

