let apiKey = "D2BKQYKBV8SF8S47J97MPHRAG"; // 👈 apni Visual Crossing key daalo

// 🎯 Icon logic
function getWeatherIcon(condition) {
    condition = condition.toLowerCase();

    if (condition.includes("cloud")) return "☁️";
    if (condition.includes("rain")) return "🌧️";
    if (condition.includes("clear")) return "☀️";
    if (condition.includes("snow")) return "❄️";
    if (condition.includes("storm")) return "⛈️";

    return "🌤️";
}

// 🎥 Background animation
function setBackground(condition) {
    let bg = document.getElementById("weather-bg");
    condition = condition.toLowerCase();
    bg.className = "";

    if (condition.includes("rain")) {
        bg.classList.add("rain");
    } else if (condition.includes("snow")) {
        bg.classList.add("snow");
    }
}

// 🔍 Search by city
function getWeather() {
    let city = document.getElementById("city").value.trim();

    if (!city) {
        document.getElementById("result").innerHTML = "⚠️ Enter city name";
        return;
    }

    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}&unitGroup=metric`;

    fetchWeather(url);
}

// 📍 Auto location
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {

            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?key=${apiKey}&unitGroup=metric`;

            fetchWeather(url);

        }, () => {
            document.getElementById("result").innerHTML = "❌ Location denied";
        });
    }
}

// 🌦️ Fetch + display
async function fetchWeather(url) {

    try {
        let res = await fetch(url);
        let data = await res.json();

        if (!data.currentConditions) {
            document.getElementById("result").innerHTML = "❌ City not found";
            return;
        }

        setBackground(data.currentConditions.conditions);

        let icon = getWeatherIcon(data.currentConditions.conditions);

        let forecast = data.days.slice(0, 5).map(day => `
            <p>📅 ${day.datetime} → 🌡️ ${day.temp}°C</p>
        `).join("");

        document.getElementById("result").innerHTML = `
            <div class="card">
                <h2>${data.address}</h2>
                <h1>${icon}</h1>
                <p>🌡️ ${data.currentConditions.temp} °C</p>
                <p>${data.currentConditions.conditions}</p>
                <p>💧 ${data.currentConditions.humidity}%</p>
                <p>🌬️ ${data.currentConditions.windspeed} km/h</p>

                <hr>
                <h3>📅 Forecast</h3>
                ${forecast}
            </div>
        `;

    } catch (error) {
        document.getElementById("result").innerHTML = "⚠️ Error fetching data";
    }
}