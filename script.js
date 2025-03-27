document.addEventListener('DOMContentLoaded', () => {
    const description = document.getElementById('description');
    const downloadButton = document.getElementById('download-button');
    
    const descText = 'тест';
    const buttonText = `
  _____                      _                 _ 
 |  __ \\                    | |               | |
 | |  | | _____      ___ __ | | ___   __ _  __| |
 | |  | |/ _ \\ \\ /\\ / | '_ \\| |/ _ \\ / _\` |/ _\` |
 | |__| | (_) \\ V  V /| | | | | (_) | (_| | (_| |
 |_____/ \\___/ \\_/\\_/ |_| |_|_|\\___/ \\__,_|\\__,_|
`.trim();
    
    // Проверяем, была ли уже анимация в этой сессии
    if (!sessionStorage.getItem('animationShown')) {
        // Анимация печатания описания
        typeText(description, descText, () => {
            // После описания показываем кнопку
            downloadButton.textContent = buttonText;
            addCursor(downloadButton);
            
            // Делаем кнопку кликабельной
            downloadButton.addEventListener('click', () => {
                alert('Скачивание начато!');
                // Здесь можно добавить реальную логику скачивания
            });
        });
        
        sessionStorage.setItem('animationShown', 'true');
    } else {
        // Если анимация уже была - показываем всё сразу
        description.textContent = descText;
        downloadButton.textContent = buttonText;
        addCursor(downloadButton);
        
        downloadButton.addEventListener('click', () => {
            alert('Скачивание начато!');
        });
    }
    
    function typeText(element, text, callback) {
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent = text.substring(0, i + 1);
                i++;
            } else {
                clearInterval(typing);
                if (callback) callback();
            }
        }, 100); // Скорость печати (как в консоли)
    }
    
    function addCursor(element) {
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        element.appendChild(cursor);
    }
});
