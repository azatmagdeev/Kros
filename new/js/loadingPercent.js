export const loadingPercent = document.createElement('div');
loadingPercent.id = 'loadingPercent';

loadingPercent.innerHTML = `
        <img src="./loading.gif" alt="" id="spinner">
        Загрузка
        <span id="loadNumber">...</span>
    `;