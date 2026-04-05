let weatherData = null;
let sunrise= null
let sunset = null
let curr_temp = null


 const fetch24HForecast = async () => {

  try {
    const { lat, lon } = await getUserLocation();

    const query =
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/today?unitGroup=metric&include=hours%2Ccurrent&key=${process.env.API_KEY}&contentType=json`;

    const response = await fetch(query, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await response.json();
    const [forecast] = data.days;
    const hourlyForecast = forecast.hours;
    const description = forecast.description;
    const sunriseEpoch = forecast.sunriseEpoch;
    const sunsetEpoch = forecast.sunsetEpoch;

    const currWeather = data.currentConditions;

    return { hourlyForecast, description, sunrise:sunriseEpoch, sunset:sunsetEpoch, currWeather };
  } catch (e) {
    console.log(e);
  }
};

async function loadWeather(){
    const data = await fetch24HForecast();
    weatherData = data
    sunrise = data.sunrise
    sunset = data.sunset
    curr_temp = data.currWeather.feelslike
    }

const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.warn('Location access denied, falling back to Manchester');
        // Fallback to Manchester if user denies permission
        resolve({ lat: 53.4808, lon: -2.2426 });
      }
    );
  });
};

