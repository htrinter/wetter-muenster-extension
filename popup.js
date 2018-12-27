$(document).ready(function(){
	chrome.storage.local.get('weather_temperature', function(data) {
    	$('#weather_temperature').html(data.weather_temperature + ' &deg;C');
    });

	chrome.storage.local.get('weather', function(data) {
    	$('table.weather').html(data.weather);
    	$('#weather_description').html($('table.weather tr:nth-child(13) td:nth-child(3)').html());
    });

    $('#webcam_header').click(function(){
    	window.open('http://geo1-dach-kamera.uni-muenster.de/record/current.jpg');
    });

	$('#update_click').click(function(){
		$('#update_click').animate({color: '#009900'}, 1000, function(){});
		chrome.runtime.sendMessage({greeting: 'update'}, function(response) {
			$('#update_click').animate({color: '#c0c0c0'}, 1000, function(){});
		});
	});

	update();
	setInterval(update, 1000);
});

function update() {
	chrome.alarms.get(function(alarm){
	   	if(alarm != undefined) {
	   		var time = (alarm.scheduledTime-Date.now())/1000;
	   		if(time > 60) {
	   			if(Math.round(time / 60) > 1 ) {
	   				time = Math.round(time / 60) + ' Minuten.';
	   			} else {
	   				time = Math.round(time / 60) + ' Minute.';
	   			}
	   		} else {
	   			time = Math.round(time) + ' Sekunden.';
	   		}
	   		$('#status_info').html('Aktualisierung in ' + time);
	   		chrome.storage.local.get('weather', function(data) {
    			if(data.weather != $('table.weather').html()){
    				$('table.weather').html(data.weather);
    				chrome.storage.local.get('weather_temperature', function(data) {
    					$('#weather_temperature').html(data.weather_temperature + ' &deg;C');
    				});
    				$('#weather_description').html($('table.weather tr:nth-child(13) td:nth-child(3)').html());
    			}
    		});
	   	}
    });
}