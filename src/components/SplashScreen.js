        import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import barbaryLogo from '../assets/barbary.jpg';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate right after the 3s sequence completes
    const redirectTimer = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="welcome-text">
        <h1>Welcome to Barbari Store</h1>
      </div>

      <div className="logo-container">
        <div className="logo-stack">
          <div className="orb" aria-hidden="true"></div>
          <img
            src={barbaryLogo}
            alt="Barbari Store Logo"
            className="logo"
          />
        </div>
      </div>

      {/* shards overlay */}
      <div className="shards" aria-hidden="true">
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <style>{`
        .splash-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: radial-gradient(1200px 600px at 50% -20%, rgba(236,72,153,0.18), transparent 60%),
                      radial-gradient(800px 400px at 100% 100%, rgba(244,114,182,0.15), transparent 60%),
                      linear-gradient(120deg, #ffffff 0%, #fff5fa 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          overflow: hidden;
          /* Subtle background motion */
          animation: gradientShift 3s ease forwards;
        }

        .logo-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2rem;
        }

        .logo-stack {
          position: relative;
          width: 170px;
          height: 170px;
          display: grid;
          place-items: center;
        }

        .orb {
          position: absolute;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background:
            conic-gradient(from 0deg, rgba(236,72,153,0) 0deg, rgba(236,72,153,0.7) 80deg, rgba(236,72,153,0) 120deg),
            conic-gradient(from 180deg, rgba(244,114,182,0) 0deg, rgba(244,114,182,0.6) 70deg, rgba(244,114,182,0) 120deg);
          filter: blur(0.5px) saturate(1.1);
          animation: spinRing 3s linear forwards;
          box-shadow: 0 0 24px rgba(236,72,153,0.25), inset 0 0 30px rgba(236,72,153,0.15);
        }

        .logo {
          width: 150px;
          height: 150px;
          object-fit: contain;
          border-radius: 50%;
          animation: rotateOnce 3s linear forwards, pulse 2s ease-in-out infinite;
          box-shadow: 0 10px 30px rgba(236,72,153,0.28);
          filter: drop-shadow(0 0 8px rgba(236,72,153,0.35));
        }

        @keyframes rotateOnce {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

        .welcome-text {
          animation: textAppear 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          opacity: 0;
          margin-bottom: 1.25rem;
        }

        .welcome-text h1 {
          color: #ec4899;
          font-size: 2.5rem;
          font-weight: 700;
          text-align: center;
          margin: 0;
          font-family: 'Cairo', sans-serif;
          text-shadow: 0 4px 8px rgba(236, 72, 153, 0.4);
          background: linear-gradient(45deg, #ec4899, #f472b6, #ec4899);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes textAppear {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
            filter: blur(10px);
          }
          50% {
            opacity: 0.7;
            transform: translateY(6px) scale(1.02);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Subtle background motion */
        @keyframes gradientShift {
          0% { background-position: 0% 0%, 100% 100%, 0% 0%; }
          100% { background-position: 10% -5%, 95% 105%, 0% 0%; }
        }

        /* Shatter overlay */
        .shards {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-template-rows: repeat(6, 1fr);
          pointer-events: none;
        }
        .shards span {
          display: block;
          background: rgba(255,255,255,0.9);
          /* sample the bg color lightly so it feels like breaking */
          border: 1px solid rgba(236,72,153,0.06);
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          opacity: 0;
          animation: popShard 0.5s ease forwards;
          animation-delay: 2.6s; /* start near the end */
        }
        /* Different trajectories */
        .shards span:nth-child(6n+1) { --dx: -24px; --dy: -18px; --rot: -15deg; }
        .shards span:nth-child(6n+2) { --dx: -10px; --dy: -26px; --rot: -8deg; }
        .shards span:nth-child(6n+3) { --dx:  14px; --dy: -22px; --rot: 12deg; }
        .shards span:nth-child(6n+4) { --dx:  22px; --dy: -8px;  --rot: 18deg; }
        .shards span:nth-child(6n+5) { --dx: -20px; --dy:  10px; --rot: -12deg; }
        .shards span:nth-child(6n+6) { --dx:  16px; --dy:  16px; --rot: 10deg; }
        .shards span:nth-child(odd)   { animation-duration: 0.55s; }
        .shards span:nth-child(even)  { animation-duration: 0.45s; }

        @keyframes popShard {
          0% { opacity: 0; transform: translate(0,0) rotate(0deg) scale(1); filter: blur(0px); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(1.08); filter: blur(2px); }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .logo {
            width: 100px;
            height: 100px;
          }

          .welcome-text h1 {
            font-size: 2rem;
            padding: 0 1rem;
          }
        }

        @media (max-width: 480px) {
          .logo {
            width: 80px;
            height: 80px;
          }

          .welcome-text h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
