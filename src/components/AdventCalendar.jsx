import React, { useState, useEffect, useMemo } from "react";
import daysConfig from "../data/daysConfig";

// Hintergrundbild und Schrift
const backgroundUrl =
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2060&auto=format&fit=crop";
const fontLink =
  "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&display=swap";

const daysConfig = Array.from({ length: 24 }, (_, i) => ({
  title: `Türchen ${i + 1}`,
  tip: "Frohe Adventszeit!",
  image:
    "https://images.unsplash.com/photo-1543599538-a6c4d72673a6?q=80&w=1600&auto=format&fit=crop",
}));
// fixed global shuffle order (same for all users)
const shuffleOrder = [
  5,
  17,
  2,
  8,
  1,
  23,
  12,
  3,
  14,
  19,
  9,
  4,
  16,
  6,
  13,
  24,
  11,
  20,
  7,
  10,
  15,
  18,
  21,
  22,
];

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
  const [openDay, setOpenDay] = useState(null);
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
    () => Array.from({ length: 24 }, (_, i) => isUnlocked(year, monthIndex, i + 1, preview)),
    [year, monthIndex, preview]
  );

  useEffect(() => {
    localStorage.setItem("openedDays", JSON.stringify(openedDays));
  }, [openedDays]);

  const handleOpenDay = (index) => {
    if (!unlocked[index]) return;
    setOpenDay(index);
    if (!openedDays.includes(index)) setOpenedDays((prev) => [...prev, index]);
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
          <div className="text-sm bg-yellow-400 text-black inline-block mt-2 px-3 py-1 rounded">
            PREVIEW (ALLE TÜRCHEN OFFEN)
          </div>
        )}
      </header>

      <main className="pt-32 pb-10 flex justify-center">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl w-full px-6">
          {Array.from({ length: 24 }, (_, i) => {
            const isOpen = openedDays.includes(i);
      {/* header spacing to prevent overlap on mobile */}
      <main className="pt-24 md:pt-28 pb-10">
        {/* narrower grid width and responsive columns for smaller doors */}
        <div className="grid max-w-[900px] mx-auto px-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {days.map((day, index) => {
            const dayNumber = day.day;
            const isOpen = openedDays.includes(dayNumber);
            return (
              <button
                key={i}
                onClick={() => handleOpenDay(i)}
                disabled={!unlocked[i]}
                key={dayNumber}
                onClick={() => handleOpenDay(dayNumber, index)}
                disabled={!unlocked[dayNumber - 1]}
                className={`aspect-[3/4] w-full shadow-md flex items-center justify-center text-white font-bold text-3xl transition-all bg-[#8b0000] hover:bg-[#a80000] ${
                  unlocked[i] ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  unlocked[dayNumber - 1]
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                } ${isOpen ? "opacity-70" : ""}`}
              >
                {isOpen ? "🎁" : i + 1}
                {isOpen ? "🎁" : dayNumber}
              </button>
            );
          })}
        </div>
      </main>

      {/* Modal Fenster */}
      {openDay !== null && (
      {openDay && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="relative bg-white/10 backdrop-blur rounded-2xl p-6 max-w-lg w-full">
            <button
              onClick={() => setOpenDay(null)}
              className="absolute right-3 top-3 text-white text-2xl"
            >
            <button onClick={() => setOpenDayIndex(null)} className="absolute right-3 top-3 text-white text-2xl">
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2 text-center">
              {daysConfig[openDay]?.title}
            </h2>
            <p className="text-center text-white/90 mb-4">{daysConfig[openDay]?.tip}</p>
            <img
              src={daysConfig[openDay]?.image}
              alt={`Türchen ${openDay + 1}`}
              className="w-full rounded-xl shadow mb-4 object-cover"
            />
            <h2 className="text-2xl font-bold mb-2 text-center">{openDay.title}</h2>
            <p className="text-center text-white/90 mb-4">{openDay.text}</p>
            {openDay.images?.[0] && (
              <img
                src={openDay.images[0]}
                alt={`Türchen ${openDay.day}`}
                className="w-full rounded-xl shadow mb-4 object-cover"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
