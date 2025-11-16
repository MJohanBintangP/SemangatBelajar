import { useEffect, useState } from 'react';

type Prefs = {
  reduceMotion: boolean;
  largeText: boolean;
  highContrast: boolean;
};

const STORAGE_KEY = 'a11yPrefs';

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { reduceMotion: false, largeText: false, highContrast: false };
    return { ...JSON.parse(raw) } as Prefs;
  } catch {
    return { reduceMotion: false, largeText: false, highContrast: false };
  }
}

function savePrefs(p: Prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

function applyPrefs(p: Prefs) {
  document.body.classList.toggle('a11y-reduce-motion', p.reduceMotion);
  document.body.classList.toggle('a11y-large-text', p.largeText);
  document.body.classList.toggle('a11y-high-contrast', p.highContrast);
}

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ reduceMotion: false, largeText: false, highContrast: false });

  useEffect(() => {
    const p = loadPrefs();
    setPrefs(p);
    applyPrefs(p);
  }, []);

  function toggle(key: keyof Prefs) {
    const updated = { ...prefs, [key]: !prefs[key] } as Prefs;
    setPrefs(updated);
    applyPrefs(updated);
    savePrefs(updated);
  }

  function reset() {
    const def = { reduceMotion: false, largeText: false, highContrast: false };
    setPrefs(def);
    applyPrefs(def);
    savePrefs(def);
  }

  return (
    <div className="accessibility-toolbar" aria-hidden={false}>
      <button
        className="accessibility-btn"
        aria-label={open ? 'Tutup pengaturan aksesibilitas' : 'Buka pengaturan aksesibilitas'}
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
      >
        A11Y
      </button>

      {open && (
        <div className="accessibility-panel" role="dialog" aria-label="Opsi aksesibilitas">
          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-between">
              <span className="text-sm">Kurangi animasi</span>
              <button
                className="accessibility-btn"
                onClick={() => toggle('reduceMotion')}
                aria-pressed={prefs.reduceMotion}
              >
                {prefs.reduceMotion ? 'On' : 'Off'}
              </button>
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm">Perbesar teks</span>
              <button
                className="accessibility-btn"
                onClick={() => toggle('largeText')}
                aria-pressed={prefs.largeText}
              >
                {prefs.largeText ? 'On' : 'Off'}
              </button>
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm">High contrast</span>
              <button
                className="accessibility-btn"
                onClick={() => toggle('highContrast')}
                aria-pressed={prefs.highContrast}
              >
                {prefs.highContrast ? 'On' : 'Off'}
              </button>
            </label>

            <div className="flex justify-between items-center pt-1">
              <button className="accessibility-btn" onClick={reset}>Reset</button>
              <button className="accessibility-btn" onClick={() => setOpen(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
