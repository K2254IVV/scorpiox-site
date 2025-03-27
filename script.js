// ====== ГЛАВНЫЕ НАСТРОЙКИ ======
const CONFIG = {
    siteStatus: 'active', // 'active' или 'pending'
    repoName: 'scorpiox-site', // название вашего репозитория
    downloadFile: 'https://example.com/file.zip' // ссылка для скачивания
};

// ====== ОСНОВНОЙ КОД ======
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем статус сайта
    checkSiteStatus();
    
    // Если это не страница ожидания - инициализируем основной интерфейс
    if (!window.location.pathname.includes('/pending/')) {
        initMainInterface();
    }
});

function checkSiteStatus() {
    // Вариант 1: Проверка через hash (#pending в URL)
    if (window.location.hash === '#pending') {
        redirectToPending();
        return;
    }

    // Вариант 2: Проверка через localStorage
    const savedStatus = localStorage.getItem('siteStatus');
    if (savedStatus === 'pending' && !window.location.pathname.includes('/pending/')) {
        redirectToPending();
        return;
    }

    // Вариант 3: Проверка через status.txt (для GitHub Pages)
    fetch(`/${CONFIG.repoName}/status.txt`)
        .then(response => {
            if (response.ok) return response.text();
            return 'active';
        })
        .then(status => {
            if (status.trim() === 'pending' && !window.location.pathname.includes('/pending/')) {
                redirectToPending();
            }
        })
        .catch(() => console.log('Status check fallback to active'));
}

function redirectToPending() {
    if (!window.location.pathname.includes('/pending/')) {
        window.location.href = `/${CONFIG.repoName}/pending/`;
    }
}

function initMainInterface() {
    // Устанавливаем статус активным при загрузке
    localStorage.setItem('siteStatus', 'active');

    const description = document.getElementById('description');
    const downloadButton = document.getElementById('download-button');
    
    const descText = 'Добро пожаловать в ScorpioX';
    const buttonText = `
  _____                      _                 _ 
 |  __ \\                    | |               | |
 | |  | | _____      ___ __ | | ___   __ _  __| |
 | |  | |/ _ \\ \\ /\\ / | '_ \\| |/ _ \\ / _\` |/ _\` |
 | |__| | (_) \\ V  V /| | | | | (_) | (_| | (_| |
 |_____/ \\___/ \\_/\\_/ |_| |_|_|\\___/ \\__,_|\\__,_|
`.trim();

    // Анимация печатающегося текста
    if (!sessionStorage.getItem('animationShown')) {
        typeWriter(description, descText, () => {
            showDownloadButton(downloadButton, buttonText);
        });
        sessionStorage.setItem('animationShown', 'true');
    } else {
        description.textContent = descText;
        showDownloadButton(downloadButton, buttonText);
    }
}

// ====== АНИМАЦИИ И ЭФФЕКТЫ ======
function typeWriter(element, text, onComplete) {
    let i = 0;
    element.innerHTML = '';
    
    const typing = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
            if (onComplete) onComplete();
        }
    }, 50); // Скорость печати
}

function showDownloadButton(element, text) {
    element.innerHTML = text;
    addCursor(element);
    
    // Стили при наведении
    element.style.transition = 'all 0.3s';
    element.addEventListener('mouseenter', () => {
        element.style.textShadow = '0 0 10px #00ff00';
    });
    element.addEventListener('mouseleave', () => {
        element.style.textShadow = 'none';
    });
    
    // Клик по кнопке
    element.addEventListener('click', () => {
        startDownload();
    });
}

function addCursor(element) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    element.appendChild(cursor);
}

// ====== ЛОГИКА СКАЧИВАНИЯ ======
function startDownload() {
    // 1. Анимация нажатия кнопки
    const button = document.getElementById('download-button');
    button.style.transform = 'scale(0.95)';
    button.style.color = '#55ff55';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
    
    // 2. Запуск скачивания
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = CONFIG.downloadFile;
        link.download = CONFIG.downloadFile.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 3. Сообщение о успешном скачивании
        button.innerHTML = 'Скачивание началось!';
        setTimeout(() => {
            button.innerHTML = buttonText;
            addCursor(button);
        }, 2000);
    }, 300);
}

// ====== ДЛЯ АДМИНИСТРИРОВАНИЯ ======
// Чтобы перевести сайт в режим ожидания, выполните в консоли:
// localStorage.setItem('siteStatus', 'pending');
// window.location.href = '/scorpiox-site/pending/';

// Чтобы вернуть в рабочее состояние:
// localStorage.setItem('siteStatus', 'active');
// window.location.reload();
