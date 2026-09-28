import { ImageResponse } from 'next/server';

export const runtime = 'edge';
export const alt = 'Kezera Tech — Designing the Future Through Technology';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1b3e 50%, #061d48 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background grid effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,200,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,136,204,0.15) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Logo mark — infinity SVG */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 48 48"
          fill="none"
          style={{ marginBottom: 24, position: 'relative' }}
        >
          <path
            d="M14 16C9.58 16 6 19.58 6 24C6 28.42 9.58 32 14 32C18 32 21 28 24 24C27 20 30 16 34 16C38.42 16 42 19.58 42 24C42 28.42 38.42 32 34 32C30 32 27 28 24 24"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M14 16C9.58 16 6 19.58 6 24C6 28.42 9.58 32 14 32"
            stroke="#00AAFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <circle cx="6" cy="24" r="3" fill="#00AAFF" />
          <circle cx="24" cy="24" r="3" fill="#00AAFF" />
          <circle cx="42" cy="24" r="3" fill="#00AAFF" />
        </svg>

        {/* Company name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 16,
            position: 'relative',
          }}
        >
          <span style={{ color: 'white', fontSize: 52, fontWeight: 700, letterSpacing: -2 }}>
            Kezera
          </span>
          <span style={{ color: '#00AAFF', fontSize: 52, fontWeight: 700, letterSpacing: -2 }}>
            Tech
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 22,
            letterSpacing: 2,
            textTransform: 'uppercase',
            position: 'relative',
          }}
        >
          Designing the Future Through Technology
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(255,255,255,0.3)',
            fontSize: 14,
          }}
        >
          <span>kezeratech.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
