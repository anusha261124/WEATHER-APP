export default async function handler(req, res) {
  const { endpoint = 'current', location, days, date, units = 'm' } = req.query;

  const API_KEY = process.env.WEATHERSTACK_KEY;

  if (!location) {
    return res.status(400).json({ error: "Location required" });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    let url;
    
    switch (endpoint) {
      case 'current':
        url = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${encodeURIComponent(location)}&units=${units}`;
        break;
      case 'forecast':
        url = `http://api.weatherstack.com/forecast?access_key=${API_KEY}&query=${encodeURIComponent(location)}&forecast_days=${days || 7}&units=${units}`;
        break;
      case 'historical':
        url = `http://api.weatherstack.com/historical?access_key=${API_KEY}&query=${encodeURIComponent(location)}&historical_date=${date}&units=${units}`;
        break;
      case 'marine':
        url = `http://api.weatherstack.com/marine?access_key=${API_KEY}&query=${encodeURIComponent(location)}&units=${units}`;
        break;
      case 'autocomplete':
        url = `http://api.weatherstack.com/autocomplete?access_key=${API_KEY}&query=${encodeURIComponent(location)}`;
        break;
      default:
        return res.status(400).json({ error: "Invalid endpoint" });
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Weather API error:', error);
    return res.status(500).json({ error: "Server error", message: error.message });
  }
}
