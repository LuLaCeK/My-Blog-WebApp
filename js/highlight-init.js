        // Initialize highlight.js
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('pre code').forEach((block) => {
                block.textContent = block.textContent.trim(); // Trim leading/trailing spaces
                hljs.highlightBlock(block);
            });
        });