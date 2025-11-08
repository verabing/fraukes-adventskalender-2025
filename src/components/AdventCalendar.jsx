// src/components/AdventCalendar.jsx
import React, { useEffect, useMemo, useState } from "react";
import daysConfig from "../data/daysConfig";

export default function AdventCalendar() {
  const [openedDays, setOpenedDays] = useState(() => {
    const saved = localStorage.getItem("fraukesOpenedDays");
    return saved ? JSON.parse(saved) : [];
  });
const [activeDay, setActiveDay] = useState(null);
const [shuffled, setShuffled] = useState([]);
const [forcePreview, setForcePreview] = useState(false);


  // 1) Google-Font Cinzel Decorative dynamisch einbinden (bruchsicher, keine weiteren Dateien nötig)
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // 2) Einmalige Zufallsreihenfolge – persistent
  useEffect(() => {
    const stored = localStorage.getItem("fraukesShuffle");
    if (stored) {
      setShuffled(JSON.parse(stored));
    } else {
      const arr = [...Array(24).keys()].sort(() => Math.random() - 0.5);
      setShuffled(arr);
      localStorage.setItem("fraukesShuffle", JSON.stringify(arr));
    }
  }, []);

  // 3) Freischaltung: Dezember-Tage oder Preview
  const previewFromUrl = useMemo(
    () => typeof window !== "undefined" && window.location.search.includes("preview"),
    []
  );

  const isUnlocked = (i: number) => {
    if (forcePreview || previewFromUrl) return true;
    const today = new Date();
    const isDecember = today.getMonth() === 11; // 0-basiert
    if (!isDecember) return false;
    const day = i + 1;
    return today.getDate() >= day;
  };

  // 4) Öffnen
  const handleOpen = (i: number) => {
    if (!isUnlocked(i)) return;
    setActiveDay(i);
    if (!openedDays.includes(i)) {
      const upd = [...openedDays, i];
      setOpenedDays(upd);
      localStorage.setItem("fraukesOpenedDays", JSON.stringify(upd));
    }
  };

  const handleClose = () => setActiveDay(null);

  // 5) Helper: Aspect-Klasse für Masonry-Kachel
  const aspectClass = (a?: string) =>
    a === "landscape" ? "aspect-[4/3]" : a === "square" ? "aspect-square" : "aspect-[3/4]";

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/bilder/hintergrund.jpg')",
        fontFamily: "'Cinzel Decorative', serif",
      }}
    >
      {/* Header (fixiert) */}
      <header className="sticky top-0 z-20 bg-neutral-800/85 backdrop-blur py-4 shadow">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl tracking-wide">
            FRAUKES ADVENTSKALENDER 2025
          </h1>

          <button
            className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded"
            onClick={() => {
              const all = Array.from({ length: 24 }, (_, i) => i);
              setOpenedDays(all);
              setForcePreview(true);
              localStorage.setItem("fraukesOpenedDays", JSON.stringify(all));
            }}
          >
            Preview (alle Türchen offen)
          </button>
        </div>
      </header>

      {/* Kalender – Masonry ohne Löcher:
          Tailwind columns + break-inside-avoid auf Kacheln */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="columns-2 sm:columns-3 lg:columns-5 gap-4 [column-gap:1rem]">
          {shuffled.map((i) => {
            const day = daysConfig[i];
            const open = openedDays.includes(i);
            const unlocked = isUnlocked(i);
            return (
              <div key={i} className="mb-4 break-inside-avoid">
                <button
                  onClick={() => handleOpen(i)}
                  className={`relative w-full ${aspectClass(day?.aspect)} overflow-hidden flex items-center justify-center text-white font-bold text-3xl sm:text-4xl transition-colors
                    ${unlocked ? "bg-[#e64a4b] hover:bg-[#d14243]" : "bg-gray-500/60 cursor-not-allowed"}`}
                >
                  {open && day?.images?.[0] ? (
                    <>
                      <img
                        src={day.images[0]}
                        alt={`Tag ${i + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </>
                  ) : (
                    <span className="relative z-10">{i + 1}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal mit Tages-Inhalt */}
      {activeDay !== null && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative bg-neutral-900/90 text-white max-w-3xl w-full p-6 rounded-xl">
            <button className="absolute top-3 right-4 text-2xl" onClick={handleClose}>
              ×
            </button>

            <h2 className="text-2xl sm:text-3xl text-center mb-2">
              {daysConfig[activeDay]?.title || `Tag ${activeDay + 1}`}
            </h2>
            {daysConfig[activeDay]?.text && (
              <p className="text-center mb-4">{daysConfig[activeDay]?.text}</p>
            )}

            {/* Bilder (Karussell light: mehrere untereinander) */}
            {daysConfig[activeDay]?.images?.length > 0 &&
              daysConfig[activeDay].images.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Tag ${activeDay + 1} – Bild ${idx + 1}`}
                  className="w-full object-contain mb-3 rounded"
                />
              ))}

            {/* Optional: Spotify-Embed */}
            {daysConfig[activeDay]?.spotify && (
              <iframe
                title="Spotify"
                src={daysConfig[activeDay].spotify}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded"
              />
            )}

            <p className="text-center mt-2 text-sm opacity-80">
              Tag {activeDay + 1} • Advent 2025
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
