import React, { useState, useEffect, useMemo } from "react";
import daysConfig from "../data/daysConfig";

// Hintergrundbild und Schrift
const backgroundUrl =
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2060&auto=format&fit=crop";
const fontLink =
  "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&display=swap";

// feste globale Zufallsreihenfolge (gleich für alle Nutzer)
const shuffleOrder = [
  5, 17, 2, 8, 1, 23, 12, 3, 14, 19, 9, 4, 16, 6, 13, 24, 11, 20, 7, 10, 15, 18, 21, 22,
];

// Sortierte Reihenfolge nach Shuffle
const days = shuffleOrder
  .map((num) => daysConfig.find((day) => day.day === num))
  .filter(Boolean);

function isUnlocked(year, monthIndex, dayOfMonth, preview) {
  if (preview) return true;
  const today = new Date();
  const unlockDate = new Date(year, monthIndex, dayOfMonth);
  return today >= unlockDate;
}

export default function AdventCalendar({ year = 2025, monthIndex = 11, preview = false }) {
  const [openDayIndex, setOpenDayIndex] = useState(null);
  const [openedDays, setOpenedDays] = useState(() => {
    const saved = localStorage.getItem("openedDays");
    return saved ? JSON.parse(saved) : [];
  });

  // Schrift einbinden
  useEffect(() => {
    const link = document.createElement("link");
    link.href = fontLink;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Freigeschaltete Tage
  const unlocked = useMemo(
    () => Array.from({ length: 24 }, (_, i) => isUnlocked(year, monthIndex, i + 1, )),
    [year, monthIndex, ]
  );

  // Geöffnete Tage speichern
  useEffect(() => {
    localStorage.setItem("openedDays", JSON.stringify(openedDays));
  }, [openedDays]);

  const handleOpenDay = (dayNumber, index) => {
    if (!unlocked[dayNumber - 1]) return;
    setOpenDayIndex(index);
    if (!openedDays.includes(dayNumber)) {
      setOpenedDays((prev) => [...prev, dayNumber]);
    }
  };

  const openDay = openDayIndex !== null ? days[openDayIndex] : null;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        fontFamily: "'Cinzel Decorative', serif",
      }}
    >
      {/* Fixierter Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/70 text-center py-4">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-wide">
          FRAUKES ADVENTSKALENDER {year}
        </h1>
       {preview && (
  <button
    onClick={() => {
      if (openedDays.length > 0) {
        // alle Türen schließen
        setOpenedDays([]);
        localStorage.removeItem("openedDays");
      } else {
        // alle Türen öffnen
        const allDays = days.map((d) => d.day);
        setOpenedDays(allDays);
        localStorage.setItem("openedDays", JSON.stringify(allDays));
      }
    }}
    className="text-sm bg-yellow-400 text-black inline-block mt-2 px-3 py-1 rounded hover:bg-yellow-300 transition"
  >
    {openedDays.length > 0
      ? "PREVIEW (ALLE TÜREN SCHLIESSEN)"
      : "PREVIEW (ALLE TÜRCHEN OFFEN)"}
  </button>
)}

      </header>

      {/* Abstand für Header, zentriertes Grid */}
      <main className="pt-24 md:pt-28 pb-10 flex justify-center">
        <div className="w-[90%] max-w-[900px] px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {days.map((day, index) => {
            const dayNumber = day.day;
            const isOpen = openedDays.includes(dayNumber);
            const isAvailable = unlocked[dayNumber - 1];
            return (
             <button
  key={dayNumber}
  onClick={() => handleOpenDay(dayNumber, index)}
  disabled={!isAvailable && !preview}
  className={`relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-md flex items-center justify-center text-white font-bold text-3xl transition-all ${
    !isAvailable && !preview
      ? "bg-[#8b0000] cursor-not-allowed"
      : "bg-[#8b0000] hover:bg-[#a80000] cursor-pointer"
  }`}
>
  {isOpen ? (
    <img
      src={day.images?.[0]}
      alt={day.title}
      className="w-full h-full object-cover"
    />
  ) : (
    <span>{dayNumber}</span>
  )}
</button>

            );
          })}
        </div>
      </main>

      {/* Modal-Fenster */}
      {openDay && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="relative bg-white/10 backdrop-blur rounded-2xl p-6 max-w-lg w-full">
            <button
              onClick={() => setOpenDayIndex(null)}
              className="absolute right-3 top-3 text-white text-2xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2 text-center">{openDay.title}</h2>
            <p className="text-center text-white/90 mb-4">{openDay.text}</p>
            {openDay.images?.[0] && (
              <img
                src={openDay.images[0]}
                alt={`Türchen ${openDay.title}`}
                className="w-full rounded-xl shadow mb-4 object-cover"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
