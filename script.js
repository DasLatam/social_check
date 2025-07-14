document.addEventListener('DOMContentLoaded', () => {
    const businessNameInput = document.getElementById('businessName');
    const generateButton = document.getElementById('generateButton');
    const resultsDiv = document.getElementById('results');
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    const noResultsDiv = document.getElementById('no-results');

    const socialPlatforms = [
        { id: 'instagram', name: 'Instagram', url: 'https://instagram.com/', checkable: true },
        { id: 'tiktok', name: 'TikTok', url: 'https://tiktok.com/@', checkable: true },
        { id: 'facebook', name: 'Facebook', url: 'https://facebook.com/', checkable: true },
        { id: 'x', name: 'X (Twitter)', url: 'https://x.com/', checkable: true },
        { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/in/', checkable: false },
        { id: 'youtube', name: 'YouTube', url: 'https://youtube.com/@', checkable: false },
        { id: 'snapchat', name: 'Snapchat', url: 'https://snapchat.com/add/', checkable: false }
    ];

    generateButton.addEventListener('click', generateAndDisplaySuggestions);
    businessNameInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            generateAndDisplaySuggestions();
        }
    });

    function generateAndDisplaySuggestions() {
        const name = businessNameInput.value.trim();
        if (!name) {
            resultsDiv.classList.add('hidden');
            noResultsDiv.classList.remove('hidden');
            return;
        }
        noResultsDiv.classList.add('hidden');

        // Generar sugerencias
        const cleanName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, '').trim();
        const words = cleanName.split(/\s+/);
        let suggestions = new Set();
        
        suggestions.add(words.join(''));
        if (words.length > 1) {
            suggestions.add(words.join('_'));
            suggestions.add(words.join('.'));
        }
        if (name.toLowerCase().includes("propiedades") && words.length > 0) {
            suggestions.add(words[0] + "prop");
            suggestions.add("inmo" + words[0]);
        }
        suggestions.add("somos" + words.join(''));
        
        const uniqueSuggestions = [...suggestions].slice(0, 5);

        // Mostrar sugerencias y preparar para la verificación
        suggestionsContainer.innerHTML = '';
        uniqueSuggestions.forEach(username => {
            const card = document.createElement('div');
            card.className = 'suggestion-card';
            const title = document.createElement('h3');
            title.textContent = username;
            card.appendChild(title);

            const linksDiv = document.createElement('div');
            linksDiv.className = 'social-links';
            
            socialPlatforms.forEach(platform => {
                const button = document.createElement('button');
                button.dataset.username = username;
                button.dataset.platform = platform.id;
                button.dataset.url = platform.url;
                linksDiv.appendChild(button);

                if (platform.checkable) {
                    button.className = 'social-check-btn status-checking';
                    button.innerHTML = `<span class="spinner"></span> ${platform.name}`;
                    button.disabled = true;
                    checkAvailability(button);
                } else {
                    button.className = 'social-check-btn status-manual';
                    button.innerHTML = `Ver en ${platform.name}`;
                    button.onclick = () => window.open(`${platform.url}${username}`, '_blank');
                }
            });

            card.appendChild(linksDiv);
            suggestionsContainer.appendChild(card);
        });

        resultsDiv.classList.remove('hidden');
    }

    async function checkAvailability(button) {
        const { username, platform, url } = button.dataset;
        
        try {
            const response = await fetch(`checker.php?platform=${platform}&username=${username}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            button.disabled = false;
            
            if (data.status === 'available') {
                button.className = 'social-check-btn status-available';
                button.innerHTML = `✅ Disponible en ${platform}`;
            } else {
                button.className = 'social-check-btn status-unavailable';
                button.innerHTML = `🔴 No Disponible / Bloqueado`;
            }

        } catch (error) {
            console.error('Error checking:', platform, error);
            button.className = 'social-check-btn status-manual';
            button.innerHTML = `⚠️ Error. Verificar`;
            button.disabled = false;
        }

        // Hacer que todos los botones sean clickables al final para la verificación manual.
        button.onclick = () => window.open(`${url}${username}`, '_blank');
    }
});