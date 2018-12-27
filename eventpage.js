chrome.runtime.onStartup.addListener(function(){
	update();
});
chrome.runtime.onInstalled.addListener(function(){
	update();
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.greeting == 'update') {
		update();
	}
});

update();

function update() {
	chrome.browserAction.setBadgeBackgroundColor({color: [54, 163, 237, 255]});

	chrome.storage.local.get('weather_temperature', function(result) {
        chrome.browserAction.setBadgeText({text: result.weather_temperature});
    });

	chrome.alarms.clearAll(function(){});
	
	chrome.alarms.onAlarm.addListener(function(alarm){
		$.get('https://www.uni-muenster.de/Klima/wetter/wetter.php', function(data) {
	  		var weather = $('table.weather', data).html();
	  		var weather_temperature = $('table.weather', data).find(".data.tab4").html();
	  		if(weather_temperature != undefined && weather != undefined) {
	  			chrome.storage.local.set({'weather': weather}, function(){});
	  			chrome.storage.local.set({'weather_temperature': weather_temperature.split(" ")[0].trim()}, function() {
					chrome.storage.local.get('weather_temperature', function(result){
        				chrome.browserAction.setBadgeText({text: result.weather_temperature});
    				});
	  			});
			}
		});
	});

	chrome.alarms.create({when: Date.now(), periodInMinutes: 10.0});

}