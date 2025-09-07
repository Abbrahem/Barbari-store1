import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

const VideoLoadingScreen = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    let redirectTimer;

    // Play video when component mounts
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0; // Ensure normal playback speed
      videoRef.current.currentTime = 0; // Start from beginning
      
      // Listen for video end event
      const handleVideoEnd = () => {
        // Wait 1 second after video ends, then redirect
        redirectTimer = setTimeout(() => {
          navigate('/home');
        }, 1000);
      };

      videoRef.current.addEventListener('ended', handleVideoEnd);
      
      videoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });

      // Cleanup event listener
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('ended', handleVideoEnd);
        }
        if (redirectTimer) {
          clearTimeout(redirectTimer);
        }
      };
    }
  }, [navigate]);

  const handleEnterClick = () => {
    navigate('/home');
  };

  return (
    <div className="video-loading-screen">
      <div className="video-container">
        <video
          ref={videoRef}
          className="loading-video"
          muted
          playsInline
          preload="auto"
          controls={false}
        >
          <source src="/vd1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <button 
          className="enter-button"
          onClick={handleEnterClick}
        >
          ENTER
        </button>
      </div>

      <div className="social-icons">
        <a href="https://www.instagram.com/barbari.eg/" target="_blank" rel="noopener noreferrer" className="social-icon">
          <FaInstagram />
        </a>
        <a href="https://www.tiktok.com/@barbari_eg" target="_blank" rel="noopener noreferrer" className="social-icon">
          <FaTiktok />
        </a>
      </div>

      <style>{`
        .video-loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #000;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          overflow: hidden;
        }

        .video-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .loading-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #000;
        }

        .enter-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          font-weight: bold;
          font-family: 'Arial', sans-serif;
          cursor: pointer;
          padding: 15px 30px;
          transition: all 0.3s ease;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
          z-index: 10;
        }

        .enter-button:hover {
          transform: translate(-50%, -50%) scale(1.1);
          text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
        }

        .enter-button:active {
          transform: translate(-50%, -50%) scale(0.95);
        }

        .social-icons {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 20px;
          z-index: 10;
        }

        .social-icon {
          color: white;
          font-size: 2rem;
          transition: all 0.3s ease;
          text-decoration: none;
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.7));
        }

        .social-icon:hover {
          transform: scale(1.2);
          color: #ec4899;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .loading-video {
            object-fit: cover;
          }

          .enter-button {
            font-size: 1.5rem;
            padding: 12px 24px;
          }

          .social-icon {
            font-size: 1.5rem;
          }

          .social-icons {
            bottom: 20px;
            gap: 15px;
          }
        }

        @media (max-width: 480px) {
          .loading-video {
            object-fit: cover;
          }

          .enter-button {
            font-size: 1.2rem;
            padding: 10px 20px;
          }

          .social-icon {
            font-size: 1.3rem;
          }

          .social-icons {
            bottom: 15px;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoLoadingScreen;
