document.addEventListener('DOMContentLoaded', () => {
    const editor = document.querySelector('#editor');
    const pages = document.querySelector('#pages');

    async function loadTranscript() {
        try {
            const response = await fetch('transcript.txt');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            // Replace newline characters with <p> tags for proper HTML rendering
            // Add <br> for empty lines
            const htmlContent = text.split('\n').map(line => {
                if (line.trim() === '') {
                    return '<p><br></p>';
                }
                return `<p>${line}</p>`;
            }).join('');
            editor.innerHTML = htmlContent;
            adjustNumberOfPages(); // Adjust pages after loading content
        } catch (error) {
            console.error('Error loading transcript:', error);
            editor.innerHTML = '<p>Error loading transcript.</p>';
        }
    }

    function adjustNumberOfPages() {
        const editorHeight = editor.clientHeight;
        const neededPages = parseInt(editorHeight / 547) + 1;
        const currentPages = pages.querySelectorAll('.page').length;
        console.log(neededPages, currentPages);
        if (neededPages > currentPages) {
            for (let i = currentPages; i < neededPages; i++) {
                const page = document.createElement('div');
                page.classList.add('page');
                pages.appendChild(page);
                const breaker = document.createElement('div');
                breaker.classList.add('breaker');
                pages.appendChild(breaker);
            }
        } else if (neededPages < currentPages) {
            for (let i = currentPages - 1; i >= neededPages; i--) {
                pages.removeChild(pages.querySelector('.page'));
                pages.removeChild(pages.querySelector('.breaker'));
            }
        }
    }
    window.addEventListener('resize', adjustNumberOfPages);
    editor.addEventListener('DOMSubtreeModified', adjustNumberOfPages);
    
    loadTranscript(); // Load transcript content and then adjust pages
});
