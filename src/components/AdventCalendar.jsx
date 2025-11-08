import React, { useState, useEffect } from "react";
import daysConfig from "../data/daysConfig";

const AdventCalendar = () => {
  const [openedDays, setOpenedDays] = useState([]);
  const [activeDay, setActiveDay] = useState(null);
  const [shuffledDays, setShuffledDays] = useState([]);

  useEffect(() => {
    const storedShuffle = localStorage.getItem("fraukesShuffle");
    if (storedShuffle) {
      setShuffledDays(JSON.parse(storedShuffle));
    } else {
      const shuffled = [...Array(24).keys()].sort(() => Math.random() - 0.5);
      setShuffledDays(shuffled);
      localStorage.setItem("fraukesShuffle", JSON.stringify(shuffled));
    }

    const stored = JSON.parse(localStorage.getItem("fraukesOpenedDays")) || [];
    setOpenedDays(stored);
  }, []);

  const handleOpenDay = (index) => {
    const today = new Date();
    const currentDay = today.getDate();
    const isDecember = today.getMonth() === 11;

    if (!isDecember && !window.location.href.includes("preview")) return;
    if (index + 1 > currentDay && !window.location.href.includes("preview")) return;

    if (!openedDays.includes(index)) {
      const updated = [...openedDays, index];
      setOpenedDays(updated);
      localStorage.setItem("fraukesOpenedDays", JSON.stringify(updated));
    }
    setActiveDay(index);
  };

  const handleCloseModal = () => setActiveDay(null);

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center text-center"
      style={{ backgroundImage: "url('/bilder/hintergrund.jpg')" }}
    >
      {/* Header */}
      <header className="sticky top-0 bg-neutral-800/80 py-4 shadow-lg z-20 backdrop-blur-md">
        <h1 className="text-4xl sm:text-5xl font-[Cinzel_Decorative] text-white tracking-wide">
          FRAUKES ADVENTSKALENDER 2025
        </h1>
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-1 rounded mt-2 font-[Cinzel_Decorative]"
          onClick={() => {
            const all = Array.from({ length: 24 }, (_, i) => i);
            setOpenedDays(all);
            localStorage.setItem("fraukesOpenedDays", JSON.stringify(all));
          }}
        >
          Preview (alle Türchen offen)
        </button>
      </header>

      {/* Kalender-Grid */}
      <div className="grid auto-rows-auto grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-4 justify-items-center mx-auto max-w-4xl px-4 py-10 grid-flow-dense">
        {shuffledDays.map((i) => {
          const isOpen = openedDays.includes(i);
          const day = daysConfig[i];
          const aspect =
            day?.aspect === "landscape"
              ? "aspect-[4/3]"
              : day?.aspect === "square"
              ? "aspect-square"
              : "aspect-[3/4]";

          return (
            <button
              key={i}
              onClick={() => handleOpenDay(i)}
              className={`relative ${aspect} w-full overflow-hidden flex items-center justify-center text-white font-bold text-3xl sm:text-4xl transition-all bg-[#e64a4b] hover:bg-[#d14243] z-10`}
            >
              {isOpen && day?.images?.[0] ? (
                <>
                  <img
                    src={day.images[0]}
                    alt={`Tag ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </>
              ) : (
                <span className="relative z-10 font-[Cinzel_Decorative]">{i + 1}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Modal */}
      {activeDay !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-neutral-900/90 text-white max-w-3xl p-6 rounded-xl relative overflow-hidden">
            <button
              className="absolute top-3 right-4 text-2xl"
              onClick={handleCloseModal}
            >
              ×
            </button>

            <h2 className="text-2xl sm:text-3xl font-[Cinzel_Decorative] mb-2 text-center">
              {daysConfig[activeDay].title}
            </h2>
            <p className="text-lg font-[Cinzel_Decorative] mb-4 text-center">
              {daysConfig[activeDay].text}
            </p>

            {daysConfig[activeDay].images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Tag ${activeDay + 1}`}
                className="w-full object-contain mb-2"
              />
            ))}

            <p className="text-center mt-2 text-sm opacity-80 font-[Cinzel_Decorative]">
              Tag {activeDay + 1} • Advent 2025
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdventCalendar;
