
const API_KEY = '50b455e3eb1cc4e9a613a1a05541a2d2'; // Replace with your actual OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const getLocationButton = document.getElementById('get-location');
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

function formatTime(timestamp, timezone = 0) {
    const date = new Date(timestamp * 1000);
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleTimeString([], options);
}

function getDayName(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}


function getWeatherIcon(code, isNight = false) {
    if (code >= 200 && code < 300) return '<i class="fa-solid fa-cloud-bolt"></i>';
    if (code >= 300 && code < 400) return '<i class="fa-solid fa-cloud-rain"></i>';
    if (code >= 500 && code < 600) return '<i class="fa-solid fa-cloud-showers-heavy"></i>';
    if (code >= 600 && code < 700) return '<i class="fa-solid fa-snowflake"></i>';
    if (code >= 700 && code < 800) return '<i class="fa-solid fa-smog"></i>';
    if (code === 800) return isNight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    if (code === 801) return isNight ? '<i class="fa-solid fa-cloud-moon"></i>' : '<i class="fa-solid fa-cloud-sun"></i>';
    return '<i class="fa-solid fa-cloud"></i>';
}

function calculateDewPoint(temp, humidity) {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
    return Math.round((b * alpha) / (a - alpha));
}


function getUVIndexDescription(uvIndex) {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
}

function getAQIInfo(aqiValue) {
    switch (aqiValue) {
        case 1: return { level: 'Good', description: 'Air quality is satisfactory', className: 'good' };
        case 2: return { level: 'Moderate', description: 'Air quality is acceptable', className: 'moderate' };
        case 3: return { level: 'Unhealthy for Sensitive', description: 'Sensitive groups may be affected', className: 'unhealthy-sensitive' };
        case 4: return { level: 'Unhealthy', description: 'Everyone may be affected', className: 'unhealthy' };
        case 5: return { level: 'Very Unhealthy', description: 'Health warnings', className: 'very-unhealthy' };
        default: return { level: 'Hazardous', description: 'Health alert', className: 'hazardous' };
    }
}

function showToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div>${message}</div>
        </div>
        <div class="toast-close"><i class="fa-solid fa-xmark"></i></div>
    `;
    document.getElementById('toast-container').appendChild(toast);
    
    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
    setTimeout(() => toast.remove(), 5000);
}


async function fetchWeatherData(city) {
    try {
        const geoResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoResponse.json();
        if (!geoData.length) throw new Error('City not found');
        
        const { lat, lon } = geoData[0];

        const [current, forecast, airQuality] = await Promise.all([
            fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
            fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
            fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        ]);
        
        if (!current.ok || !forecast.ok || !airQuality.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        return {
            current: await current.json(),
            forecast: await forecast.json(),
            airQuality: await airQuality.json(),
            city: geoData[0].name,
            country: geoData[0].country
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        showToast('error', 'Error', error.message);
        return null;
    }
}

async function fetchWeatherByLocation(lat, lon) {
    try {
   
        const geoResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoResponse.json();
        if (!geoData.length) throw new Error('Location not found');
        
        return fetchWeatherData(geoData[0].name);
    } catch (error) {
        console.error('Error fetching location weather:', error);
        showToast('error', 'Error', error.message);
        return null;
    }
}

function updateCurrentWeather(data) {
    const { current, city, country } = data;
    
    locationNameElement.textContent = `${city}, ${country}`;
    currentTimeElement.textContent = `As of ${formatTime(current.dt, current.timezone)} Local Time`;
    
    const tempC = Math.round(current.main.temp - 273.15);
    currentTempElement.textContent = `${tempC}°`;
    weatherConditionElement.textContent = current.weather[0].main;
    
    tempHighElement.textContent = `${Math.round(current.main.temp_max - 273.15)}°`;
    tempLowElement.textContent = `${Math.round(current.main.temp_min - 273.15)}°`;
    
    const isNight = current.dt > current.sys.sunset || current.dt < current.sys.sunrise;
    weatherIconElement.innerHTML = getWeatherIcon(current.weather[0].id, isNight);
    
    windSpeedElement.textContent = `${Math.round(current.wind.speed * 3.6)} km/h`;
    humidityElement.textContent = `${current.main.humidity}%`;
    
    feelsLikeElement.textContent = `${Math.round(current.main.feels_like - 273.15)}°`;
    highLowDetailElement.textContent = `${Math.round(current.main.temp_max - 273.15)}°/${Math.round(current.main.temp_min - 273.15)}°`;
    windElement.textContent = `${Math.round(current.wind.speed * 3.6)} km/h`;
    humidityDetailElement.textContent = `${current.main.humidity}%`;
    dewPointElement.textContent = `${calculateDewPoint(tempC, current.main.humidity)}°`;
    pressureElement.textContent = `${current.main.pressure} hPa`;
    visibilityElement.textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    cloudsElement.textContent = `${current.clouds.all}%`;
    
    sunriseElement.textContent = formatTime(current.sys.sunrise, current.timezone);
    sunsetElement.textContent = formatTime(current.sys.sunset, current.timezone);
    
    const sunPosition = ((current.dt - current.sys.sunrise) / (current.sys.sunset - current.sys.sunrise)) * 100;
    sunIndicatorElement.style.left = `${Math.min(100, Math.max(0, sunPosition))}%`;
}

function updateForecast(data) {
    const { forecast, airQuality } = data;
    
    const uvIndex = Math.round(airQuality.list[0].main.aqi * 2.5);
    uvIndexElement.textContent = `${uvIndex} (${getUVIndexDescription(uvIndex)})`;
    uvIndexSimpleElement.textContent = `UV: ${uvIndex}`;
    
    updateTodaysForecast(forecast.list);
    
    updateHourlyForecast(forecast.list);
    
    updateDailyForecast(forecast.list);
}

function updateTodaysForecast(forecastList) {
    todayForecastElement.innerHTML = '';
    
    const periods = [
        { name: 'Morning', hour: 8 },
        { name: 'Afternoon', hour: 14 },
        { name: 'Evening', hour: 20 },
        { name: 'Night', hour: 2 }
    ];
    
    periods.forEach(period => {
        let closestForecast = forecastList[0];
        let minDiff = 24;
        
        forecastList.forEach(forecast => {
            const forecastHour = new Date(forecast.dt * 1000).getHours();
            const diff = Math.min(
                Math.abs(forecastHour - period.hour),
                24 - Math.abs(forecastHour - period.hour)
            );
            
            if (diff < minDiff) {
                minDiff = diff;
                closestForecast = forecast;
            }
        });
        
        const temp = Math.round(closestForecast.main.temp - 273.15);
        const icon = getWeatherIcon(closestForecast.weather[0].id, period.name === 'Evening' || period.name === 'Night');
        const precip = closestForecast.pop ? `${Math.round(closestForecast.pop * 100)}%` : '0%';
        
        todayForecastElement.innerHTML += `
            <div class="forecast-item">
                <div class="forecast-time">${period.name}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-temp">${temp}°</div>
                <div class="forecast-precip">
                    <i class="fa-solid fa-droplet"></i> ${precip}
                </div>
            </div>
        `;
    });
}

function updateHourlyForecast(forecastList) {
    hourlyForecastElement.innerHTML = '';
    
    forecastList.slice(0, 8).forEach(forecast => {
        const time = formatTime(forecast.dt);
        const temp = Math.round(forecast.main.temp - 273.15);
        const icon = getWeatherIcon(forecast.weather[0].id, new Date(forecast.dt * 1000).getHours() >= 18);
        const precip = forecast.pop ? `${Math.round(forecast.pop * 100)}%` : '0%';
        
        hourlyForecastElement.innerHTML += `
            <div class="hourly-item">
                <div class="forecast-time">${time}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-temp">${temp}°</div>
                <div class="forecast-precip">
                    <i class="fa-solid fa-droplet"></i> ${precip}
                </div>
            </div>
        `;
    });
}

function updateDailyForecast(forecastList) {
    dailyForecastElement.innerHTML = '';
    
    const dailyData = {};
    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        if (!dailyData[date]) {
            dailyData[date] = {
                min: forecast.main.temp_min,
                max: forecast.main.temp_max,
                weather: forecast.weather[0],
                dt: forecast.dt
            };
        } else {
            dailyData[date].min = Math.min(dailyData[date].min, forecast.main.temp_min);
            dailyData[date].max = Math.max(dailyData[date].max, forecast.main.temp_max);
        }
    });
    
    Object.values(dailyData).slice(0, 5).forEach((day, index) => {
        const dayName = index === 0 ? 'Today' : getDayName(day.dt);
        const minTemp = Math.round(day.min - 273.15);
        const maxTemp = Math.round(day.max - 273.15);
        const icon = getWeatherIcon(day.weather.id);
        
        const allMaxTemps = Object.values(dailyData).map(d => d.max - 273.15);
        const allMinTemps = Object.values(dailyData).map(d => d.min - 273.15);
        const globalMax = Math.max(...allMaxTemps);
        const globalMin = Math.min(...allMinTemps);
        const range = globalMax - globalMin;
        const barStart = ((minTemp - globalMin) / range) * 100;
        const barWidth = ((maxTemp - minTemp) / range) * 100;
        
        dailyForecastElement.innerHTML += `
            <div class="daily-item">
                <div class="daily-day">${dayName}</div>
                <div class="daily-icon">${icon}</div>
                <div class="daily-temp">
                    <span class="temp-low">${minTemp}°</span>
                    <div class="temp-bar-container">
                        <div class="temp-bar" style="margin-left: ${barStart}%; width: ${barWidth}%;"></div>
                    </div>
                    <span class="temp-high">${maxTemp}°</span>
                </div>
            </div>
        `;
    });
}

function updateAirQuality(data) {
    if (!data || !data.list || data.list.length === 0) {
        aqiBadgeElement.style.display = 'none';
        return;
    }
    
    const aqi = data.list[0].main.aqi;
    const components = data.list[0].components;
    
    const { level, description, className } = getAQIInfo(aqi);
    
    aqiBadgeElement.style.display = 'flex';
    aqiBadgeElement.className = `aqi-badge ${className}`;
    aqiSimpleElement.textContent = `AQI: ${aqi}`;
    
    aqiValueElement.textContent = aqi;
    aqiLevelElement.textContent = level;
    aqiLevelElement.className = `aqi-level ${className}`;
    aqiDescriptionElement.textContent = description;
    
    aqiPollutantsElement.innerHTML = '';
    
    const pollutants = [
        { name: 'PM2.5', value: components.pm2_5, unit: 'μg/m³' },
        { name: 'PM10', value: components.pm10, unit: 'μg/m³' },
        { name: 'O3 (Ozone)', value: components.o3, unit: 'μg/m³' },
        { name: 'NO2', value: components.no2, unit: 'μg/m³' },
        { name: 'SO2', value: components.so2, unit: 'μg/m³' },
        { name: 'CO', value: components.co, unit: 'mg/m³' }
    ];
    
    pollutants.forEach(pollutant => {
        aqiPollutantsElement.innerHTML += `
            <div class="pollutant-item">
                <div class="pollutant-name">${pollutant.name}</div>
                <div class="pollutant-value">${pollutant.value.toFixed(1)}<span class="pollutant-unit">${pollutant.unit}</span></div>
            </div>
        `;
    });
}


searchButton.addEventListener('click', async () => {
    const city = searchInput.value.trim();
    if (city) {
        const data = await fetchWeatherData(city);
        if (data) {
            updateCurrentWeather(data);
            updateForecast(data);
            updateAirQuality(data.airQuality);
        }
    }
});


searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});


getLocationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const data = await fetchWeatherByLocation(pos.coords.latitude, pos.coords.longitude);
            if (data) {
                searchInput.value = data.city;
                updateCurrentWeather(data);
                updateForecast(data);
                updateAirQuality(data.airQuality);
            }
        }, () => {
            showToast('error', 'Error', 'Could not get your location');
        });
    } else {
        showToast('error', 'Error', 'Geolocation not supported');
    }
});

window.addEventListener('load', async () => {
    const data = await fetchWeatherData('London');
    if (data) {
        updateCurrentWeather(data);
        updateForecast(data);
        updateAirQuality(data.airQuality);
    }
});