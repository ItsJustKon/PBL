var userPosition = null;
var realData = null;
var l = 0;
function tryNowFunction() {
    getLocation()
        .then((wasSuccessful) => {
            if (wasSuccessful) {
                console.log("IT WORKED");
                localStorage.setItem("userLat", userPosition.coords.latitude)
                localStorage.setItem("userLong", userPosition.coords.longitude)
                console.log(userPosition.coords)
                window.location.href = "main.html";
            } else {
                console.log("IT FAILED");
            }
        });
}

function getLocation() {
    return new Promise((resolve) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userPosition = position;
                    alert("Latitude: " + position.coords.latitude +
                        "<br>Longitude: " + position.coords.longitude);
                    resolve(true);
                },
                () => {
                    alert("Sorry, no position available.");
                    resolve(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            resolve(false);
        }
    });
}

function getWeatherInfo() {

    console.log("hello");
    const userLat = localStorage.getItem("userLat");
    const userLong = localStorage.getItem("userLong");
    console.log(userLat)
    console.log(userLong)
    const apiUrl = 'https://api.weather.gov/points/' + userLat + ',' + userLong;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // or response.text() for non-JSON responses
        })
        .then(data => {
            console.log('Data received:', data);
            realData = data;
            fetch(realData.properties.forecastHourly)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // or response.text() for non-JSON responses
                })
                .then(data => {
                    console.log('Data received:', data);
                    realData = data;
                    displayInfo()
                    // realData.properties.forecastHourly for the url
                    // Process the data
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    // Handle errors
                });

            // realData.properties.forecastHourly for the url
            // Process the data
        })
        .catch(error => {
            console.error('Fetch error:', error);
            // Handle errors
        });

}

function displayInfo() {
    const container = document.querySelectorAll(".reportContainer")
    const report = document.querySelector(".report")
    for (let i = 0; i < 11; i++) {
        const newReport = report.cloneNode(true);
        const data_column = newReport.children;
        console.log(realData.properties.periods[i].isDaytime)
        data_column[0].getElementsByTagName('h6')[0].textContent = extractTime(realData.properties.periods[l].endTime);
        data_column[0].getElementsByTagName("i")[0].className = dayOrNight(realData.properties.periods[l].isDaytime);
        data_column[1].getElementsByTagName('h6')[0].textContent = realData.properties.periods[l].temperature + realData.properties.periods[l].temperatureUnit;
        data_column[1].getElementsByTagName('i')[0].className = categorizeTemperature(realData.properties.periods[l].temperature);
        data_column[2].getElementsByTagName('h6')[0].textContent = realData.properties.periods[l].windSpeed;
        data_column[3].getElementsByTagName('h6')[0].textContent = realData.properties.periods[l].probabilityOfPrecipitation.value + '%';
        data_column[4].getElementsByTagName('h7')[0].textContent = "None: " + realData.properties.periods[l].shortForecast;
        newReport.style = "visibility: visible"
        container[0].appendChild(newReport);
        l++
        // const h6Element = newElement.getElementsByTagName('h6')[0];
        // 0    Time
        // 1    Temperature
        // 2    Wind
        // 3    Rain
        // 4    Hurricane
        // 5    Tornadoes

       console.log(assessCriticalWeather(realData.properties.periods[l].temperature, realData.properties.periods[l].probabilityOfPrecipitation.value, realData.properties.periods[l].windSpeed, realData.properties.periods[0].relativeHumidity.value));
    }

    // container[1].querySelector(".report").children[0].getElementsByTagName("h5")[0].textContent = "Success"
}

function extractTime(dateString) {
    // Create a Date object from the input string
    let date = new Date(dateString);

    // Extract the time in HH:MM AM/PM format
    let time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return time;
}

function dayOrNight(isItDay) {
    if (isItDay) {
        return "fa-solid fa-sun"
    } else {
        return "fas fa-moon"
    }
}

function categorizeTemperature(temp) {
    if (temp < 55) {
        return "fa-solid fa-temperature-quarter";
    } else if (temp >= 55 && temp <= 75) {
        return "fa-solid fa-temperature-half";
    } else {
        return "fa-solid fa-temperature-three-quarters";
    }
}

function assessCriticalWeather(tempF, rainProb, windSpeed, humidity) {
    let weatherRisks = {};

    // Tornado likelihood - Based on high wind speeds and storm conditions
    let tornadoRisk = (windSpeed > 40 && humidity > 55 && rainProb > 50) ? (windSpeed * 0.5 + humidity * 0.3 + rainProb * 0.2) : 0;
    weatherRisks.tornado = Math.min(tornadoRisk, 100) + "%";

    // Hurricane likelihood - Based on extreme wind speeds and storm conditions
    let hurricaneRisk = (windSpeed > 75 && humidity > 70 && rainProb > 60) ? (windSpeed * 0.6 + humidity * 0.25 + rainProb * 0.15) : 0;
    weatherRisks.hurricane = Math.min(hurricaneRisk, 100) + "%";

    // Hail likelihood - Based on temperature and storm severity
    let hailRisk = (tempF < 50 && rainProb > 70 && windSpeed > 20) ? (rainProb * 0.5 + windSpeed * 0.3 + (50 - tempF) * 0.2) : 0;
    weatherRisks.hail = Math.min(hailRisk, 100) + "%";

    return weatherRisks;
}

// Example usage:
console.log(assessCriticalWeather(45, 80, 50, 60));