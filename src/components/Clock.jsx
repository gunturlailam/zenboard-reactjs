import { useState, useEffect } from "react";
import "../css/Clock.css";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeOfDay = () => {
    const hour = time.getHours();
    if (hour < 6) return { icon: '🌙', text: 'Dini Hari' };
    if (hour < 12) return { icon: '🌅', text: 'Pagi' };
    if (hour < 15) return { icon: '☀️', text: 'Siang' };
    if (hour < 18) return { icon: '🌤️', text: 'Sore' };
    return { icon: '🌆', text: 'Malam' };
  };

  const timeOfDay = getTimeOfDay();

  return (
    <div className="clock-container">
      <div className="time-period">
        <span className="period-icon">{timeOfDay.icon}</span>
        <span className="period-text">{timeOfDay.text}</span>
      </div>
      <div className="time-display">{formatTime(time)}</div>
      <div className="date-display">{formatDate(time)}</div>
      <div className="clock-decorations">
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>
      </div>
    </div>
  );
};

export default Clock;
