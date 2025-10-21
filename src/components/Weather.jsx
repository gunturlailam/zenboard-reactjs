import { useState, useEffect } from "react";
import "../css/Weather.css";
import useLocalStorage from "../hooks/useLocalStorage";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gunakan localStorage untuk menyimpan lokasi favorit user
  const [location, setLocation] = useLocalStorage("weatherLocation", "Jakarta");
  const [apiKey, setApiKey] = useLocalStorage(
    "weatherApiKey",
    "YOUR_API_KEY_HERE"
  );
  const [weatherHistory, setWeatherHistory] = useLocalStorage(
    "weatherHistory",
    []
  );

  // API key dari localStorage atau default
  const API_KEY = apiKey;

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      // Jika tidak ada API key yang valid, gunakan data mock
      if (API_KEY === "YOUR_API_KEY_HERE") {
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
              temp: Math.round(25 + Math.random() * 10),
              feels_like: Math.round(28 + Math.random() * 8),
              humidity: Math.round(60 + Math.random() * 30),
              pressure: Math.round(1010 + Math.random() * 20),
            },
            wind: {
              speed: Math.round((Math.random() * 5 + 1) * 10) / 10,
              deg: Math.round(Math.random() * 360)
            },
            visibility: Math.round(8000 + Math.random() * 2000),
          };
          setWeather(mockData);
          setLoading(false);
          
          // Simpan ke history
          const newHistory = [
            location,
            ...weatherHistory.filter((loc) => loc !== location),
          ].slice(0, 5);
          setWeatherHistory(newHistory);
        }, 1000);
        return;
      }

      // API call yang sebenarnya
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric&lang=id`;
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error("Gagal mengambil data cuaca. Periksa API key atau nama kota.");
      }

      const data = await response.json();
      setWeather(data);

      // Simpan ke history (maksimal 5 lokasi terakhir)
      const newHistory = [
        location,
        ...weatherHistory.filter((loc) => loc !== location),
      ].slice(0, 5);
      setWeatherHistory(newHistory);
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

  const handleApiKeyChange = (e) => {
    e.preventDefault();
    const newApiKey = e.target.apikey.value.trim();
    if (newApiKey) {
      setApiKey(newApiKey);
      e.target.reset();
      alert("API Key berhasil disimpan!");
    }
  };

  const selectHistoryLocation = (historyLocation) => {
    setLocation(historyLocation);
  };

  const clearHistory = () => {
    setWeatherHistory([]);
  };

  const getCurrentLocationWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user location
      if (!navigator.geolocation) {
        throw new Error('Geolocation tidak didukung browser ini');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            if (API_KEY === "YOUR_API_KEY_HERE") {
              // Mock data untuk lokasi saat ini
              const mockData = {
                name: "Lokasi Saat Ini",
                sys: { country: "ID" },
                weather: [{ description: "cerah", icon: "01d" }],
                main: {
                  temp: Math.round(25 + Math.random() * 10),
                  feels_like: Math.round(28 + Math.random() * 8),
                  humidity: Math.round(60 + Math.random() * 30),
                  pressure: Math.round(1010 + Math.random() * 20),
                },
                wind: { speed: Math.round((Math.random() * 5 + 1) * 10) / 10 },
                visibility: Math.round(8000 + Math.random() * 2000),
              };
              setWeather(mockData);
              setLocation("Lokasi Saat Ini");
              setLoading(false);
              return;
            }

            // Real API call
            const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=id`;
            const response = await fetch(API_URL);
            
            if (!response.ok) {
              throw new Error("Gagal mengambil data cuaca untuk lokasi ini");
            }
            
            const data = await response.json();
            setWeather(data);
            setLocation(data.name);
            setLoading(false);
          } catch (err) {
            setError(`Lokasi: ${err.message}`);
            setLoading(false);
          }
        },
        (error) => {
          let message = 'Gagal mendapatkan lokasi';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Akses lokasi ditolak';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Lokasi tidak tersedia';
              break;
            case error.TIMEOUT:
              message = 'Timeout mendapatkan lokasi';
              break;
          }
          setError(`Lokasi: ${message}`);
          setLoading(false);
        }
      );
    } catch (err) {
      setError(`Lokasi: ${err.message}`);
      setLoading(false);
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
          <div className="search-controls">
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
            <button
              onClick={getCurrentLocationWeather}
              className="location-btn"
              title="Gunakan lokasi saat ini"
            >
              📍
            </button>
          </div>
        </div>

        {/* API Key Settings */}
        {API_KEY === "YOUR_API_KEY_HERE" && (
          <div className="api-key-section">
            <p className="api-notice">
              💡 Untuk data cuaca real-time, masukkan API key dari
              OpenWeatherMap
            </p>
            <form onSubmit={handleApiKeyChange} className="api-form">
              <input
                type="text"
                name="apikey"
                placeholder="Masukkan API key..."
                className="api-input"
              />
              <button type="submit" className="api-btn">
                Simpan
              </button>
            </form>
          </div>
        )}

        {/* Location History */}
        {weatherHistory.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <span>Lokasi Terakhir:</span>
              <button onClick={clearHistory} className="clear-btn">
                Hapus
              </button>
            </div>
            <div className="history-list">
              {weatherHistory.map((historyLocation, index) => (
                <button
                  key={index}
                  onClick={() => selectHistoryLocation(historyLocation)}
                  className={`history-item ${
                    location === historyLocation ? "active" : ""
                  }`}
                >
                  {historyLocation}
                </button>
              ))}
            </div>
          </div>
        )}

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