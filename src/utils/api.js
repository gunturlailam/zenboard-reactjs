/**
 * API Utilities untuk Weather App
 * Mengelola semua API calls dan data processing
 */

// Base URLs untuk berbagai weather APIs
const API_ENDPOINTS = {
  OPENWEATHER: "https://api.openweathermap.org/data/2.5",
  GEOCODING: "https://api.openweathermap.org/geo/1.0",
  ONECALL: "https://api.openweathermap.org/data/3.0",
};

/**
 * Error handler untuk API calls
 */
class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Generic fetch wrapper dengan error handling
 */
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP Error: ${response.status}`,
        response.status,
        errorData.cod
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network atau parsing errors
    throw new ApiError(
      "Koneksi bermasalah. Periksa internet Anda.",
      0,
      "NETWORK_ERROR"
    );
  }
};

/**
 * Mock data untuk demo (ketika tidak ada API key)
 */
const getMockWeatherData = (city) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: city,
        sys: { country: "ID" },
        weather: [
          {
            main: "Clouds",
            description: "berawan sebagian",
            icon: "02d",
          },
        ],
        main: {
          temp: Math.round(25 + Math.random() * 10),
          feels_like: Math.round(28 + Math.random() * 8),
          humidity: Math.round(60 + Math.random() * 30),
          pressure: Math.round(1010 + Math.random() * 20),
          temp_min: Math.round(22 + Math.random() * 5),
          temp_max: Math.round(30 + Math.random() * 8),
        },
        wind: {
          speed: Math.round((Math.random() * 5 + 1) * 10) / 10,
          deg: Math.round(Math.random() * 360),
        },
        visibility: Math.round(8000 + Math.random() * 2000),
        coord: {
          lat: -6.2 + Math.random() * 0.4,
          lon: 106.8 + Math.random() * 0.4,
        },
      });
    }, 800);
  });
};

const getMockForecastData = (city) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const forecasts = [];
      for (let i = 0; i < 40; i += 8) {
        // 5 days, every 8 hours
        forecasts.push({
          dt: Date.now() / 1000 + i * 3600,
          main: {
            temp: Math.round(25 + Math.random() * 10),
            humidity: Math.round(60 + Math.random() * 30),
          },
          weather: [
            {
              main: ["Clear", "Clouds", "Rain"][Math.floor(Math.random() * 3)],
              description: "cuaca demo",
              icon: ["01d", "02d", "10d"][Math.floor(Math.random() * 3)],
            },
          ],
        });
      }

      resolve({
        city: { name: city, country: "ID" },
        list: forecasts,
      });
    }, 1000);
  });
};

const getMockGeocodingData = (city) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: city,
          country: "ID",
          state: "Jakarta",
          lat: -6.2 + Math.random() * 0.4,
          lon: 106.8 + Math.random() * 0.4,
        },
      ]);
    }, 500);
  });
};

/**
 * Weather API Functions
 */
export const weatherApi = {
  /**
   * Get current weather by city name
   */
  getCurrentWeather: async (city, apiKey, units = "metric", lang = "id") => {
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      // Return mock data untuk demo
      return getMockWeatherData(city);
    }

    const url = `${API_ENDPOINTS.OPENWEATHER}/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=${units}&lang=${lang}`;
    return await apiRequest(url);
  },

  /**
   * Get current weather by coordinates
   */
  getCurrentWeatherByCoords: async (
    lat,
    lon,
    apiKey,
    units = "metric",
    lang = "id"
  ) => {
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      return getMockWeatherData("Current Location");
    }

    const url = `${API_ENDPOINTS.OPENWEATHER}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}&lang=${lang}`;
    return await apiRequest(url);
  },

  /**
   * Get 5-day weather forecast
   */
  getForecast: async (city, apiKey, units = "metric", lang = "id") => {
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      return getMockForecastData(city);
    }

    const url = `${API_ENDPOINTS.OPENWEATHER}/forecast?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=${units}&lang=${lang}`;
    return await apiRequest(url);
  },

  /**
   * Get city coordinates by name (geocoding)
   */
  getCityCoordinates: async (city, apiKey, limit = 5) => {
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      return getMockGeocodingData(city);
    }

    const url = `${API_ENDPOINTS.GEOCODING}/direct?q=${encodeURIComponent(
      city
    )}&limit=${limit}&appid=${apiKey}`;
    return await apiRequest(url);
  },

  /**
   * Get city name by coordinates (reverse geocoding)
   */
  getCityByCoordinates: async (lat, lon, apiKey, limit = 1) => {
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      return [{ name: "Current Location", country: "ID" }];
    }

    const url = `${API_ENDPOINTS.GEOCODING}/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${apiKey}`;
    return await apiRequest(url);
  },
};

/**
 * Geolocation utilities
 */
export const geolocationApi = {
  /**
   * Get user's current position
   */
  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation tidak didukung browser ini"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          let message = "Gagal mendapatkan lokasi";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "Akses lokasi ditolak";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Lokasi tidak tersedia";
              break;
            case error.TIMEOUT:
              message = "Timeout mendapatkan lokasi";
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  },
};

/**
 * Data processing utilities
 */
export const dataUtils = {
  /**
   * Format temperature dengan unit
   */
  formatTemperature: (temp, unit = "C") => {
    return `${Math.round(temp)}°${unit}`;
  },

  /**
   * Format wind speed
   */
  formatWindSpeed: (speed, unit = "metric") => {
    if (unit === "imperial") {
      return `${Math.round(speed)} mph`;
    }
    return `${speed} m/s`;
  },

  /**
   * Format pressure
   */
  formatPressure: (pressure) => {
    return `${pressure} hPa`;
  },

  /**
   * Format visibility
   */
  formatVisibility: (visibility) => {
    return `${(visibility / 1000).toFixed(1)} km`;
  },

  /**
   * Get weather icon URL
   */
  getWeatherIconUrl: (iconCode, size = "2x") => {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
  },

  /**
   * Convert wind direction degrees to compass
   */
  getWindDirection: (degrees) => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  },

  /**
   * Get air quality description
   */
  getAirQualityDescription: (aqi) => {
    const descriptions = {
      1: "Baik",
      2: "Cukup",
      3: "Sedang",
      4: "Buruk",
      5: "Sangat Buruk",
    };
    return descriptions[aqi] || "Tidak diketahui";
  },
};

/**
 * Cache utilities untuk optimasi
 */
export const cacheUtils = {
  /**
   * Set cache dengan expiration
   */
  setCache: (key, data, expirationMinutes = 10) => {
    const cacheData = {
      data,
      timestamp: Date.now(),
      expiration: Date.now() + expirationMinutes * 60 * 1000,
    };
    localStorage.setItem(`weather_cache_${key}`, JSON.stringify(cacheData));
  },

  /**
   * Get cache jika masih valid
   */
  getCache: (key) => {
    try {
      const cached = localStorage.getItem(`weather_cache_${key}`);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      if (Date.now() > cacheData.expiration) {
        localStorage.removeItem(`weather_cache_${key}`);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      return null;
    }
  },

  /**
   * Clear all weather cache
   */
  clearCache: () => {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("weather_cache_")) {
        localStorage.removeItem(key);
      }
    });
  },
};

export default weatherApi;
