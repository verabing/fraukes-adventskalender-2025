// AdventCalendar.tsx
import React, { useEffect, useMemo, useState } from "react";

// 1. Konfiguration aller Türchen (aus deinem Build 1:1 übernommen)
const daysConfig = [
  { day: 1, title: "1. December – Welcome", text: "... to my doodle advents calender!", images: ["/bilder/tuer1.jpg"] },
  { day: 2, title: "2. Dezember – Kleine Freude", text: "Schreib jemandem eine nette Nachricht.", images: ["/bilder/tuer2.jpg", "/bilder/minekritz.jpg"], aspect: "portrait" },
  { day: 3, title: "3. Dezember – Lichtmoment", text: "Zünde eine Kerze an und genieß einen Moment Ruhe.", images: ["/bilder/tuer3.jpg", "/bilder/tuer3b.jpg", "/bilder/tuer3c.jpg"], aspect: "9x16-hoch" },
  { day: 4, title: "4. Dezember – Spaziergang", text: "Mach einen kleinen Winterspaziergang – auch wenn’s nur fünf Minuten sind.", images: ["/bilder/tuer4.jpg", "/bilder/tuer4b.jpg"], aspect: "9x16-hoch" },
  { day: 5, title: "5. Dezember – Dankbarkeit", text: "Notiere drei Dinge, für die du heute dankbar bist.", images: ["/bilder/tuer5.jpg", "/bilder/tuer5b.jpg"] },
  { day: 6, title: "6. Dezember – Nikolaus!", text: "Überrasche jemanden – so wie der Nikolaus es tun würde.", images: ["/bilder/tuer6.jpg"] },
  { day: 7, title: "7. Dezember – Musik", text: "Hör dein Lieblingslied – laut und ohne schlechtes Gewissen.", images: ["/bilder/tuer7.jpg", "/bilder/tuer7b.jpg"] },
  { day: 8, title: "8. Dezember – Ruhepunkt", text: "Mach für zehn Minuten gar nichts. Einfach nur da sein.", images: ["/bilder/tuer8.jpg", "/bilder/tuer8b.jpg"] },
  { day: 9, title: "9. Dezember – Erinnerung", text: "Sieh dir ein altes Foto an, das dich lächeln lässt.", images: ["/bilder/tuer9.jpg", "/bilder/tuer9b.jpg"], aspect: "portrait" },
  { day: 10, title: "10. Dezember – Duft des Winters", text: "Zimt, Tanne, Orangen – such dir deinen Lieblingsduft und atme tief ein.", images: ["/bilder/tuer10.jpg", "/bilder/tuer10b.jpg"], aspect: "portrait" },
  { day: 11, title: "11. Dezember – Lächeln", text: "Schenk heute mindestens drei Menschen ein Lächeln.", images: ["/bilder/tuer11.jpg", "/bilder/tuer11b.jpg", "/bilder/tuer11c.jpg", "/bilder/tuer11d.jpg"], aspect: "portrait" },
  { day: 12, title: "12. Dezember – Genussmoment", text: "Iss etwas, das du liebst – langsam und bewusst.", images: ["/bilder/tuer12.jpg", "/bilder/tuer12b.jpg"], aspect: "portrait" },
  { day: 13, title: "13. Dezember – Licht teilen", text: "Zünde eine Kerze für jemanden an, den du vermisst.", images: ["/bilder/tuer13.jpg", "/bilder/tuer13b.jpg", "/bilder/tuer13c.jpg"], aspect: "portrait" },
  { day: 14, title: "14. Dezember – Pause", text: "Trink eine Tasse Tee und schau aus dem Fenster.", images: ["/bilder/tuer14.jpg", "/bilder/tuer14b.jpg", "/bilder/tuer14c.jpg"], aspect: "landscape" },
  { day: 15, title: "15. Dezember – Kreativität", text: "Male, schreibe, bastle – irgendetwas, das Freude macht.", images: ["/bilder/tuer15.jpg", "/bilder/tuer15b.jpg", "/bilder/tuer15c.jpg"], aspect: "2x3-hoch" },
  { day: 16, title: "16. Dezember – Wärme", text: "Zieh dir etwas Warmes an und kuschle dich ein.", images: ["/bilder/tuer16.jpg", "/bilder/tuer16b.jpg"] },
  { day: 17, title: "17. Dezember – Gutes tun", text: "Mach jemandem heute das Leben ein bisschen leichter.", images: ["/bilder/tuer17.jpg", "/bilder/tuer17b.jpg"], aspect: "landscape" },
  { day: 18, title: "18. Dezember – Stille", text: "Schalte alle Geräte aus – nur für eine Viertelstunde.", images: ["/bilder/tuer18.jpg", "/bilder/tuer18b.jpg"], aspect: "landscape" },
  { day: 19, title: "19. Dezember – Erinnerungsstück", text: "Such einen Gegenstand, der dich an etwas Schönes erinnert.", images: ["/bilder/tuer19.jpg", "/bilder/tuer19b.jpg"], aspect: "9x16-hoch" },
  { day: 20, title: "20. Dezember – Vorfreude", text: "Denk an etwas, auf das du dich freust.", images: ["/bilder/tuer20.jpg", "/bilder/tuer20b.jpg"] },
  { day: 21, title: "21. Dezember – Dunkel & Licht", text: "Heute ist die längste Nacht. Mach sie dir schön hell.", images: ["/bilder/tuer21.jpg", "/bilder/tuer21b.jpg"] },
  { day: 22, title: "22. Dezember – Verbindung", text: "Ruf jemanden an, den du lange nicht gesprochen hast.", images: ["/bilder/tuer22.jpg", "/bilder/tuer22b.jpg"], aspect: "16x9-breit" },
  { day: 23, title: "23. Dezember – Vorbereitung", text: "Bereite etwas für morgen vor – liebevoll und ruhig.", images: ["/bilder/tuer23.jpg", "/bilder/tuer23b.jpg"] },
  { day: 24, title: "24. Dezember – Heiligabend", text: "Ein Moment der Ruhe. Du bist hier. Das reicht.", images: ["/bilder/tuer24.jpg", "/bilder/tuer24b.jpg"], aspect: "landscape" }
] as const;

