export const DEFAULT_LEVELS = [
    {
      id: 1,
      title: "MISSION 01: THE OLD CLOCK",
      hint: "Where time stands still and pigeons gather, a bronze face watches the square. Look beneath the northern bench — three words are etched in stone.",
      riddle:
        "I have hands but cannot clap. I stand in the open yet I am never alone. Find me where the city breathes oldest.",
      secretCode: "ALPHA-7",
      location: "City Hall Square, North Bench",
    },
    {
      id: 2,
      title: "MISSION 02: THE IRON BRIDGE",
      hint: "Cross the oldest iron span in the district. The third rivet from the left on the eastern railing hides a sticker — peel it, read it.",
      riddle:
        "I connect two worlds yet belong to neither. Rust is my armor, water my shadow. Walk my spine at dawn.",
      secretCode: "BRAVO-14",
      location: "Iron Bridge, East Railing",
    },
    {
      id: 3,
      title: "MISSION 03: THE HIDDEN MURAL",
      hint: "Behind the coffee shop on Meridian Lane, an alley holds a mural of a red fox. The code is painted small in the fox's eye.",
      riddle:
        "I am art born in secret, seen by few, rained on by many. I hide in plain sight where deliveries are made.",
      secretCode: "CHARLIE-22",
      location: "Meridian Lane Alley Mural",
    },
    {
      id: 4,
      title: "MISSION 04: THE STONE LIBRARY",
      hint: "Enter the old stone library. In the geology section, shelf 4, find the book titled 'Earth's Deep Memory'. The code is on the last page.",
      riddle:
        "Knowledge is my currency, silence my law. I hold a million voices yet none may speak. Seek the oldest stones within my walls.",
      secretCode: "DELTA-33",
      location: "Stone Library, Geology Section",
    },
    {
      id: 5,
      title: "MISSION 05: THE FINAL SIGNAL",
      hint: "Return to where you started — the plaza fountain. Look at the coin mosaic on the fountain floor. The final code is spelled in blue tiles.",
      riddle:
        "All roads lead here. Every hunt ends where it began. The water remembers every wish ever thrown into its heart.",
      secretCode: "OMEGA-FINAL",
      location: "Plaza Fountain — The Origin",
    },
  ];
  
  
  const KEYS = {
    LEVELS:        "spothunt_levels",
    CURRENT_LEVEL: "spothunt_current_level",
    UNLOCKED:      "spothunt_unlocked",
    COMPLETED:     "spothunt_completed",
  };
  
  export function loadLevels() {
    try {
      const stored = localStorage.getItem(KEYS.LEVELS);
      return stored ? JSON.parse(stored) : DEFAULT_LEVELS;
    } catch {
      return DEFAULT_LEVELS;
    }
  }
  
  export function saveLevels(levels) {
    localStorage.setItem(KEYS.LEVELS, JSON.stringify(levels));
  }
  
  export function loadCurrentLevel() {
    const val = localStorage.getItem(KEYS.CURRENT_LEVEL);
    return val ? parseInt(val, 10) : 1;
  }
  
  export function saveCurrentLevel(level) {
    localStorage.setItem(KEYS.CURRENT_LEVEL, String(level));
  }
  
  export function loadUnlocked() {
    return localStorage.getItem(KEYS.UNLOCKED) === "true";
  }
  
  export function saveUnlocked(val) {
    localStorage.setItem(KEYS.UNLOCKED, String(val));
  }
  
  export function loadCompleted() {
    return localStorage.getItem(KEYS.COMPLETED) === "true";
  }
  
  export function saveCompleted(val) {
    localStorage.setItem(KEYS.COMPLETED, String(val));
  }
  
  export function resetGame() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  }