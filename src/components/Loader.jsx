import { useEffect, useState } from 'react';

/** Прелоадер со шприцем. Показывается один раз за сессию (sessionStorage). */
export default function Loader() {
  const [phase, setPhase] = useState(() =>
    sessionStorage.getItem('loaderShown') ? 'gone' : 'show'
  ); // show -> hiding -> gone
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase !== 'show') return;
    sessionStorage.setItem('loaderShown', 'true');

    let p = 0;
    let t1, t2;
    const id = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 100) {
        p = 100;
        setProgress(100);
        clearInterval(id);
        t1 = setTimeout(() => {
          setPhase('hiding');
          t2 = setTimeout(() => setPhase('gone'), 900);
        }, 300);
      } else {
        setProgress(p);
      }
    }, 200);

    return () => {
      clearInterval(id);
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'gone') return null;

  return (
    <div id="loader" className={phase === 'hiding' ? 'is-hidden' : ''}>
      <svg width="320" height="130" viewBox="0 0 320 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="barrel-clip">
            <rect x="72" y="36" width="150" height="34" rx="5" />
          </clipPath>
        </defs>

        <g className="spark" style={{ transformOrigin: '260px 18px' }}>
          <rect x="257" y="15" width="6" height="6" fill="#c49ee0" transform="rotate(45,260,18)" />
        </g>
        <g className="spark" style={{ transformOrigin: '280px 10px' }}>
          <rect x="277" y="7" width="5" height="5" fill="#dfc0f0" transform="rotate(45,280,10)" />
        </g>
        <g className="spark" style={{ transformOrigin: '248px 26px' }}>
          <rect x="245" y="23" width="4" height="4" fill="#b07fd4" transform="rotate(45,248,26)" />
        </g>

        <rect x="220" y="48" width="72" height="8" rx="3" fill="#c8cfe0" />
        <path d="M292 48 L312 52 L292 56 Z" fill="#a8b0c4" />
        <rect x="228" y="49" width="44" height="2" rx="1" fill="white" opacity="0.55" />

        <rect x="70" y="34" width="154" height="38" rx="8" stroke="#b07fd4" strokeWidth="1.5" fill="white" fillOpacity="0.65" />

        <g clipPath="url(#barrel-clip)">
          <g className="liquid-shrink" style={{ transformOrigin: '220px 53px' }}>
            <rect x="72" y="36" width="150" height="34" rx="5" fill="#d4b8e0" />
            <rect x="84" y="41" width="14" height="24" rx="4" fill="white" opacity="0.28" />
            <rect x="108" y="43" width="7" height="20" rx="3" fill="white" opacity="0.18" />
            <circle cx="140" cy="60" r="4" fill="white" opacity="0.35" className="bubble" />
            <circle cx="165" cy="56" r="3" fill="white" opacity="0.3" className="bubble" />
            <circle cx="120" cy="62" r="3" fill="white" opacity="0.25" className="bubble" />
          </g>
        </g>

        {[112, 142, 172, 202].map((x) => (
          <g className="scale-mark" key={x}>
            <line x1={x} y1="34" x2={x} y2="25" stroke="#9b72b8" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ))}

        <rect x="218" y="40" width="10" height="26" rx="4" fill="#c8cfe0" stroke="#a8b0c4" strokeWidth="1" />

        <g className="plunger-push">
          <rect x="14" y="49" width="106" height="8" rx="3" fill="#dfc0f0" />
          <rect x="8" y="38" width="12" height="30" rx="4" fill="#c49ee0" stroke="#9b72b8" strokeWidth="1" />
          <rect x="0" y="44" width="12" height="18" rx="3" fill="#9b72b8" />
          <line x1="3" y1="49" x2="9" y2="49" stroke="white" strokeWidth="1.2" opacity="0.55" />
          <line x1="3" y1="53" x2="9" y2="53" stroke="white" strokeWidth="1.2" opacity="0.55" />
          <line x1="3" y1="57" x2="9" y2="57" stroke="white" strokeWidth="1.2" opacity="0.55" />
        </g>

        <g className="drip1" style={{ transformOrigin: '311px 58px' }}>
          <ellipse cx="311" cy="64" rx="6" ry="8" fill="#9b72b8" />
          <ellipse cx="309" cy="61" rx="2.5" ry="2" fill="#dfc0f0" opacity="0.7" />
        </g>
        <g className="drip2" style={{ transformOrigin: '308px 58px' }}>
          <ellipse cx="308" cy="62" rx="4.5" ry="6" fill="#b07fd4" opacity="0.85" />
          <ellipse cx="307" cy="60" rx="1.8" ry="1.5" fill="white" opacity="0.5" />
        </g>
        <g className="drip3" style={{ transformOrigin: '313px 57px' }}>
          <ellipse cx="313" cy="61" rx="3" ry="4" fill="#c49ee0" opacity="0.8" />
        </g>

        <circle cx="312" cy="52" className="tip-glow" fill="#b07fd4" opacity="0.5" />
      </svg>

      <div className="progress-wrap">
        <div className="progress-bar" id="progress-bar" style={{ width: progress + '%' }}></div>
      </div>

      <div className="label-wrap">
        <p className="lbl">Загрузка</p>
        <div className="dots">
          <span>·</span>
          <span>·</span>
          <span>·</span>
        </div>
      </div>
    </div>
  );
}
