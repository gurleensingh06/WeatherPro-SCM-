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

        const aqiBadgeElement = document.getElementById('aqi-badge');
        const aqiSimpleElement = document.getElementById('aqi-simple');
        const aqiValueElement = document.getElementById('aqi-value');
        const aqiLevelElement = document.getElementById('aqi-level');
        const aqiDescriptionElement = document.getElementById('aqi-description');
        const aqiPollutantsElement = document.getElementById('aqi-pollutants');

        const forecastTitleElement = document.getElementById('forecast-title');
        const todayForecastElement = document.getElementById('today-forecast');
        const hourlyForecastElement = document.getElementById('hourly-forecast');
        const dailyForecastElement = document.getElementById('daily-forecast');


        const feelsLikeElement = document.getElementById('feels-like');
        const sunriseElement = document.getElementById('sunrise');
        const sunsetElement = document.getElementById('sunset');
        const sunIndicatorElement = document.getElementById('sun-indicator');
        const highLowDetailElement = document.getElementById('high-low-detail');
        const windElement = document.getElementById('wind');
        const humidityDetailElement = document.getElementById('humidity-detail');
        const dewPointElement = document.getElementById('dew-point');
        const pressureElement = document.getElementById('pressure');
        const uvIndexElement = document.getElementById('uv-index');
        const visibilityElement = document.getElementById('visibility');
        const cloudsElement = document.getElementById('clouds');

        let currentCity = '';
        let currentWeatherData = null;
        let forecastData = null;
        let aqiData = null;
        let isDarkMode = localStorage.getItem('darkMode') === 'true';