document.addEventListener('DOMContentLoaded', () => {
    const businessNameInput = document.getElementById('businessName');
    const generateButton = document.getElementById('generateButton');
    const resultsDiv = document.getElementById('results');
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    const noResultsDiv = document.getElementById('no-results');

    // CONFIGURACIÓN FINAL DE PLATAFORMAS (VERSIÓN ESTABLE)
    const socialPlatforms = [
        { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/@', checkable: true },
        { id: 'facebook', name: 'Facebook', url: 'https://facebook.com/', checkable: false },
        { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/in/', checkable: false },
        { id: 'instagram', name: 'Instagram', url: 'https://instagram.com/', checkable: false },
        { id: 'tiktok', name: 'TikTok', url: 'https://tiktok.com/@', checkable: false },
        { id: 'x', name: 'X (Twitter)', url: 'https://x.com/', checkable: false },
        { id: 'snapchat', name: 'Snapchat', url: 'https://snapchat.com/add/', checkable: false }
    ];

    generateButton.addEventListener('click', generateAndDisplaySuggestions);
    businessNameInput.addEventListener('keyup', (e) => e.key === 'Enter' && generateAndDisplaySuggestions());

    function generateAndDisplaySuggestions() {
        const name = businessNameInput.value.trim();
        if (!name) {
            resultsDiv.classList.add('hidden');
            noResultsDiv.classList.remove('hidden');
            return;
        }
        noResultsDiv.classList.add('hidden');

        const cleanName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s_.]/g, '').trim();
        const words = cleanName.split(/\s+/);
        let suggestions = new Set();
        
        suggestions.add(words.join(''));
        if (words.length > 1) {
            suggestions.add(words.join('_'));
            suggestions.add(words.join('.'));
        }
        suggestions.add("somos" + words.join(''));
        suggestions.add("hola" + words.join(''));
        
        const uniqueSuggestions = [...suggestions].slice(0, 5);

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

    async function checkAvailability(platform) {
    const button = document.getElementById(`${platform}-check-btn`);
    button.disabled = true;
    button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
    button.className = 'social-check-btn status-loading';

    try {
        const response = await fetch(`/check/${platform}`);
        // Check if the response is successful (status code 2xx)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Check if the response content type is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            // Handle cases where the response is not JSON (e.g., an HTML error page)
             throw new TypeError("Expected JSON response, but received " + contentType);
        }
        const data = await response.json();

        if (data.available) {
            button.className = 'social-check-btn status-available';
            button.innerHTML = `✅ Disponible`;
        } else {
            button.className = 'social-check-btn status-unavailable';
            button.innerHTML = `❌ No disponible`;
        }
    } catch (error) {
        // This catch block will handle both network errors and JSON parsing errors
        console.error('Error checking:', platform, error);
        button.className = 'social-check-btn status-manual';
        button.innerHTML = `⚠️ Error. Verificar`;
    } finally {
        // Ensure the button is re-enabled even if there's an error
        button.disabled = false;
    }
}


});