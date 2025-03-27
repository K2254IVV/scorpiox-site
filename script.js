// Конфигурация
const CONFIG = {
    repoName: 'scorpiox-site',
    descriptionFile: 'desc.txt',
    screenshotsFile: 'screenshots.txt',
    downloadFile: 'https://example.com/download.zip'
};

// Главная функция
(async function() {
    // Проверка статуса
    if (await checkStatus() === 'pending') {
        window.location.href = '/pending/';
        return;
    }

    // Инициализация основной страницы
    initConsole();
    loadProjectInfo();
})();

// Проверка статуса
async function checkStatus() {
    try {
        const response = await fetch(`/status.txt?t=${Date.now()}`);
        return (await response.text()).trim();
    } catch {
        return 'active'; // По умолчанию
    }
}

// Консольная часть
function initConsole() {
    const description = document.getElementById('description');
    const downloadButton = document.getElementById('download-button');
    
    const consoleText = 'Добро пожаловать в ScorpioX';
    const buttonText = `
  _____                      _                 _ 
 |  __ \\                    | |               | |
 | |  | | _____      ___ __ | | ___   __ _  __| |
 | |  | |/ _ \\ \\ /\\ / | '_ \\| |/ _ \\ / _\` |/ _\` |
 | |__| | (_) \\ V  V /| | | | | (_) | (_| | (_| |
 |_____/ \\___/ \\_/\\_/ |_| |_|_|\\___/ \\__,_|\\__,_|
    `.trim();

    typeText(description, consoleText, () => {
        downloadButton.innerHTML = buttonText;
        addCursor(downloadButton);
        setupDownloadButton(downloadButton);
    });
}

// Загрузка описания и скриншотов
async function loadProjectInfo() {
    try {
        // Загрузка описания
        const descResponse = await fetch(CONFIG.descriptionFile);
        const description = await descResponse.text();
        document.getElementById('project-description').textContent = description;

        // Загрузка скриншотов
        const screensResponse = await fetch(CONFIG.screenshotsFile);
        const screenshots = (await screensResponse.text())
            .split('\n')
            .filter(path => path.trim() !== '');

        const container = document.getElementById('screenshots-container');
        screenshots.forEach(path => {
            const img = document.createElement('img');
            img.src = path.trim();
            img.className = 'screenshot';
            img.alt = 'Скриншот проекта';
            container.appendChild(img);
        });

    } catch (error) {
        console.error('Ошибка загрузки информации:', error);
    }
}

// Вспомогательные функции
function typeText(element, text, callback) {
    let i = 0;
    element.innerHTML = '';
    
    const timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text[i++];
        } else {
            clearInterval(timer);
            callback?.();
        }
    }, 50);
}

function addCursor(element) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    element.appendChild(cursor);
}

function setupDownloadButton(button) {
    button.style.cursor = 'pointer';
    button.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = CONFIG.downloadFile;
        link.download = CONFIG.downloadFile.split('/').pop();
        link.click();
    });
}
