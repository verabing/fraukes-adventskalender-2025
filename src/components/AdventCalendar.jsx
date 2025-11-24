import React, { useState, useEffect, useMemo } from "react";
import daysConfig from "../data/daysConfig";

// Hintergrundbild und Schrift
const backgroundUrl = "/bilder/hintergrund.jpg";

// Schriftarten laden
const fontLinks = [
  "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&display=swap",
  "https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap",
];

// Feste globale Shuffle-Reihenfolge (gleich für alle Nutzer)
const shuffleOrder = [
  5, 17, 2, 8, 1, 23, 12, 3, 14, 19, 9, 4, 16, 6, 13, 24, 11, 20, 7, 10, 15, 18, 21, 22,
];

const days = shuffleOrder
  .map((num) => daysConfig.find((day) => day.day === num))
  .filter(Boolean);

function parseDate(input) {
  if (!input) return null;
  const [day, month, year] = input.split(".").map((x) => parseInt(x, 10));
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

function isUnlocked(simulatedDate, year, monthIndex, dayOfMonth) {
  const today = simulatedDate ? parseDate(simulatedDate) : new Date();
  const unlockDate = new Date(year, monthIndex, dayOfMonth);
  return today >= unlockDate;
}

export default function AdventCalendar({ year = 2025, monthIndex = 11 }) {
  const [openDayIndex, setOpenDayIndex] = useState(null);
  const [openedDays, setOpenedDays] = useState(() => {
    const saved = localStorage.getItem("openedDays");
    return saved ? JSON.parse(saved) : [];
  });
  const [simulatedDate, setSimulatedDate] = useState("");
  const [notYet, setNotYet] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Schriftarten laden
  useEffect(() => {
    fontLinks.forEach((url) => {
      const link = document.createElement("link");
      link.href = url;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    });
  }, []);

  // Unlock-Status je Tag berechnen
  const unlocked = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) =>
        isUnlocked(simulatedDate, year, monthIndex, i + 1)
      ),
    [simulatedDate, year, monthIndex]
  );

  // Geöffnete Türchen speichern
  useEffect(() => {
    localStorage.setItem("openedDays", JSON.stringify(openedDays));
  }, [openedDays]);

  const handleOpenDay = (dayNumber, index) => {
    if (!unlocked[dayNumber - 1]) {
      setNotYet(true);
      setTimeout(() => setNotYet(false), 1200);
      return;
    }
    setOpenDayIndex(index);
    setCurrentImageIndex(0);
    if (!openedDays.includes(dayNumber)) {
      setOpenedDays((prev) => [...prev, dayNumber]);
    }
  };

  const openDay = openDayIndex !== null ? days[openDayIndex] : null;

  // Automatisches Karussell
  useEffect(() => {
    if (!openDay || !openDay.images || openDay.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev + 1 >= openDay.images.length ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [openDay]);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        fontFamily: "'Cinzel Decorative', serif",
      }}
    >
      {/* Header */}
<header className="fixed top-0 left-0 w-full z-50 bg-black/70 text-center py-5 backdrop-blur flex flex-col items-center space-y-2 overflow-visible">
  <h1 className="text-3xl sm:text-5xl font-bold tracking-wide">
    FRAUKES ADVENTSKALENDER {year}
  </h1>

  {/* Simulationsfeld */}
  <div className="text-sm flex flex-col items-center gap-1">
    <label htmlFor="simDate" className="text-white/80">
      Simuliere Datum (TT.MM.JJJJ)
    </label>
    <input
      id="simDate"
      type="text"
      placeholder="z. B. 12.12.2025"
      value={simulatedDate}
      onChange={(e) => setSimulatedDate(e.target.value)}
      className="px-3 py-1 rounded text-black text-center w-40"
    />
  </div>

  {/* Reset-Button nur für Testphase */}
  <button
    onClick={() => {
      localStorage.removeItem("openedDays");
      setOpenedDays([]);
    }}
    className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
  >
    🔄 Alle Türchen schließen
  </button>
</header>

      {/* Abstand für Header */}
      <main className="pt-52 pb-10 px-4">
        {/* Masonry-Layout mit Rahmen & Schatten */}
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 mx-auto max-w-[1000px]">
          {days.map((day, index) => {
            const dayNumber = day.day;
            const isOpen = openedDays.includes(dayNumber);
            return (
              <div
                key={dayNumber}
                className="break-inside-avoid mb-4 flex justify-center"
              >
                 {/* Button Farbe und Form */}
                
                <button
                  onClick={() => handleOpenDay(dayNumber, index)}
                  className="relative w-full overflow-hidden rounded-lg border border-white/10 shadow-md 
  hover:shadow-lg transition-all bg-[#8b0000] hover:bg-[#a80000] cursor-pointer 
  hover:animate-wobble"
                  style={{
  aspectRatio:
    day.aspect === "landscape"
      ? "4 / 3"
      : day.aspect === "portrait"
      ? "3 / 4"
      : day.aspect === "16x9-breit"
      ? "16 / 9"
      : day.aspect === "3x2-breit"
      ? "3 / 2"
      : day.aspect === "9x16-hoch"
      ? "9 / 16"
      : day.aspect === "2x3-hoch"
      ? "2 / 3"
      : "1 / 1"
}}
                >
                  {isOpen ? (
                    <img
                      src={day.images?.[0]}
                      alt={day.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                      {dayNumber}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal-Fenster */}
      {openDay && (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50
               opacity-100 transition-opacity duration-300"
    onClick={(e) => {
      if (e.target === e.currentTarget) setOpenDayIndex(null);
    }}
  >
    <div
      className="relative bg-white/15 backdrop-blur-xl rounded-1xl p-8 
                 border-2 border-white/40 shadow-2xl max-w-lg w-full transition-all duration-300"
    >
      {/* Close Button */}
   <button
  onClick={() => setOpenDayIndex(null)}
  className="absolute right-4 top-4 bg-black/30 hover:bg-black/50 
             text-white rounded-full p-2 transition"
>
  ✕
</button>


      {/* Titel */}
      <h2 className="text-3xl font-bold mb-3 text-center tracking-wide">
        {openDay.title}
      </h2>

      {/* Text */}
      <p
        className="text-center text-white/90 mb-6 leading-relaxed"
        style={{ fontFamily: "'EB Garamond', serif" }}
      >
        {openDay.text}
      </p>

      {/* Bilder + Buttons , Karussell */}
      {openDay.images && openDay.images.length > 0 && (
        <div className="relative">
          <img
            src={openDay.images[currentImageIndex]}
            alt={`Türchen ${openDay.title}`}
            className="w-full rounded-xl shadow-lg border border-white/20
                       object-cover"
          />

          {openDay.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0
                      ? openDay.images.length - 1
                      : prev - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 
                           bg-black/40 hover:bg-black/60 text-white p-2 
                           rounded-full transition"
              >
                ◀
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev + 1 >= openDay.images.length
                      ? 0
                      : prev + 1
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 
                           bg-black/40 hover:bg-black/60 text-white p-2 
                           rounded-full transition"
              >
                ▶
              </button>
            </>
          )}
        </div>
      )}
    </div>
  </div>
)}

      {/* Not-yet Popup */}
      {notYet && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black/80 text-white px-6 py-3 rounded-lg text-xl shadow-lg">
            Not yet ✋
          </div>
        </div>
      )}
    </div>
  );
}
