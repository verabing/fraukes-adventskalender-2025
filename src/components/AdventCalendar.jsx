import React, { useState, useEffect, useMemo } from "react";
import daysConfig from "../data/daysConfig";

const backgroundUrl = "/bilder/hintergrund.jpg";

const fontLinks = [
  "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&display=swap",
  "https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap",
];

const shuffleOrder = [
  5, 17, 2, 8, 1, 23, 12, 3, 14, 19, 9, 4, 16, 6, 13, 24, 11, 20,
  7, 10, 15, 18, 21, 22,
];

const days = shuffleOrder
  .map((num) => daysConfig.find((d) => d && d.day === num))
  .filter(Boolean);

function parseDate(input) {
  if (!input || typeof input !== "string") return null;
  const parts = input.split(".");
  if (parts.length !== 3) return null;

  const [d, m, y] = parts.map(Number);
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

function isUnlocked(simulatedDate, year, monthIndex, dayOfMonth) {
  const today = simulatedDate ? parseDate(simulatedDate) : new Date();
  if (!today) return false;
  const unlockDate = new Date(year, monthIndex, dayOfMonth);
  return today >= unlockDate;
}

export default function AdventCalendar({ year = 2025, monthIndex = 11 }) {
  const [openDayIndex, setOpenDayIndex] = useState(null);
  const [simulatedDate, setSimulatedDate] = useState("");
  const [notYet, setNotYet] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [openedDays, setOpenedDays] = useState(() => {
    try {
      const saved = localStorage.getItem("openedDays");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fontLinks.forEach((url) => {
      const link = document.createElement("link");
      link.href = url;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    });
  }, []);

  const unlocked = useMemo(
    () =>
      [...Array(24)].map((_, i) =>
        isUnlocked(simulatedDate, year, monthIndex, i + 1)
      ),
    [simulatedDate, year, monthIndex]
  );

  useEffect(() => {
    try {
      localStorage.setItem("openedDays", JSON.stringify(openedDays));
    } catch {}
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
      <header className="fixed top-0 left-0 w-full z-50 bg-black/70 text-center py-5 backdrop-blur flex flex-col items-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-wide">
          FRAUKES ADVENTSKALENDER {year}
        </h1>

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

      <main className="pt-52 pb-10 px-4">
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 mx-auto max-w-[1000px]">
          {days.map((day, index) => {
            if (!day) return null;

            const dayNumber = day.day;
            const isOpen = openedDays.includes(dayNumber);

            const ratio =
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
                : "1 / 1";

            return (
              <div
                key={`day-${dayNumber}`}
                className="break-inside-avoid mb-4 flex justify-center"
              >
                <button
                  onClick={() => handleOpenDay(dayNumber, index)}
                  className="relative w-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                  style={{
                    borderWidth: "12px",
                    borderStyle: "solid",
                    borderImage: `url('/ui/rahmen.svg') 200 round`,
                    aspectRatio: ratio,
                    backgroundColor: "#8b0000",
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
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenDayIndex(null);
          }}
        >
          <div className="relative bg-white/10 backdrop-blur rounded-2xl p-6 max-w-lg w-full">
            <button
              onClick={() => setOpenDayIndex(null)}
              className="absolute right-3 top-3 text-white text-2xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2 text-center">
              {openDay.title}
            </h2>

            <p
              className="text-center text-white/90 mb-4"
              style={{ fontFamily: "'EB Garamond', serif" }}
            >
              {openDay.text}
            </p>

            {openDay.images?.length > 0 && (
              <div className="relative">
                <img
                  src={openDay.images[currentImageIndex]}
                  alt={openDay.title}
                  className="w-full rounded-xl shadow mb-4 object-cover transition-opacity duration-500"
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
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
                    >
                      ◀
                    </button>

                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev + 1 >= openDay.images.length ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
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
