async function createDivsForDays() {
    const mainContainer = document.querySelector('.main');
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((today - startDate) / oneDay));

    for (let i = 0; i <= diffDays; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.id = `day-${i + 1}`;
        dayDiv.className = 'daily-temp-div';
        var theDate = dateFromDay(2024, i + 1);

        if (isWithinLast7Days(theDate)) {
            let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(theDate);
            let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(theDate);
            let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(theDate);
            const queryday = `${year}-${month}-${day}`;

            try {
                const theTemp = await getTemperature(queryday);
                console.log(theTemp);
                dayDiv.style.backgroundColor = getColorForTemperature(theTemp);
            } catch (error) {
                //console.error('Error fetching temperature:', error);
                dayDiv.textContent = "Error loading data";
            }
        } else {
            //if not today read from JSON file
            //if today call today's current temperature.
            
        }
        
        mainContainer.appendChild(dayDiv);
    }
}


function getColorForTemperature(tempStr) {
    // Removing '°C' and converting to a float
    //const tempCelsius = parseFloat(tempStr.replace('°C', ''));

    if (tempStr < 0) {
        return '#003366'; // Deep Blue
    } else if (tempStr >= 0 && tempStr < 10) {
        return '#66CCFF'; // Light Blue
    } else if (tempStr >= 10 && tempStr < 20) {
        return '#33CC33'; // Green
    } else if (tempStr >= 20 && tempStr < 30) {
        return '#FFFF00'; // Yellow
    } else {
        return '#FF3333'; // Red
    }
}


function isWithinLast7Days(date) {
    const today = new Date();
    const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    return date >= oneWeekAgo && date <= today;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function getTemperature(thedate) {
    // First, check if data for the date exists in myTown.json
    const response = await fetch('checkDate.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: thedate })
    });

    const data = await response.json();

    if (data.exists) {
        //console.log(`Data for ${thedate} already exists.`);
        return data.avgTemp;
    } else {
        // you will need to create a config.js file and include your postal code and weatherapi api key
        // has the following format
        // var config = {
        //MY_KEY : '',
        //MY_POSTAL : ''
        //}
        const apiKey = config.MY_KEY;
        const query = config.MY_POSTAL;
        const url = `http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${query}&dt=${thedate}`;

        const apiResponse = await fetch(url);
        if (!apiResponse.ok) {
            throw new Error('Network response was not ok');
        }

        const apiData = await apiResponse.json();
        const avgTemp = apiData.forecast.forecastday[0].day.avgtemp_c;
        // Send this data to PHP to write to myTown.json
        await writeToJSONFile(thedate, avgTemp);
        return avgTemp;
    }
}

function writeToJSONFile(thedate, temp) {
    fetch('writeToFile.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: thedate, avgTemp: temp })
    })
    .then(response => response.json())
    .then(data => console.log(data.message))
    .catch(error => console.error('Error writing to file:', error));
}

function dateFromDay(year, day) {
    var date = new Date(year, 0);
    return new Date(date.setDate(day));
}
