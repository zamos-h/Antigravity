/**
 * Metal Price Tracker - Core Logic
 */

const API_CONFIG = {
    // Using CoinGecko for real-time prices (PAX Gold and Kinesis Silver are excellent spot proxies)
    URL: 'https://api.coingecko.com/api/v3/simple/price?ids=pax-gold,kinesis-silver&vs_currencies=usd',
    REFRESH_INTERVAL: 60000, // 1 minute
};

const UI = {
    goldPrice: document.getElementById('gold-price'),
    silverPrice: document.getElementById('silver-price'),
    goldTime: document.getElementById('gold-time'),
    silverTime: document.getElementById('silver-time'),
    refreshBtn: document.getElementById('refresh-btn'),
    cards: {
        gold: document.getElementById('gold-card'),
        silver: document.getElementById('silver-card')
    }
};

/**
 * Fetch metal prices
 */
async function fetchPrices() {
    console.log('Fetching live prices from CoinGecko...');

    try {
        const response = await fetch(API_CONFIG.URL);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        const goldPrice = data['pax-gold']?.usd;
        const silverPrice = data['kinesis-silver']?.usd;

        const updateData = {
            gold: {
                price: goldPrice ? goldPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---.--',
                timestamp: new Date().toLocaleTimeString()
            },
            silver: {
                price: silverPrice ? silverPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---.--',
                timestamp: new Date().toLocaleTimeString()
            }
        };

        updateUI(updateData.gold, updateData.silver);
    } catch (error) {
        console.error('Error fetching prices:', error);
        // Don't overwrite with 'Error' immediately to keep last known price visible if possible
        // but for now, we'll indicate status
        document.getElementById('gold-status').textContent = 'API Error';
        document.getElementById('silver-status').textContent = 'API Error';
    }
}

/**
 * Update the UI with new data
 */
function updateUI(gold, silver) {
    // Check if values changed to trigger animation
    const goldChanged = UI.goldPrice.textContent !== gold.price;
    const silverChanged = UI.silverPrice.textContent !== silver.price;

    UI.goldPrice.textContent = gold.price;
    UI.silverPrice.textContent = silver.price;

    UI.goldTime.textContent = `Last updated: ${gold.timestamp}`;
    UI.silverTime.textContent = `Last updated: ${silver.timestamp}`;

    if (goldChanged) {
        UI.cards.gold.classList.remove('pulse');
        void UI.cards.gold.offsetWidth; // Trigger reflow
        UI.cards.gold.classList.add('pulse');
    }

    if (silverChanged) {
        UI.cards.silver.classList.remove('pulse');
        void UI.cards.silver.offsetWidth; // Trigger reflow
        UI.cards.silver.classList.add('pulse');
    }
}

/**
 * Initialize the application
 */
function init() {
    fetchPrices();

    UI.refreshBtn.addEventListener('click', () => {
        // Simple rotation animation for the icon
        const icon = UI.refreshBtn.querySelector('svg');
        icon.style.transition = 'transform 0.5s ease';
        icon.style.transform = 'rotate(360deg)';

        fetchPrices().then(() => {
            setTimeout(() => {
                icon.style.transition = 'none';
                icon.style.transform = 'rotate(0deg)';
            }, 500);
        });
    });

    // Auto refresh
    setInterval(fetchPrices, API_CONFIG.REFRESH_INTERVAL);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
