import { useState, useEffect } from "react";
import "../css/Weather.css";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("Jakarta");

  // Ganti dengan API key Anda dari OpenWeatherMap
  const API_KEY = "b8bba5f3dc96ec53bada6b7f83a901ba";

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      // Jika tidak ada API key, gunakan data mock
      if (API_KEY === "b8bba5f3dc96ec53bada6b7f83a901ba") {
        // Data mock untuk demo
        setTimeout(() => {
          const mockData = {
            name: location,
            sys: { country: "ID" },
            weather: [
              {
                description: "cerah berawan",
                icon: "02d",
              },
            ],
            main: {
              temp: 28,
              feels_like: 32,
              humidity: 75,
              pressure: 1013,
            },
            wind: {
              speed: 3.5,
            },
            visibility: 10000,
          };
          setWeather(mockData);
          setLoading(false);
        }, 1000);
        return;
      }

      // API call yang sebenarnya
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric&lang=id`;
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Gagal mengambil data cuaca");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [location]);

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const handleLocationChange = (e) => {
    e.preventDefault();
    const newLocation = e.target.location.value.trim();
    if (newLocation) {
      setLocation(newLocation);
      e.target.reset();
    }
  };

  if (loading) {
    return (
      <div className="weather-container">
        <div className="weather-card loading">
          <div className="loading-spinner"></div>
          <p>Memuat data cuaca...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-container">
        <div className="weather-card error">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Terjadi kesalahan</h3>
          <p>{error}</p>
          <button onClick={fetchWeather} className="retry-btn">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-container">
      <div className="weather-card">
        <div className="weather-header">
          <h2>Cuaca Hari Ini</h2>
          <form onSubmit={handleLocationChange} className="location-form">
            <input
              type="text"
              name="location"
              placeholder="Masukkan nama kota..."
              className="location-input"
            />
            <button type="submit" className="search-btn">
              🔍
            </button>
          </form>
        </div>

        {weather && (
          <div className="weather-content">
            <div className="weather-main">
              <div className="location-info">
                <h3>
                  {weather.name}, {weather.sys.country}
                </h3>
                <p className="weather-description">
                  {weather.weather[0].description}
                </p>
              </div>

              <div className="temperature-section">
                <img
                  src={getWeatherIcon(weather.weather[0].icon)}
                  alt={weather.weather[0].description}
                  className="weather-icon"
                />
                <div className="temperature">
                  {Math.round(weather.main.temp)}°C
                </div>
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">Terasa Seperti</span>
                <span className="detail-value">
                  {Math.round(weather.main.feels_like)}°C
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Kelembaban</span>
                <span className="detail-value">{weather.main.humidity}%</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Tekanan</span>
                <span className="detail-value">
                  {weather.main.pressure} hPa
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Kecepatan Angin</span>
                <span className="detail-value">{weather.wind.speed} m/s</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Jarak Pandang</span>
                <span className="detail-value">
                  {(weather.visibility / 1000).toFixed(1)} km
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">UV Index</span>
                <span className="detail-value">-</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
