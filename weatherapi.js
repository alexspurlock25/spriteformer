const ROOT_URL = 'https://api.open-meteo.com/v1/forecast'
const location = {
    cincinnati: {
        lat: '39.10',
        lon: '-84.51'
    }
}

export async function getWeatherCode() {
    // see: https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
    const data = await fetch(
        `${ROOT_URL}?latitude=${location.cincinnati.lat}&longitude=${location.cincinnati.lon}&daily=weather_code&timezone=America%2FNew_York&forecast_days=1`
    ).then(response => {
        return response.json()
    })

    return data["daily"]["weather_code"][0]
}