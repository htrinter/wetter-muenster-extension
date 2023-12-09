chrome.runtime.onStartup.addListener(function() {
	update();
});

chrome.runtime.onInstalled.addListener(function() {
	update();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.greeting === 'update') {
		update();
		sendResponse({ reply: "updated" });
		return true;
	}
});

function update() {
	chrome.action.setBadgeBackgroundColor({ color: [54, 163, 237, 255] });

	chrome.storage.local.get('weather_temperature', function(result) {
		chrome.action.setBadgeText({ text: result.weather_temperature || '' });
	});

	chrome.alarms.clearAll();

	chrome.alarms.onAlarm.addListener(function(alarm) {
		fetchWeatherData();
	});

	chrome.alarms.create({ when: Date.now(), periodInMinutes: 10.0 });
}

function fetchWeatherData() {
	fetch('https://www.uni-muenster.de/Klima/wetter/wetter.php')
		.then(response => response.text())
		.then(data => {
			const weatherStart = data.indexOf('<table class="weather">');
			const weatherEnd = data.indexOf('</table>', weatherStart) + 8;
			const weatherData = data.slice(weatherStart, weatherEnd);

			const temperatureSelector = '<td class="data tab4" style="text-align:right;">';
			const temperatureStart = data.indexOf(temperatureSelector) + temperatureSelector.length;
			const temperatureEnd = data.indexOf('</td>', temperatureStart);
			const weatherTemperature = data.slice(temperatureStart, temperatureEnd);

			if (weatherTemperature && weatherData) {
				chrome.storage.local.set({ 'weather': weatherData });
				chrome.storage.local.set({ 'weather_temperature': weatherTemperature }, function() {
					chrome.storage.local.get('weather_temperature', function(result) {
						chrome.action.setBadgeText({ text: result.weather_temperature || '' });
					});
				});
			}
		})
		.catch(error => console.error('Error fetching weather data:', error));
}

update();
