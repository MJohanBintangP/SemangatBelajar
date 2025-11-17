import { CloverIcon } from '@phosphor-icons/react';
import Marquee from 'react-fast-marquee';
import { useEffect, useState } from 'react';

import bg1 from '../../assets/1.svg';
import bg2 from '../../assets/2.svg';
import bh3 from '../../assets/3.svg';
import bg4 from '../../assets/4.svg';
import bg5 from '../../assets/5.svg';

export default function FiturUtama() {
  const [playMarquee, setPlayMarquee] = useState(true);

  useEffect(() => {
    const compute = () => {
      try {
        const raw = localStorage.getItem('a11yPrefs');
        const prefs = raw ? JSON.parse(raw) : null;
        const reduceMotionPref = !!(prefs && prefs.reduceMotion);
        const osPref = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const bodyHas = typeof document !== 'undefined' && document.body.classList.contains('a11y-reduce-motion');
        return !(reduceMotionPref || osPref || bodyHas);
      } catch {
        return true;
      }
    };

    const value = compute();
    setPlayMarquee(value);

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'a11yPrefs') setPlayMarquee(compute());
    };
    window.addEventListener('storage', onStorage);

    let mql: MediaQueryList | null = null;
    let mm: (() => void) | null = null;
    try {
      if (window.matchMedia) {
        mql = window.matchMedia('(prefers-reduced-motion: reduce)');
        mm = () => setPlayMarquee(compute());
        if (mql.addEventListener) mql.addEventListener('change', mm);
        else mql.addListener(mm);
      }
    } catch {
      /* ignore */
    }

    const body = typeof document !== 'undefined' ? document.body : null;
    let mo: MutationObserver | null = null;
    if (body) {
      mo = new MutationObserver(() => setPlayMarquee(compute()));
      mo.observe(body, { attributes: true, attributeFilter: ['class'] });
    }

    return () => {
      window.removeEventListener('storage', onStorage);
      if (mql) {
        try {
          if (mm) {
            if (mql.removeEventListener) mql.removeEventListener('change', mm);
            else mql.removeListener(mm);
          }
        } catch {
          /* ignore */
        }
      }
      if (mo) mo.disconnect();
    };
  }, []);

  const images = [bg1, bg2, bh3, bg4, bg5];
  const items = [...images, ...images];

  return (
    <section id="fitur" className="mt-20 bg-white px-4 md:px-20 lg:px-32 py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Badge Solusi Kami */}
        <div className="relative left-5 lg:left-40 flex gap-2 items-center bg-black rounded-full px-6 py-1 mb-4 text-white w-fit">
          <CloverIcon className="overflow-clip rotate-12" size={30} weight="bold" />
          <h3 className="font-semibold">Solusi Kami</h3>
        </div>

        {/* Heading and Description */}
        <div className="flex flex-col md:flex-row md:flex-wrap items-start md:justify-between gap-6 mb-10 px-4 md:px-0 min-w-0">
          <h1
            id="fitur-heading"
            className="text-[#009B08] font-medium mb-4 md:mb-0 md:basis-2/3 min-w-0 wrap-break-word"
            style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', lineHeight: 1.05 }}
          >
            Mendorong Aksi Konservasi yang Efektif melalui Teknologi dan Analisis Data
          </h1>
          <p
            className="text-left text-[#8F8F8F] md:flex-none md:basis-1/3 max-w-full md:max-w-[350px] min-w-0"
            style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)', lineHeight: 1.6 }}
          >
            Perubahan besar tidak bisa dilakukan sendiri. Ecosteps menjembatani laporan masyarakat dengan puluhan lembaga pemerintah dan organisasi masyarakat sipil di bidang lingkungan.
          </p>
        </div>

        {/* Full-bleed marquee is placed outside the max-width container so it truly spans the viewport */}
        <div className="overflow-hidden relative w-full" aria-labelledby="fitur-heading" role="region">
          {/* Continuous, slow, seamless marquee - accessible and responsive */}
          <Marquee
            gradient={false}
            speed={12}
            pauseOnHover={true}
            pauseOnClick={true}
            play={playMarquee}
            key={String(playMarquee)}
            loop={0}
            className="marquee-ignore-reduce z-0 flex items-center gap-2 sm:gap-4 md:gap-6 w-full"
            aria-label="galeri solusi - marquee"
            style={{ padding: '0.25rem 0' }}
          >
            {items.map((src, idx) => (
              <figure key={`${idx}-${src}`} role="listitem" className="shrink-0 rounded-2xl overflow-hidden mr-2 sm:mr-4 md:mr-6">
                <img
                  src={src}
                  alt={`Solusi ${(idx % images.length) + 1}`}
                  loading="lazy"
                  draggable={false}
                  className="block h-44 md:h-56 lg:h-72 object-cover rounded-2xl"
                  style={{ width: 'clamp(120px, 20vw, 320px)' }}
                />
              </figure>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
