import React, { useState, useEffect } from "react";
import daysConfig from "../data/daysConfig";

const AdventCalendar = () => {
  const [openedDays, setOpenedDays] = useState([]);
  const [activeDay, setActiveDay] = useState(null);
  const [shuffledDays, setShuffledDays] = useState([]);

  // Türchen-Reihenfolge nur einmal pro User mischen
  useEffect(() => {
    const storedShuffle = localStorage.getItem("fraukesShuffle");
    if (storedShuffle) {
      setShuffledDays(JSON.parse(storedShuffle));
    } else {
      const shuffled = [...Array(24).keys()].sort(() => Math.random() - 0.5);
      setShuffledDays(shuffled);
      localStorage.setItem("fraukesShuffle", JSON.stringify(shuffled));
    }
  }, []);

  // Geöffnete Türchen merken
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("fraukesOpenedDays")) || [];
    setOpenedDays(stored);
  }, []);

  const handleOpenDay = (index) => {
    const today = new Date();
    const currentDay = today.getDate();
    const isDecember = today.getMonth() === 11; // Dezember = 11 (0-basiert)

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
    <div className="text-center">
      <h1 className="text-4xl sm:text-5xl font-serif text-white tracking-wide mt-8 mb-4">
        FRAUKES ADVENTSKALENDER 2025
      </h1>

      <button
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded mb-8"
        onClick={() => {
          const all = Array.from({ length: 24 }, (_, i) => i);
          setOpenedDays(all);
          localStorage.setItem("fraukesOpenedDays", JSON.stringify(all));
        }}
      >
        Preview (alle Türchen offen)
      </button>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mx-auto max-w-5xl justify-items-center px-4">
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
              className={`relative ${aspect} rounded-none overflow-hidden shadow-md flex items-center justify-center text-white font-bold text-4xl transition-all ${
                isOpen ? "cursor-pointer" : "cursor-pointer"
              } bg-[#e64a4b] hover:bg-[#d14243]`}
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
                <span className="relative z-10">{i + 1}</span>
              )}
            </button>
          );
        })}
      </div>

      {activeDay !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-neutral-900/90 text-white max-w-3xl p-6 rounded-xl relative overflow-hidden">
            <button
              className="absolute top-3 right-4 text-2xl"
              onClick={handleCloseModal}
            >
              ×
            </button>

            <h2 className="text-2xl sm:text-3xl font-serif mb-2 text-center">
              {daysConfig[activeDay].title}
            </h2>
            <p className="text-lg font-serif mb-4 text-center">
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

            <p className="text-center mt-2 text-sm opacity-80">
              Tag {activeDay + 1} • Advent 2025
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdventCalendar;
