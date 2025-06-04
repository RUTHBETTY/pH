import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  // State to hold the current pH value
  const [phValue, setPhValue] = useState(7.0);
  // State to hold the last update timestamp
  const [lastUpdated, setLastUpdated] = useState('');

  // useEffect hook para obtener el valor real de pH desde la API
  useEffect(() => {
    const fetchPh = async () => {
      try {
        const response = await fetch('/api/ph-latest');
        if (response.ok) {
          const data = await response.json();
          setPhValue(data.ph);
          setLastUpdated(new Date(data.timestamp).toLocaleTimeString());
        }
      } catch (error) {
        // Puedes mostrar un error si lo deseas
      }
    };
    fetchPh();
    const intervalId = setInterval(fetchPh, 3000);
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount

  // Determine the pH status (acidic, neutral, basic) and corresponding color
  const getPhStatus = (ph) => {
    if (ph < 7) {
      return { status: 'Ácido', color: 'bg-red-500', text: 'text-red-500' };
    } else if (ph === 7) {
      return { status: 'Neutro', color: 'bg-green-500', text: 'text-green-500' };
    } else {
      return { status: 'Básico', color: 'bg-blue-500', text: 'text-blue-500' };
    }
  };

  const { status, color, text } = getPhStatus(phValue);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-lg text-center border border-gray-200">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-8 tracking-tight drop-shadow-lg">
          Monitor de pH
        </h1>

        <div className="relative w-full h-10 bg-gray-200 rounded-full overflow-hidden mb-10 shadow-inner">
          {/* pH indicator bar */}
          <div
            className={`absolute h-full transition-all duration-500 ease-in-out ${color}`}
            style={{ width: `${(phValue / 14) * 100}%` }}
          ></div>
          {/* pH value text overlay */}
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800">
            {phValue.toFixed(1)}
          </span>
        </div>

        <div className="mb-10">
          <p className="text-7xl font-extrabold text-gray-900 mb-3 drop-shadow">
            {phValue.toFixed(1)}
          </p>
          <p className={`text-3xl font-semibold ${text} drop-shadow-sm`}>
            Estado: {status}
          </p>
        </div>

        <div className="text-gray-600 text-base mb-2">
          <p>Última actualización: <span className="font-mono">{lastUpdated}</span></p>
        </div>
        <p className="mt-2 text-xs text-gray-400 italic">
          *Valores simulados para demostración.
        </p>
      </div>
    </div>
  );
};

export default App;