const backgroundImage = "/bilder/hintergrund.jpg";

// gleiche Reihenfolge wie in deinem Build (Md → Ho)
const dayOrder = [5,17,2,8,1,23,12,3,14,19,9,4,16,6,13,24,11,20,7,10,15,18,21,22];
const orderedDays = dayOrder
  .map((day) => daysConfig.find((d) => d.day === day)!)
  .filter(Boolean);

// Hilfsfunktionen für Datums-Simulation
function parseSimDate(input: string | null): Date | null {
  if (!input) return null;
  const parts = input.split(".");
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map((x) => parseInt(x, 10));
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}

function isDayUnlocked(simDate: string, year: number, monthIndex: number, day: number): boolean {
  const now = parseSimDate(simDate) ?? new Date();
  const target = new Date(year, monthIndex, day);
  return now >= target;
}

// eigentlicher Kalender
export function AdventCalendar({
  year = 2025,
  monthIndex = 11 // Dezember
}: {
  year?: number;
  monthIndex?: number; // 0-basiert
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [openedDays, setOpenedDays] = useState<number[]>(() => {
    const stored = localStorage.getItem("openedDays");
    return stored ? JSON.parse(stored) : [];
  });
  const [simDate, setSimDate] = useState("");
  const [showLockedToast, setShowLockedToast] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Google-Fonts wie im Build nachladen
  useEffect(() => {
    const fontUrls = [
      "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&display=swap",
      "https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap"
    ];
    fontUrls.forEach((href) => {
      const link = document.createElement("link");
      link.href = href;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    });
  }, []);

  // welche Tage sind freigeschaltet?
  const unlocked = useMemo(
    () => Array.from({ length: 24 }, (_, i) => isDayUnlocked(simDate, year, monthIndex, i + 1)),
    [simDate, year, monthIndex]
  );

  // openedDays in localStorage spiegeln
  useEffect(() => {
    localStorage.setItem("openedDays", JSON.stringify(openedDays));
  }, [openedDays]);

  // Klick auf ein Türchen
  const openDay = (dayNumber: number, indexInOrder: number) => {
    if (!unlocked[dayNumber - 1]) {
      setShowLockedToast(true);
      setTimeout(() => setShowLockedToast(false), 1200);
      return;
    }
    setSelectedIndex(indexInOrder);
    setActiveImageIndex(0);
    if (!openedDays.includes(dayNumber)) {
      setOpenedDays((prev) => [...prev, dayNumber]);
    }
  };

  const selectedDay = selectedIndex !== null ? orderedDays[selectedIndex] : null;

  // automatischer Bildwechsel im Modal
  useEffect(() => {
    if (!selectedDay || !selectedDay.images || selectedDay.images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) =>
        prev + 1 >= selectedDay.images.length ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedDay]);

  // Hilfsklasse für aspect ratio
  const aspectClass = (aspect?: string) => {
    switch (aspect) {
      case "landscape":
        return "aspect-[4/3]";
      case "portrait":
        return "aspect-[3/4]";
      case "16x9-breit":
        return "aspect-[16/9]";
      case "3x2-breit":
        return "aspect-[3/2]";
      case "9x16-hoch":
        return "aspect-[9/16]";
      case "2x3-hoch":
        return "aspect-[2/3]";
      default:
        return "aspect-square";
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        fontFamily: "'Cinzel Decorative', serif"
      }}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/70 text-center py-5 backdrop-blur flex flex-col items-center space-y-2 overflow-visible">
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
            value={simDate}
            onChange={(e) => setSimDate(e.target.value)}
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

      {/* Masonry-Grid */}
      <main className="pt-52 pb-10 px-4">
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 mx-auto max-w-[1000px]">
          {orderedDays.map((day, index) => {
            const dayNumber = day.day;
            const isOpened = openedDays.includes(dayNumber);

            return (
              <div
                key={dayNumber}
                className="break-inside-avoid mb-4 flex justify-center"
              >
                <button
                  onClick={() => openDay(dayNumber, index)}
                  className="relative w-full overflow-hidden rounded-lg border border-white/10 shadow-md hover:shadow-lg transition-all bg-[#8b0000] hover:bg-[#a80000] cursor-pointer"
                >
                  <div className={aspectClass(day.aspect)}>
                    {isOpened ? (
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
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal */}
      {selectedDay && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={(evt) => {
            if (evt.target === evt.currentTarget) setSelectedIndex(null);
          }}
        >
          <div className="relative bg-white/10 backdrop-blur rounded-2xl p-6 max-w-lg w-full">
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute right-3 top-3 text-white text-2xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2 text-center">
              {selectedDay.title}
            </h2>

            <p
              className="text-center text-white/90 mb-4"
              style={{ fontFamily: "'EB Garamond', serif" }}
            >
              {selectedDay.text}
            </p>

            {selectedDay.images && selectedDay.images.length > 0 && (
              <div className="relative">
                <img
                  src={selectedDay.images[activeImageIndex]}
                  alt={`Türchen ${selectedDay.title}`}
                  className="w-full rounded-xl shadow mb-4 object-cover transition-opacity duration-500"
                />
                {selectedDay.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === 0
                            ? selectedDay.images.length - 1
                            : prev - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
                    >
                      ◀
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev + 1 >= selectedDay.images.length ? 0 : prev + 1
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

      {/* Toast „Not yet“ */}
      {showLockedToast && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black/80 text-white px-6 py-3 rounded-lg text-xl shadow-lg">
            Not yet ✋
          </div>
        </div>
      )}
    </div>
  );
}
