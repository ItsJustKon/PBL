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

function displayInfo()
{
    const container = document.querySelector(".reportContainer")
    const report = document.querySelector(".report")
    const data_column = report.getElementsByTagName(".data-column")
    for(const i = 0; i < data_column.length; i++)
        {
            const newElement = template.cloneNode(true);
            newElement.parentElement.getElementsByTagName('h6')[0].textContent = "bruh";
            container.appendChild(template.cloneNode());

            // const h6Element = newElement.getElementsByTagName('h6')[0];
        }
    realData.properties.periods[0]
}
