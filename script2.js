const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

$(document).ready(function () {
	// Display weather for the default city
	weatherFn('Pune');

	// Trigger on button click
	$('#city-input-btn').on('click', function () {
		const cityName = $('#city-input').val().trim();
		if (cityName) {
			weatherFn(cityName);
		} else {
			showError('Please enter a city name.');
		}
	});

	// Allow Enter key to trigger search
	$('#city-input').on('keypress', function (e) {
		if (e.key === 'Enter') {
			$('#city-input-btn').click();
		}
	});
});

async function weatherFn(cityName) {
	const requestUrl = `${url}?q=${cityName}&appid=${apiKey}&units=metric`;

	try {
		// Hide weather info and show loading
		$('#weather-info').hide();
		showLoading();

		const response = await fetch(requestUrl);
		const data = await response.json();

		if (response.ok) {
			weatherShowFn(data);
		} else {
			showError('City not found. Please try again.');
		}
	} catch (error) {
		console.error('Error fetching weather data:', error);
		showError('Unable to fetch weather data. Please check your connection.');
	} finally {
		hideLoading();
	}
}

function weatherShowFn(data) {
	// Populate weather data in the UI
	$('#city-name').text(data.name);
	$('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
	$('#temperature').html(`${data.main.temp}°C`);
	$('#description').text(capitalizeFirstLetter(data.weather[0].description));
	$('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
	$('#weather-icon').attr(
		'src',
		`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
	);

	// Show weather info with animation
	$('#weather-info').fadeIn(500);
}

function showLoading() {
	$('#loading').fadeIn();
}

function hideLoading() {
	$('#loading').fadeOut();
}

function showError(message) {
	$('#error-message').text(message).fadeIn();

	// Automatically hide the error message after 3 seconds
	setTimeout(() => {
		$('#error-message').fadeOut();
	}, 3000);
}

// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
