const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

let cityInput = "London";
const apiKey = 'a1fcd76f44ea48a5bd7175924241606';

// Preload images
const imagePreloader = new Image();
imagePreloader.src = './images/day/snowy.jpg';
imagePreloader.onload = function() {
    console.log('Snowy image loaded');
};
imagePreloader.onerror = function() {
    console.error('Failed to load snowy image');
};

const rainyImagePreloader = new Image();
rainyImagePreloader.src = './images/day/rainy.jpg';
rainyImagePreloader.onload = function() {
    console.log('Rainy image loaded');
};
rainyImagePreloader.onerror = function() {
    console.error('Failed to load rainy image');
};

// Function to fetch weather data from API
function fetchWeatherData() {
    fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityInput}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 

            // Update DOM elements with fetched data
            temp.innerHTML = data.current.temp_c + "°";
            conditionOutput.innerHTML = data.current.condition.text;
            nameOutput.innerHTML = data.location.name;
            timeOutput.innerHTML = data.location.localtime.split(' ')[1]; // Extracting time
            dateOutput.innerHTML = data.location.localtime.split(' ')[0]; // Extracting date
            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + " KM/Hr";

            // Update weather icon
            icon.innerHTML = getWeatherIcon(data.current.condition.code);

            // Determine day/night and update background image
            const isDay = data.current.is_day;
            const weatherCode = data.current.condition.code;
            updateBackground(isDay, weatherCode);

            // Fade in the app (after updating data)
            app.style.opacity = "1";
        })
        .catch(error => {
            console.log('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please try again later.');
        });
}

// Function to get appropriate weather icon based on condition code
function getWeatherIcon(code) {
    // Example mappings, you may need to expand this based on the API's condition codes
    switch (code) {
        case 1000: return '☀️'; // Sunny
        case 1003: return '🌤️'; // Partly cloudy
        case 1006: return '🌫️'; // Mist
        case 1030: return '🌫️'; // Mist
        case 1063: return '🌦️'; // Patchy rain possible
        case 1066: return '🌨️'; // Patchy snow possible
        default: return '🌍'; // Default fallback icon
    }
}

// Function to update background image based on day/night and weather condition
function updateBackground(isDay, weatherCode) {
    let timeOfDay = isDay ? 'day' : 'night';
    let backgroundImage = '';

    switch (weatherCode) {
        case 1000: backgroundImage = `url('./images/${timeOfDay}/clear.jpg')`; break;
        case 1003: backgroundImage = `url('./images/${timeOfDay}/cloudy.jpg')`; break;
        case 1063: backgroundImage = `url('./images/${timeOfDay}/rainy.jpg')`; break;
        case 1066: backgroundImage = `url('./images/${timeOfDay}/snowy.jpg')`; break;
        default: backgroundImage = `url('./images/${timeOfDay}/default.jpg')`; break;
    }

    app.style.backgroundImage = backgroundImage;
}

// Add click event to each city in the panel
cities.forEach(city => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        app.style.opacity = "0";
    });
});

// Add submit event to the form
form.addEventListener('submit', (e) => {
    if (search.value.length === 0) {
        alert('Please type in a city name');
    } else {
        cityInput = search.value;
        fetchWeatherData();
        search.value = "";
        app.style.opacity = "0";
    }
    e.preventDefault();
});


fetchWeatherData();
