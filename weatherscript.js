const apiKey = "c6d36775b35bc542e7d9989322e5de1b";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const unsplashApiKey = "2SzGWO32QYy3AAp-MmpD171w8V7SB0n6Uu4uB9GV-_M";

const inputBox = document.querySelector('.inputField input');
const searchButton = document.querySelector('.inputField button');
const weatherIcon = document.querySelector('.weather-icon');
const weatherContainer = document.querySelector('.weather');

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector('.error').style.display = 'block';
        setTimeout(() => {
            document.querySelector('.error').innerHTML = '';
        }, 3000);
    } else {
        const data = await response.json();
        console.log(data);
        displayWeatherData(data);
        const backgroundImageUrl = await fetchBackgroundImage(city); 
        document.body.style.backgroundImage = `url('${backgroundImageUrl}')`; 
        document.body.style.backgroundSize = 'cover';
    }
}

async function fetchWeatherByCoordinates(latitude, longitude) {
    const response = await fetch(`${apiUrl}&lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
    const data = await response.json();
    console.log(data);
    displayWeatherData(data);
}

async function fetchBackgroundImage(location) {
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${location}&client_id=${unsplashApiKey}`);
    const data = await response.json();
    return data.urls.regular;
}

function displayWeatherData(data) {
    document.querySelector('.city').innerHTML = data.name;
    document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector('.humidityPercent').innerHTML = data.main.humidity + "%";
    document.querySelector('.windSpeed').innerHTML = data.wind.speed + "km/h";

    
    setWeatherIcon(data.weather[0].main);

    inputBox.value = '';

    weatherContainer.classList.add('show');
}

function setWeatherIcon(weatherCondition) {
    switch (weatherCondition) {
        case 'Clouds':
            weatherIcon.src = 'images/clouds.png';
            break;
        case 'Clear':
            weatherIcon.src = 'images/clear.png';
            break;
        case 'Drizzle':
        case 'Haze':
            weatherIcon.src = 'images/drizzle.png';
            break;
        case 'Mist':
            weatherIcon.src = 'images/mist.png';
            break;
        case 'Rain':
            weatherIcon.src = 'images/rain.png';
            break;
        case 'Snow':
            weatherIcon.src = 'images/snow.png';
            break;
        case 'Windy':
            weatherIcon.src = 'images/windy1.png';
            break;
        default:
            break;
    }
}

searchButton.addEventListener('click', () => {
    checkWeather(inputBox.value);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkWeather(inputBox.value);
    }
});


window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoordinates(latitude, longitude);
            fetchBackgroundImageByCoordinates(latitude, longitude);
        }, error => {
            console.error("Error getting geolocation:", error);
            alert("Geolocation is required to fetch weather data. Please enable geolocation or enter a location manually.");
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        alert("Geolocation is not supported by this browser. Please enter a location manually.");
    }
});

async function fetchBackgroundImageByCoordinates(latitude, longitude) {
    const response = await fetch(`${apiUrl}&lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
    const data = await response.json();
    const backgroundImageUrl = await fetchBackgroundImage(data.name);
    document.body.style.backgroundImage = `url('${backgroundImageUrl}')`;
    document.body.style.backgroundSize = 'cover';
}
