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

        function kelvinToCelsius(kelvin) {
                return Math.round(kelvin - 273.15);
        }

        function formatTime(timestamp, timezone = 0) {
                const date = new Date(timestamp * 1000);
                const options = { hour: '2-digit', minute: '2-digit', hour12: true };
                return date.toLocaleTimeString([], options);
            }
    

            function formatDate(timestamp, timezone = 0) {
                const date = new Date(timestamp * 1000);
                return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            }
            
            function getDayName(timestamp, timezone = 0) {
                const date = new Date(timestamp * 1000);
                return date.toLocaleDateString('en-US', { weekday: 'long' });
            }
    

            function getHour(timestamp, timezone = 0) {
                const date = new Date(timestamp * 1000);
                return date.toLocaleTimeString([], { hour: '2-digit', hour12: true });
            }
    

            function getWeatherIcon(code, isNight = false) {

                if (code >= 200 && code < 300) {
                    return '<i class="fa-solid fa-cloud-bolt"></i>'; 
                } else if (code >= 300 && code < 400) {
                    return '<i class="fa-solid fa-cloud-rain"></i>'; 
                } else if (code >= 500 && code < 600) {
                    return '<i class="fa-solid fa-cloud-showers-heavy"></i>'; 
                } else if (code >= 600 && code < 700) {
                    return '<i class="fa-solid fa-snowflake"></i>'; 
                } else if (code >= 700 && code < 800) {
                    return '<i class="fa-solid fa-smog"></i>'; 
                } else if (code === 800) {
                    return isNight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
                } else if (code === 801) {
                    return isNight ? '<i class="fa-solid fa-cloud-moon"></i>' : '<i class="fa-solid fa-cloud-sun"></i>'; 
                } else {
                    return '<i class="fa-solid fa-cloud"></i>'; 
                }
            }
    
            function calculateDewPoint(temp, humidity) {

                const a = 17.27;
                const b = 237.7;
                const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
                return Math.round((b * alpha) / (a - alpha));
            }


            function calculateSunPosition(currentTime, sunrise, sunset) {
                const current = new Date(currentTime * 1000).getTime();
                const sunriseTime = new Date(sunrise * 1000).getTime();
                const sunsetTime = new Date(sunset * 1000).getTime();
                
                if (current < sunriseTime) return 0;
                if (current > sunsetTime) return 100;
                
                const totalDayTime = sunsetTime - sunriseTime;
                const timeSinceSunrise = current - sunriseTime;
                return Math.round((timeSinceSunrise / totalDayTime) * 100);
            }


            function getUVIndexDescription(uvIndex) {
                if (uvIndex <= 2) return 'Low';
                if (uvIndex <= 5) return 'Moderate';
                if (uvIndex <= 7) return 'High';
                if (uvIndex <= 10) return 'Very High';
                return 'Extreme';
            }



            function getAQIInfo(aqiValue) {
                let level, description, className;
                
                switch (aqiValue) {
                    case 1:
                        level = 'Good';
                        description = 'Air quality is considered satisfactory, and air pollution poses little or no risk.';
                        className = 'good';
                        break;
                    case 2:
                        level = 'Moderate';
                        description = 'Air quality is acceptable; however, some pollutants may be a concern for a small number of people.';
                        className = 'moderate';
                        break;
                    case 3:
                        level = 'Unhealthy for Sensitive Groups';
                        description = 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.';
                        className = 'unhealthy-sensitive';
                        break;
                    case 4:
                        level = 'Unhealthy';
                        description = 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.';
                        className = 'unhealthy';
                        break;
                    case 5:
                        level = 'Very Unhealthy';
                        description = 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
                        className = 'very-unhealthy';
                        break;
                    default:
                        level = 'Hazardous';
                        description = 'Health alert: everyone may experience more serious health effects.';
                        className = 'hazardous';
                }
                
                return { level, description, className };
            }
            
        
            function showLoading() {
                loadingElement.style.display = 'flex';
            }
            
           
            function hideLoading() {
                loadingElement.style.display = 'none';
            }
            
     
            function showError(message) {
                errorTextElement.textContent = message;
                errorElement.style.display = 'flex';
                setTimeout(() => {
                    errorElement.style.display = 'none';
                }, 5000);
            }
            
          
            function showToast(type, title, message) {
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                
                let icon = '';
                switch (type) {
                    case 'success':
                        icon = '<i class="fa-solid fa-circle-check toast-icon"></i>';
                        break;
                    case 'error':
                        icon = '<i class="fa-solid fa-circle-exclamation toast-icon"></i>';
                        break;
                    case 'info':
                        icon = '<i class="fa-solid fa-circle-info toast-icon"></i>';
                        break;
                    case 'warning':
                        icon = '<i class="fa-solid fa-triangle-exclamation toast-icon"></i>';
                        break;
                }
                
                toast.innerHTML = `
                    ${icon}
                    <div class="toast-content">
                        <div class="toast-title">${title}</div>
                        <div>${message}</div>
                    </div>
                    <div class="toast-close"><i class="fa-solid fa-xmark"></i></div>
                `;
                
                toastContainer.appendChild(toast);
                
      
                toast.querySelector('.toast-close').addEventListener('click', () => {
                    toast.style.animation = 'slideOutRight 0.3s ease-in-out forwards';
                    setTimeout(() => {
                        toast.remove();
                    }, 300);
                });
                
            
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.style.animation = 'slideOutRight 0.3s ease-in-out forwards';
                        setTimeout(() => {
                            if (toast.parentNode) {
                                toast.remove();
                            }
                        }, 300);
                    }
                }, 5000);
            }
            
    
            function toggleDarkMode() {
                document.body.classList.toggle('dark-mode');
                isDarkMode = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isDarkMode);
       
                darkModeToggle.innerHTML = isDarkMode ? 
                    '<i class="fa-solid fa-sun"></i>' : 
                    '<i class="fa-solid fa-moon"></i>';
            }
            
        
            async function fetchCurrentWeather(city) {
                try {
                    const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}`);
                    if (!response.ok) {
                        throw new Error('City not found. Please try another location.');
                    }
                    return await response.json();
                } catch (error) {
                    showError(error.message);
                    showToast('error', 'Error', error.message);
                    return null;
                }
            }
            
    
            async function fetchForecast(lat, lon) {
                try {
                    const response = await fetch(`${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${API_KEY}`);
                    if (!response.ok) {
                        throw new Error('Unable to fetch forecast data.');
                    }
                    return await response.json();
                } catch (error) {
                    showError(error.message);
                    showToast('error', 'Error', error.message);
                    return null;
                }
            }
            
      
            async function fetchAirQuality(lat, lon) {
                try {
                    const response = await fetch(`${AQI_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
                    if (!response.ok) {
                        throw new Error('Unable to fetch air quality data.');
                    }
                    return await response.json();
                } catch (error) {
                    console.error('Air quality error:', error);
                    return null;
                }
            }
            


            async function fetchWeatherByCoords(lat, lon) {
                try {
                    const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
                    if (!response.ok) {
                        throw new Error('Unable to fetch weather data for your location.');
                    }
                    return await response.json();
                } catch (error) {
                    showError(error.message);
                    showToast('error', 'Error', error.message);
                    return null;
                }
            }
    

            function updateCurrentWeather(data) {
                if (!data) return;
                
      
                locationNameElement.textContent = `${data.name}, ${data.sys.country}`;
                const localTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                currentTimeElement.textContent = `As of ${localTime} Local Time`;
                
                currentTempElement.textContent = `${kelvinToCelsius(data.main.temp)}°`;
                weatherConditionElement.textContent = data.weather[0].main;
                
                tempHighElement.textContent = `${kelvinToCelsius(data.main.temp_max)}°`;
                tempLowElement.textContent = `${kelvinToCelsius(data.main.temp_min)}°`;
                
                const isNight = data.dt > data.sys.sunset || data.dt < data.sys.sunrise;
                weatherIconElement.innerHTML = getWeatherIcon(data.weather[0].id, isNight);
                
                windSpeedElement.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
                humidityElement.textContent = `${data.main.humidity}%`;
                
                forecastTitleElement.textContent = `${data.name} Forecast`;
                
                feelsLikeElement.textContent = `${kelvinToCelsius(data.main.feels_like)}°`;
                highLowDetailElement.textContent = `${kelvinToCelsius(data.main.temp_max)}°/${kelvinToCelsius(data.main.temp_min)}°`;
                windElement.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
                humidityDetailElement.textContent = `${data.main.humidity}%`;
                dewPointElement.textContent = `${calculateDewPoint(kelvinToCelsius(data.main.temp), data.main.humidity)}°`;
                pressureElement.textContent = `${data.main.pressure} hPa`;
                visibilityElement.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
                cloudsElement.textContent = `${data.clouds.all}%`;
                
                sunriseElement.textContent = formatTime(data.sys.sunrise);
                sunsetElement.textContent = formatTime(data.sys.sunset);
                
                const sunPosition = calculateSunPosition(data.dt, data.sys.sunrise, data.sys.sunset);
                sunIndicatorElement.style.left = `${sunPosition}%`;
            }
            
            function updateForecast(data) {
                if (!data) return;
                
                const uvIndex = Math.round(data.current.uvi);
                uvIndexElement.textContent = `${uvIndex} (${getUVIndexDescription(uvIndex)})`;
                uvIndexSimpleElement.textContent = `UV: ${uvIndex}`;
                
                todayForecastElement.innerHTML = '';
                hourlyForecastElement.innerHTML = '';
                dailyForecastElement.innerHTML = '';
                
                const currentHour = new Date().getHours();
                
                const morningHour = 8;
                const afternoonHour = 14;
                const eveningHour = 20;
                const nightHour = 2;
                
                let morningForecast = null;
                let afternoonForecast = null;
                let eveningForecast = null;
                let nightForecast = null;
                
                for (let i = 0; i < Math.min(24, data.hourly.length); i++) {
                    const forecastHour = new Date(data.hourly[i].dt * 1000).getHours();
                    
                    if (!morningForecast && Math.abs(forecastHour - morningHour) <= 2) {
                        morningForecast = data.hourly[i];
                    }
                    if (!afternoonForecast && Math.abs(forecastHour - afternoonHour) <= 2) {
                        afternoonForecast = data.hourly[i];
                    }
                    if (!eveningForecast && Math.abs(forecastHour - eveningHour) <= 2) {
                        eveningForecast = data.hourly[i];
                    }
                    if (!nightForecast && Math.abs(forecastHour - nightHour) <= 2) {
                        nightForecast = data.hourly[i];
                    }
                }
                
                if (!morningForecast) morningForecast = data.hourly[0];
                if (!afternoonForecast) afternoonForecast = data.hourly[Math.min(6, data.hourly.length - 1)];
                if (!eveningForecast) eveningForecast = data.hourly[Math.min(12, data.hourly.length - 1)];
                if (!nightForecast) nightForecast = data.hourly[Math.min(18, data.hourly.length - 1)];


                const periods = [
                    { name: 'Morning', data: morningForecast },
                    { name: 'Afternoon', data: afternoonForecast },
                    { name: 'Evening', data: eveningForecast },
                    { name: 'Overnight', data: nightForecast }
                ];
                
                periods.forEach(period => {
                    const isNight = period.name === 'Evening' || period.name === 'Overnight';
                    const temp = kelvinToCelsius(period.data.temp);
                    const icon = getWeatherIcon(period.data.weather[0].id, isNight);
                    const precip = period.data.pop ? `${Math.round(period.data.pop * 100)}%` : '0%';
                    
                    const periodHTML = `
                        <div class="forecast-item">
                            <div class="forecast-time">${period.name}</div>
                            <div class="forecast-icon">${icon}</div>
                            <div class="forecast-temp">${temp}°</div>
                            <div class="forecast-precip">
                                <i class="fa-solid fa-droplet"></i> ${precip}
                            </div>
                        </div>
                    `;
                    
                    todayForecastElement.innerHTML += periodHTML;
                });



                for (let i = 0; i < Math.min(24, data.hourly.length); i++) {
                    const hour = getHour(data.hourly[i].dt);
                    const temp = kelvinToCelsius(data.hourly[i].temp);
                    const isNight = new Date(data.hourly[i].dt * 1000).getHours() >= 18 || new Date(data.hourly[i].dt * 1000).getHours() < 6;
                    const icon = getWeatherIcon(data.hourly[i].weather[0].id, isNight);
                    const precip = data.hourly[i].pop ? `${Math.round(data.hourly[i].pop * 100)}%` : '0%';
                    
                    const hourlyHTML = `
                        <div class="hourly-item">
                            <div class="forecast-time">${hour}</div>
                            <div class="forecast-icon">${icon}</div>
                            <div class="forecast-temp">${temp}°</div>
                            <div class="forecast-precip">
                                <i class="fa-solid fa-droplet"></i> ${precip}
                            </div>
                        </div>
                    `;
                    
                    hourlyForecastElement.innerHTML += hourlyHTML;
                }


                for (let i = 0; i < Math.min(7, data.daily.length); i++) {
                    const day = i === 0 ? 'Today' : getDayName(data.daily[i].dt);
                    const icon = getWeatherIcon(data.daily[i].weather[0].id);
                    const tempMax = kelvinToCelsius(data.daily[i].temp.max);
                    const tempMin = kelvinToCelsius(data.daily[i].temp.min);
                    const precip = data.daily[i].pop ? `${Math.round(data.daily[i].pop * 100)}%` : '0%';
                    
                    const allTemps = data.daily.map(d => kelvinToCelsius(d.temp.max));
                    const maxTemp = Math.max(...allTemps);
                    const minTemp = Math.min(...allTemps.map((_, i) => kelvinToCelsius(data.daily[i].temp.min)));
                    const range = maxTemp - minTemp;
                    const barStart = ((tempMin - minTemp) / range) * 100;
                    const barWidth = ((tempMax - tempMin) / range) * 100;
                    
                    const dailyHTML = `
                        <div class="daily-item">
                            <div class="daily-day">${day}</div>
                            <div class="daily-icon">${icon}</div>
                            <div class="daily-temp">
                                <span class="temp-low">${tempMin}°</span>
                                <div class="temp-bar-container">
                                    <div class="temp-bar" style="margin-left: ${barStart}%; width: ${barWidth}%;"></div>
                                </div>
                                <span class="temp-high">${tempMax}°</span>
                            </div>
                        </div>
                    `;
                    
                    dailyForecastElement.innerHTML += dailyHTML;
                }
            }
    