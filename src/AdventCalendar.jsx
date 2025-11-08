import React, { useState, useEffect, useMemo } from "react";

/**
 * Fraukes Adventskalender 2025 – Version 2
 * ----------------------------------------
 * - kleinere Türchen, keine abgerundeten Ecken
 * - größere Zahlen in weihnachtlicher Serifenschrift (Google Font)
 * - Responsive Grid für Handy / Tablet / Desktop
 * - Hintergrund fixiert
 * - Überschrift fixiert, volle Breite, gleiche Schrift
 * - Geöffnete Türchen bleiben im localStorage gespeichert
 */

const backgroundUrl =
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2060&auto=format&fit=crop";

// Google Font einfügen (Cinzel Decorative)
const fontLink =
  "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&display=swap";

const daysConfig = [
  {
    title: "1. Dezember – Willkommen!",
    tip: "Zünde eine Kerze an und atme tief durch – der Advent beginnt.",
    images: [
      "https://images.unsplash.com/photo-1543599538-a6c4d72673a6?q=80&w=1600&auto=format&fit=crop",
    ],
    spotifyEmbedUrl: "https://open.spotify.com/embed/track/11dFghVXANMlKmJXsNCbNl",
  },
  {
    title: "2. Dezember – Kleine Freude",
    tip: "Schreib jemandem eine nette Nachricht.",
    images: [
      "https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=1600&auto=format&fit=crop",
    ],
  },
  // ... bis Tag 24 erweiterbar
];

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

  // Google Font einbinden
  useEffect(() => {
    const link = document.createElement("link");
    link.href = fontLink;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Unlock-Status berechnen
  const unlocked = useMemo(
    () => Array.from({ length: 24 }, (_, i) => isUnlocked(year, monthIndex, i + 1, preview)),
    [year, monthIndex, preview]
  );

  // Geöffnete Tage speichern
  useEffect(() => {
    localStorage.setItem("openedDays", JSON.stringify(openedDays));
  }, [openedDays]);

  const handleOpenDay = (index) => {
    if (!unlocked[index]) return;
    setOpenDay(index);
    if (!openedDays.includes(index)) setOpenedDays((prev) => [...prev, index]);
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: `url(${backgroundUrl})`, fontFamily: "'Cinzel Decorative', serif" }}
    >
      {/* Fixierter Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/60 text-center py-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
          Fraukes Adventskalender {year}
        </h1>
        {preview && (
          <div className="text-sm bg-yellow-400 text-black inline-block mt-2 px-2 py-1 rounded-none">
            Preview (alle Türchen offen)
          </div>
        )}
      </header>

      <div className="pt-28 pb-10 px-3 sm:px-6">
        {/* Raster */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: 24 }, (_, i) => {
            const isOpen = openedDays.includes(i);
            return (
              <button
                key={i}
                onClick={() => handleOpenDay(i)}
                disabled={!unlocked[i]}
                className={`relative aspect-[3/4] rounded-none shadow text-4xl sm:text-5xl font-bold flex items-center justify-center transition-all ${
                  unlocked[i]
                    ? "bg-red-600 hover:bg-red-500 cursor-pointer"
                    : "bg-gray-600/70 cursor-not-allowed"
                } ${isOpen ? "opacity-80" : ""}`}
              >
                {isOpen ? (
                  <span className="text-lg sm:text-xl text-center px-2">🎁 Geöffnet</span>
                ) : (
                  i + 1
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {openDay !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="relative bg-white/10 backdrop-blur rounded-2xl p-4 max-w-2xl w-full">
            <button
              onClick={() => setOpenDay(null)}
              className="absolute right-3 top-3 text-white text-xl"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-2">{daysConfig[openDay]?.title}</h2>
              <p className="text-white/90">{daysConfig[openDay]?.tip}</p>
            </div>

            {daysConfig[openDay]?.images?.length > 0 && (
              <img
                src={daysConfig[openDay].images[0]}
                alt={`Türchen ${openDay + 1}`}
                className="w-full rounded-xl shadow mb-4"
              />
            )}

            {daysConfig[openDay]?.spotifyEmbedUrl && (
              <iframe
                title="Spotify"
                src={daysConfig[openDay].spotifyEmbedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl"
              ></iframe>
            )}

            <p className="text-center text-xs text-white/70 mt-4">
              Tag {openDay + 1} • Advent {year}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
