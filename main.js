var userPosition = null;
var realData = null;
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
    const container = document.querySelector(".reportContainer")
    const report = document.querySelector(".report")
    for (let i = 0; i < 11; i++) {
        const newReport = report.cloneNode(true);
        const data_column = newReport.children;

        data_column[0].getElementsByTagName('h6')[0].textContent = extractTime(realData.properties.periods[i].endTime);
        data_column[1].getElementsByTagName('h6')[0].textContent = realData.properties.periods[i].temperature + realData.properties.periods[i].temperatureUnit;
        data_column[2].getElementsByTagName('h6')[0].textContent = realData.properties.periods[i].windSpeed;
        data_column[3].getElementsByTagName('h6')[0].textContent = realData.properties.periods[i].probabilityOfPrecipitation.value+'%';
        data_column[4].getElementsByTagName('h6')[0].textContent = "bruh";
        data_column[5].getElementsByTagName('h6')[0].textContent = "bruh";
        newReport.style = "visibility: visible"
        container.appendChild(newReport);

        // const h6Element = newElement.getElementsByTagName('h6')[0];
        // 0    Time
        // 1    Temperature
        // 2    Wind
        // 3    Rain
        // 4    Hurricane
        // 5    Tornadoes


    }

    realData.properties.periods[0]
}

function extractTime(dateString) {
    // Create a Date object from the input string
    let date = new Date(dateString);

    // Extract the time in HH:MM AM/PM format
    let time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return time;
}


