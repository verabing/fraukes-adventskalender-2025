import React, { useState, useEffect, useMemo } from "react";

/**
 * Fraukes Adventskalender 2025
 * - 24 Türchen, öffnen sich datumsgesteuert (oder im Preview sofort)
 * - pro Tag: Titel, Tipptext, Bilder (1–mehrere), Musik (lokal oder Spotify)
 * - du kannst Inhalte in `daysConfig` unten anpassen
 */

const backgroundUrl =
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2060&auto=format&fit=crop";

const daysConfig = [
  {
    title: "1. Dezember – Willkommen!",
    tip: "Zünde eine Kerze an und atme tief durch – der Advent beginnt.",
    images: [
      "https://images.unsplash.com/photo-1543599538-a6c4d72673a6?q=80&w=1600&auto=format&fit=crop",
    ],
    audioUrl: "",
    spotifyEmbedUrl: "https://open.spotify.com/embed/track/11dFghVXANMlKmJXsNCbNl",
  },
  {
    title: "2. Dezember – Kleine Freude",
    tip: "Schreib jemandem, den du magst, eine nette Nachricht.",
    images: [
      "https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=1600&auto=format&fit=crop",
    ],
    audioUrl: "",
    spotifyEmbedUrl: "",
  },
  // du kannst bis Tag 24 beliebig erweitern
];

function isUnlocked(year, monthIndex, dayOfMonth, preview) {
  if (preview) return true;
  const today = new Date();
  const unlockDate = new Date(year, monthIndex, dayOfMonth);
  return today >= unlockDate;
}

export default function AdventCalendar({ year = 2025, monthIndex = 11, preview = false }) {
  const [openDay, setOpenDay] = useState(null);

  const unlocked = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => isUnlocked(year, monthIndex, i + 1, preview));
  }, [year, monthIndex, preview]);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-8 inline-block rounded-2xl bg-white/20 px-6 py-2 text-2xl font-bold backdrop-blur">
          Fraukes Adventskalender {year}
        </h1>
        {preview && (
          <span className="ml-2 text-sm bg-yellow-400 text-black px-2 py-1 rounded">
            Preview (alle Türchen offen)
          </span>
        )}

        {/* Raster mit 24 Türchen */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
          {Array.from({ length: 24 }, (_, i) => (
            <button
              key={i}
              onClick={() => unlocked[i] && setOpenDay(i)}
              disabled={!unlocked[i]}
              className={`relative aspect-[3/4] rounded-2xl shadow text-lg font-semibold flex items-center justify-center transition-all ${
                unlocked[i]
                  ? "bg-red-600 hover:bg-red-500 cursor-pointer"
                  : "bg-gray-600/70 cursor-not-allowed"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal-Fenster */}
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

            {/* Bild(er) */}
            {daysConfig[openDay]?.images?.length > 0 ? (
              <img
                src={daysConfig[openDay].images[0]}
                alt={`Türchen ${openDay + 1}`}
                className="w-full rounded-xl shadow mb-4"
              />
            ) : (
              <div className="text-center text-white/60">Kein Bild vorhanden</div>
            )}

            {/* Spotify oder Audio */}
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

            {daysConfig[openDay]?.audioUrl && (
              <audio controls src={daysConfig[openDay].audioUrl} className="w-full mt-3" />
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
