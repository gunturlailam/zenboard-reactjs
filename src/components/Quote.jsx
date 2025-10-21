import { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import '../css/Quote.css';

const Quote = () => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteQuotes, setFavoriteQuotes] = useLocalStorage('favoriteQuotes', []);
  const [quoteHistory, setQuoteHistory] = useLocalStorage('quoteHistory', []);

  // Koleksi quote inspiratif dalam bahasa Indonesia
  const inspirationalQuotes = [
    {
      text: "Kesuksesan adalah kemampuan untuk bangkit dari kegagalan tanpa kehilangan semangat.",
      author: "Winston Churchill",
      category: "Motivasi"
    },
    {
      text: "Jangan menunggu kesempatan. Ciptakanlah kesempatan itu.",
      author: "George Bernard Shaw",
      category: "Kesempatan"
    },
    {
      text: "Hidup adalah 10% apa yang terjadi padamu dan 90% bagaimana kamu meresponnya.",
      author: "Charles R. Swindoll",
      category: "Kehidupan"
    },
    {
      text: "Masa depan milik mereka yang percaya pada keindahan mimpi mereka.",
      author: "Eleanor Roosevelt",
      category: "Mimpi"
    },
    {
      text: "Satu-satunya cara untuk melakukan pekerjaan hebat adalah dengan mencintai apa yang kamu lakukan.",
      author: "Steve Jobs",
      category: "Pekerjaan"
    },
    {
      text: "Keberanian bukan berarti tidak takut, tetapi menghadapi ketakutan itu.",
      author: "Nelson Mandela",
      category: "Keberanian"
    },
    {
      text: "Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia.",
      author: "Nelson Mandela",
      category: "Pendidikan"
    },
    {
      text: "Jangan biarkan kemarin menghabiskan terlalu banyak hari ini.",
      author: "Will Rogers",
      category: "Waktu"
    },
    {
      text: "Perubahan adalah hasil akhir dari semua pembelajaran sejati.",
      author: "Leo Buscaglia",
      category: "Perubahan"
    },
    {
      text: "Kamu tidak pernah terlalu tua untuk menetapkan tujuan lain atau bermimpi mimpi baru.",
      author: "C.S. Lewis",
      category: "Mimpi"
    },
    {
      text: "Kebahagiaan bukan sesuatu yang sudah jadi. Itu datang dari tindakanmu sendiri.",
      author: "Dalai Lama",
      category: "Kebahagiaan"
    },
    {
      text: "Cara terbaik untuk memprediksi masa depan adalah dengan menciptakannya.",
      author: "Peter Drucker",
      category: "Masa Depan"
    }
  ];

  // API untuk quote eksternal (opsional)
  const fetchExternalQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random');
      if (response.ok) {
        const data = await response.json();
        return {
          text: data.content,
          author: data.author,
          category: 'Inspirasi'
        };
      }
    } catch (error) {
      console.log('External API not available, using local quotes');
    }
    return null;
  };

  const getRandomQuote = async () => {
    setLoading(true);
    setError(null);

    try {
      // Coba ambil dari API eksternal terlebih dahulu
      const externalQuote = await fetchExternalQuote();
      
      let selectedQuote;
      if (externalQuote) {
        selectedQuote = externalQuote;
      } else {
        // Gunakan quote lokal jika API tidak tersedia
        const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
        selectedQuote = inspirationalQuotes[randomIndex];
      }

      setCurrentQuote(selectedQuote);
      
      // Simpan ke history (maksimal 10 quote terakhir)
      const newHistory = [selectedQuote, ...quoteHistory.filter(q => q.text !== selectedQuote.text)].slice(0, 10);
      setQuoteHistory(newHistory);

    } catch (err) {
      setError('Gagal memuat quote');
      // Fallback ke quote lokal
      const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
      setCurrentQuote(inspirationalQuotes[randomIndex]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (!currentQuote) return;

    const isAlreadyFavorite = favoriteQuotes.some(fav => fav.text === currentQuote.text);
    
    if (isAlreadyFavorite) {
      // Hapus dari favorit
      const updatedFavorites = favoriteQuotes.filter(fav => fav.text !== currentQuote.text);
      setFavoriteQuotes(updatedFavorites);
    } else {
      // Tambah ke favorit
      const updatedFavorites = [currentQuote, ...favoriteQuotes].slice(0, 20); // Maksimal 20 favorit
      setFavoriteQuotes(updatedFavorites);
    }
  };

  const selectQuoteFromHistory = (quote) => {
    setCurrentQuote(quote);
  };

  const clearHistory = () => {
    setQuoteHistory([]);
  };

  const clearFavorites = () => {
    setFavoriteQuotes([]);
  };

  const shareQuote = () => {
    if (!currentQuote) return;

    const shareText = `"${currentQuote.text}" - ${currentQuote.author}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Quote Inspiratif',
        text: shareText,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Quote berhasil disalin ke clipboard!');
      });
    }
  };

  useEffect(() => {
    // Load quote pertama kali
    if (!currentQuote) {
      getRandomQuote();
    }
  }, []);

  const isFavorite = currentQuote && favoriteQuotes.some(fav => fav.text === currentQuote.text);

  if (loading) {
    return (
      <div className="quote-container">
        <div className="quote-card loading">
          <div className="loading-spinner"></div>
          <p>Memuat quote inspiratif...</p>
        </div>
      </div>
    );
  }

  if (error && !currentQuote) {
    return (
      <div className="quote-container">
        <div className="quote-card error">
          <div className="error-icon">💭</div>
          <h3>Oops! Terjadi kesalahan</h3>
          <p>{error}</p>
          <button onClick={getRandomQuote} className="retry-btn">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quote-container">
      <div className="quote-card">
        <div className="quote-header">
          <h2>Quote Hari Ini</h2>
          <div className="quote-controls">
            <button onClick={getRandomQuote} className="refresh-btn" title="Quote Baru">
              🔄
            </button>
            <button 
              onClick={toggleFavorite} 
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              title={isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
            <button onClick={shareQuote} className="share-btn" title="Bagikan Quote">
              📤
            </button>
          </div>
        </div>

        {currentQuote && (
          <div className="quote-content">
            <div className="quote-main">
              <div className="quote-mark">"</div>
              <blockquote className="quote-text">
                {currentQuote.text}
              </blockquote>
              <div className="quote-attribution">
                <span className="quote-author">— {currentQuote.author}</span>
                {currentQuote.category && (
                  <span className="quote-category">{currentQuote.category}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Favorit Quotes */}
        {favoriteQuotes.length > 0 && (
          <div className="favorites-section">
            <div className="section-header">
              <span>Quote Favorit ({favoriteQuotes.length})</span>
              <button onClick={clearFavorites} className="clear-btn">
                Hapus Semua
              </button>
            </div>
            <div className="favorites-list">
              {favoriteQuotes.slice(0, 3).map((quote, index) => (
                <button
                  key={index}
                  onClick={() => selectQuoteFromHistory(quote)}
                  className="favorite-item"
                  title={quote.text}
                >
                  <span className="favorite-preview">
                    "{quote.text.substring(0, 50)}..."
                  </span>
                  <span className="favorite-author">— {quote.author}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* History Quotes */}
        {quoteHistory.length > 0 && (
          <div className="history-section">
            <div className="section-header">
              <span>Quote Terakhir</span>
              <button onClick={clearHistory} className="clear-btn">
                Hapus
              </button>
            </div>
            <div className="history-list">
              {quoteHistory.slice(0, 5).map((quote, index) => (
                <button
                  key={index}
                  onClick={() => selectQuoteFromHistory(quote)}
                  className={`history-item ${currentQuote && currentQuote.text === quote.text ? 'active' : ''}`}
                >
                  <span className="history-preview">
                    "{quote.text.substring(0, 40)}..."
                  </span>
                  <span className="history-author">— {quote.author}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quote;