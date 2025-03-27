// Конфигурация (ОБЯЗАТЕЛЬНО ПРОВЕРЬТЕ URL!)
const CONFIG = {
    statusUrl: 'https://k2254ivv.github.io/scorpiox-site/status.txt',
    descUrl: 'https://k2254ivv.github.io/scorpiox-site/desc.txt',
    repoName: 'scorpiox-site'
};

// Главная функция
(async function() {
    try {
        // 1. Проверка статуса
        const status = await fetchText(CONFIG.statusUrl);
        
        if (status === 'pending') {
            window.location.href = `/${CONFIG.repoName}/pending/`;
            return;
        }

        // 2. Инициализация основной страницы
        await initMainPage();
        
    } catch (error) {
        console.error('Ошибка:', error);
        // Фолбэк если что-то пошло не так
        document.getElementById('description').textContent = 'Добро пожаловать в ScorpioX (оффлайн-режим)';
    }
})();

// ====== ОСНОВНЫЕ ФУНКЦИИ ======
async function initMainPage() {
    const description = document.getElementById('description');
    
    // 1. Печатаем приветствие
    await typeText(description, 'Добро пожаловать в ScorpioX');
    
    // 2. Загружаем и печатаем описание
    const descText = await fetchText(CONFIG.descUrl);
    await typeText(description, '\n\n' + descText);
    
    // 3. Добавляем мигающий курсор
    addCursor(description);
}

// ====== УТИЛИТЫ ======
async function fetchText(url) {
    const response = await fetch(`${url}?t=${Date.now()}`);
    if (!response.ok) throw new Error(`Ошибка загрузки: ${url}`);
    return await response.text();
}

function typeText(element, text) {
    return new Promise(resolve => {
        let i = 0;
        element.textContent = '';
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text[i++];
            } else {
                clearInterval(timer);
                resolve();
            }
        }, 50); // Скорость печати
    });
}

function addCursor(element) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    element.appendChild(cursor);
}
