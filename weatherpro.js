    // Replace with your own OpenWeatherMap API key
    const API_KEY = 'YOUR_API_KEY_HERE';
    const BASE_URL = 'https://api.openweathermap.org/data/2.5';
    const AQI_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';

const loadingElement = document.getElementById('loading');
        const errorElement = document.getElementById('error-message');
        const errorTextElement = document.getElementById('error-text');
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const getLocationButton = document.getElementById('get-location');
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const toastContainer = document.getElementById('toast-container');

        const locationNameElement = document.getElementById('location-name');
        const currentTimeElement = document.getElementById('current-time');
        const currentTempElement = document.getElementById('current-temp');
        const weatherConditionElement = document.getElementById('weather-condition');
        const weatherIconElement = document.getElementById('weather-icon');
        const tempHighElement = document.getElementById('temp-high');
        const tempLowElement = document.getElementById('temp-low');
        const windSpeedElement = document.getElementById('wind-speed');
        const humidityElement = document.getElementById('humidity');
        const uvIndexSimpleElement = document.getElementById('uv-index-simple');