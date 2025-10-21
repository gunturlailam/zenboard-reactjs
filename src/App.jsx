import { useState, useEffect } from "react";
import "./App.css";
import Clock from "./components/Clock";
import Weather from "./components/Weather";
import Quote from "./components/Quote";
import TodoList from "./components/TodoList";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "Friend"
  );
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNameChange = (newName) => {
    if (newName.trim()) {
      setUserName(newName.trim());
      localStorage.setItem("userName", newName.trim());
    }
    setIsEditingName(false);
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="app-container">
      {/* Background Elements */}
      <div className="app-background">
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
        <div className="bg-gradient-3"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Main Content */}
      <main className="app-main-simple">
        {/* Header */}
        <header className="app-header-simple">
          <div className="header-content-simple">
            <div className="greeting-section">
              <h1 className="greeting-text">
                {getGreeting()}, {userName}! 👋
              </h1>
              <p className="greeting-subtitle">
                Welcome back to your personal dashboard
              </p>
            </div>

            <div className="user-profile-header">
              <div className="user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                {isEditingName ? (
                  <input
                    type="text"
                    defaultValue={userName}
                    onBlur={(e) => handleNameChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNameChange(e.target.value);
                      if (e.key === "Escape") setIsEditingName(false);
                    }}
                    className="name-input"
                    autoFocus
                  />
                ) : (
                  <span
                    className="user-name"
                    onClick={() => setIsEditingName(true)}
                  >
                    {userName}
                  </span>
                )}
                <span className="user-status">Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="app-content-simple">
          <div className="dashboard-simple">
            {/* Main Horizontal Layout */}
            <div className="horizontal-grid">
              {/* Left Column - Clock & Weather */}
              <div className="left-column">
                <div className="widget-container clock-widget horizontal-widget">
                  <div className="widget-header">
                    <h3>🕐 Current Time</h3>
                    <span className="widget-badge live">Live</span>
                  </div>
                  <div className="widget-content">
                    <Clock />
                  </div>
                </div>

                <div className="widget-container weather-widget horizontal-widget">
                  <div className="widget-header">
                    <h3>🌤️ Weather</h3>
                    <span className="widget-badge updated">Updated</span>
                  </div>
                  <div className="widget-content">
                    <Weather />
                  </div>
                </div>
              </div>

              {/* Center Column - Quote */}
              <div className="center-column">
                <div className="widget-container quote-widget horizontal-widget tall">
                  <div className="widget-header">
                    <h3>💭 Daily Inspiration</h3>
                    <span className="widget-badge fresh">Fresh</span>
                  </div>
                  <div className="widget-content">
                    <Quote />
                  </div>
                </div>
              </div>

              {/* Right Column - Todo */}
              <div className="right-column">
                <div className="widget-container todo-widget horizontal-widget tall">
                  <div className="widget-header">
                    <h3>✅ Your Tasks</h3>
                    <span className="widget-badge active">Active</span>
                  </div>
                  <div className="widget-content">
                    <TodoList />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Stats Row */}
            <div className="stats-row-horizontal">
              <div className="stat-card-mini">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <span className="stat-number">4</span>
                  <span className="stat-label">Widgets</span>
                </div>
              </div>

              <div className="stat-card-mini">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Active</span>
                </div>
              </div>

              <div className="stat-card-mini">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <span className="stat-number">Live</span>
                  <span className="stat-label">Status</span>
                </div>
              </div>

              <div className="stat-card-mini">
                <div className="stat-icon">🚀</div>
                <div className="stat-info">
                  <span className="stat-number">Fast</span>
                  <span className="stat-label">Speed</span>
                </div>
              </div>

              <div className="stat-card-mini">
                <div className="stat-icon">🌟</div>
                <div className="stat-info">
                  <span className="stat-number">Premium</span>
                  <span className="stat-label">Quality</span>
                </div>
              </div>

              <div className="stat-card-mini">
                <div className="stat-icon">🔥</div>
                <div className="stat-info">
                  <span className="stat-number">Hot</span>
                  <span className="stat-label">Trending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="floating-actions">
        <button className="fab main-fab" title="Quick Actions">
          <span className="fab-icon">+</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="app-footer-simple">
        <div className="footer-content">
          <p>&copy; 2024 ZenBoard - Your Personal Dashboard</p>
          <div className="footer-links">
            <span>Made with ❤️</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
