import { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import "../css/ThemeToggle.css";

const ThemeToggle = () => {
  const [theme, setTheme] = useLocalStorage("theme", "auto");
  const [systemTheme, setSystemTheme] = useState("light");
  const [isOpen, setIsOpen] = useState(false);

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handleChange = (e) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const actualTheme = theme === "auto" ? systemTheme : theme;

    root.setAttribute("data-theme", actualTheme);
    root.className = actualTheme;

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        actualTheme === "dark" ? "#1a202c" : "#ffffff"
      );
    }
  }, [theme, systemTheme]);

  const themes = [
    {
      id: "light",
      name: "Light",
      icon: "☀️",
      description: "Bright and clean",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: "dark",
      name: "Dark",
      icon: "🌙",
      description: "Easy on the eyes",
      gradient: "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
    },
    {
      id: "auto",
      name: "Auto",
      icon: "🔄",
      description: "Follow system",
      gradient: "linear-gradient(135deg, #667eea 0%, #2d3748 100%)",
    },
  ];

  const currentTheme = themes.find((t) => t.id === theme);
  const actualTheme = theme === "auto" ? systemTheme : theme;

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsOpen(false);

    // Add a subtle animation feedback
    document.body.style.transition = "background-color 0.3s ease";
    setTimeout(() => {
      document.body.style.transition = "";
    }, 300);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".theme-toggle-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="theme-toggle-container">
      <button
        className={`theme-toggle-btn ${isOpen ? "active" : ""}`}
        onClick={toggleDropdown}
        title={`Current theme: ${currentTheme?.name} ${
          theme === "auto" ? `(${systemTheme})` : ""
        }`}
      >
        <div className="theme-icon">{currentTheme?.icon}</div>
        <div className="theme-info">
          <span className="theme-name">{currentTheme?.name}</span>
          <span className="theme-status">
            {theme === "auto" ? `Auto (${systemTheme})` : actualTheme}
          </span>
        </div>
        <div className={`dropdown-arrow ${isOpen ? "rotated" : ""}`}>▼</div>
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          <div className="dropdown-header">
            <h3>Choose Theme</h3>
            <p>Select your preferred appearance</p>
          </div>

          <div className="theme-options">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                className={`theme-option ${
                  theme === themeOption.id ? "selected" : ""
                }`}
                onClick={() => handleThemeChange(themeOption.id)}
              >
                <div className="option-content">
                  <div className="option-icon">{themeOption.icon}</div>
                  <div className="option-info">
                    <span className="option-name">{themeOption.name}</span>
                    <span className="option-description">
                      {themeOption.description}
                    </span>
                    {themeOption.id === "auto" && (
                      <span className="system-info">
                        Currently: {systemTheme}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="option-preview"
                  style={{ background: themeOption.gradient }}
                ></div>
                {theme === themeOption.id && (
                  <div className="selected-indicator">✓</div>
                )}
              </button>
            ))}
          </div>

          <div className="dropdown-footer">
            <div className="theme-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">👁️</span>
                <span>Reduces eye strain</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🔋</span>
                <span>Saves battery on OLED</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🎨</span>
                <span>Matches your style</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Theme Indicator */}
      <div className="floating-indicator">
        <div className={`theme-indicator ${actualTheme}`}>
          <div className="indicator-dot"></div>
          <span className="indicator-text">{actualTheme}</span>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
