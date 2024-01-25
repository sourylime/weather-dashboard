document.addEventListener('DOMContentLoaded', function () {
    const previousSearchesContainer = document.getElementById('previousSearches');
    function searchWeather() {
        const apiKey = '0dd586f210b28d8330723eaa3c27ce58';
        const endpoint = 'https://corsproxy.io/?' + encodeURIComponent('https://api.openweathermap.org/data/2.5/forecast')

        const cityInput = document.getElementById('cityInput');
        const forecastContainer = document.getElementById('weatherForecast');



        const city = cityInput.value;

        if (!city) {
            alert('Please enter a city name.');
            return;
        }

        fetch(`${endpoint}?q=${city}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {

                const forecasts = data.list;

                let currentDate = null;  // Track the current date to display it only once

                forecasts.forEach(forecast => {
                    const date = new Date(forecast.dt * 1000);
                    const temperature = forecast.main.temp;
                    const description = forecast.weather[0].description;
                    const temperatureCelsius = forecast.main.temp - 273.15; // Convert Kelvin to Celsius
                    const temperatureFahrenheit = (temperatureCelsius * 9 / 5) + 32; // Convert Celsius to Fahrenheit


                    if (date.getDate() !== currentDate?.getDate()) {
                        // Display the date only once for each day
                        currentDate = date;
                        const forecastElement = document.createElement('div');
                        forecastElement.classList.add('forecastDay');
                        forecastElement.innerHTML = `
                            <p>Date: ${date.toLocaleDateString()}</p>
                            <p>Temperature: ${temperatureCelsius.toFixed(2)} ℃ (${temperatureFahrenheit.toFixed(2)} ℉)</p>
                            <p>Description: ${description}</p>
                            <hr>
                        `;
                        forecastContainer.appendChild(forecastElement);
                    }
                });

                storeCitySearch(city);

                displayPreviousSearches();
            })


            .catch(error => console.error('Error fetching weather data:', error));
    }

    function storeCitySearch(city) {
        // Get existing searches from local storage or initialize an empty array
        const previousSearches = JSON.parse(localStorage.getItem('previousSearches')) || [];
        // Add the new search to the array
        previousSearches.push(city);
        // Save the updated array back to local storage
        localStorage.setItem('previousSearches', JSON.stringify(previousSearches));
    }

    function displayPreviousSearches() {
        // Clear previous searches container
        previousSearchesContainer.innerHTML = '';

        // Get previous searches from local storage
        const previousSearches = JSON.parse(localStorage.getItem('previousSearches')) || [];

        // Display each previous search
        previousSearches.forEach(search => {
            const searchElement = document.createElement('div');
            searchElement.classList.add('previousSearch');
            searchElement.textContent = search;
            previousSearchesContainer.appendChild(searchElement);
        });
    }

    const searchButton = document.getElementById('searchButton');

    // Add event listener for clicking the button
    searchButton.addEventListener('click', searchWeather);

    // Add event listener for pressing Enter
    const cityInput = document.getElementById('cityInput');
    cityInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            searchWeather();
        }
    });
});