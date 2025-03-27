// Конфигурация
const CONFIG = {
    repoName: 'scorpiox-site', // название вашего репозитория
    statusFile: '/status.txt', // путь к файлу статуса
    downloadFile: 'https://example.com/file.zip' // ссылка для скачивания
};

// Основная функция
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const status = await checkSiteStatus();
        
        if (status === 'pending' && !isPendingPage()) {
            redirectToPending();
            return;
        }

        if (!isPendingPage()) {
            initMainInterface();
        }
    } catch (error) {
        console.error('Ошибка при проверке статуса:', error);
        // По умолчанию показываем основной интерфейс
        if (!isPendingPage()) initMainInterface();
    }
});

// ====== ФУНКЦИИ ПРОВЕРКИ СТАТУСА ======
async function checkSiteStatus() {
    const response = await fetch(`${CONFIG.statusFile}?t=${Date.now()}`); // Добавляем timestamp чтобы избежать кэширования
    if (!response.ok) throw new Error('Файл статуса не найден');
    const status = await response.text();
    return status.trim().toLowerCase();
}

function isPendingPage() {
    return window.location.pathname.includes('/pending/');
}

function redirectToPending() {
    window.location.href = `/${CONFIG.repoName}/pending/`;
}

// ====== ОСНОВНОЙ ИНТЕРФЕЙС ======
function initMainInterface() {
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

    // Анимация печати
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

// ====== АНИМАЦИИ ======
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
    }, 50);
}

function showDownloadButton(element, text) {
    element.innerHTML = text;
    addCursor(element);
    
    element.style.cursor = 'pointer';
    element.style.transition = 'all 0.3s';
    
    element.addEventListener('mouseenter', () => {
        element.style.textShadow = '0 0 10px #00ff00';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.textShadow = 'none';
    });
    
    element.addEventListener('click', startDownload);
}

function addCursor(element) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    element.appendChild(cursor);
}

// ====== СКАЧИВАНИЕ ======
function startDownload() {
    const link = document.createElement('a');
    link.href = CONFIG.downloadFile;
    link.download = CONFIG.downloadFile.split('/').pop();
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
