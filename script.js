document.addEventListener('DOMContentLoaded', () => {
    const asciiLogo = document.getElementById('ascii-logo');
    const description = document.getElementById('description');
    
    const logoText = `
   _____                      _     __   __
  / ____|                    (_)    \\ \\ / /
 | (___   ___ ___  _ __ _ __  _  ___ \\ V / 
  \\___ \\ / __/ _ \\| '__| '_ \\| |/ _ \\ > <  
  ____) | (_| (_) | |  | |_) | | (_) / . \\ 
 |_____/ \\___\\___/|_|  | .__/|_|\\___/_/ \\_\\
                       | |                 
                       |_|                 
    `.trim();
    
    const descText = 'тест';
    
    // Проверяем, была ли уже анимация в этой сессии
    if (!sessionStorage.getItem('animationShown')) {
        // Если нет - запускаем анимацию
        typeText(asciiLogo, logoText, () => {
            typeText(description, descText, null, true);
        });
        sessionStorage.setItem('animationShown', 'true');
    } else {
        // Если была - сразу показываем текст
        asciiLogo.textContent = logoText;
        description.textContent = descText;
        addCursor(description);
    }
    
    function typeText(element, text, callback, addCursorAfter = false) {
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                // Для пре-элемента мы должны обрабатывать переносы строк правильно
                if (element.tagName === 'PRE') {
                    element.textContent = text.substring(0, i + 1);
                } else {
                    element.textContent = text.substring(0, i + 1);
                }
                i++;
            } else {
                clearInterval(typing);
                if (addCursorAfter) {
                    addCursor(element);
                }
                if (callback) callback();
            }
        }, 20); // Скорость печати (меньше = быстрее)
    }
    
    function addCursor(element) {
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        element.appendChild(cursor);
    }
});
