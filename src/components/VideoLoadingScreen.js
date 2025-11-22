import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import videoFile from '../assets/vd1.mp4';

const VideoLoadingScreen = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    let redirectTimer;

    // Play video when component mounts
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Simple setup
      video.muted = false;
      video.playsInline = true;
      video.volume = 1.0;
      
      // Listen for video end event
      const handleVideoEnd = () => {
        // Wait 1 second after video ends, then redirect
        redirectTimer = setTimeout(() => {
          navigate('/home');
        }, 1000);
      };

      // Handle video ready to play
      const handleCanPlay = async () => {
        setVideoLoaded(true);
        console.log('Video can play - starting muted autoplay');
        
        try {
          video.muted = true;
          await video.play();
          console.log('Video playing muted successfully');
        } catch (error) {
          console.log('Video play failed:', error);
        }
      };

      // Handle video loaded
      const handleLoadedData = () => {
        setVideoLoaded(true);
      };

      video.addEventListener('ended', handleVideoEnd);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadeddata', handleLoadedData);
      
      // Force load
      video.load();

      // Cleanup
      return () => {
        if (redirectTimer) clearTimeout(redirectTimer);
        if (video) {
          video.removeEventListener('ended', handleVideoEnd);
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('loadeddata', handleLoadedData);
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
        {!videoLoaded && (
          <div className="video-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
        <video
          ref={videoRef}
          className={`loading-video ${videoLoaded ? 'loaded' : 'loading'}`}
          muted
          playsInline
          preload="auto"
          autoPlay
          controls={false}
          onError={(e) => {
            console.log('Video error:', e);
            console.log('Video src:', videoFile);
          }}
          onLoadStart={() => console.log('Video loading started')}
          onCanPlay={() => console.log('Video can play')}
          onPlay={() => console.log('Video started playing')}
          onLoadedMetadata={() => console.log('Video metadata loaded')}
          onLoadedData={() => console.log('Video data loaded')}
        >
          <source src={videoFile} type="video/mp4" />
          <source src={videoFile} type="video/webm" />
          <source src={videoFile} type="video/ogg" />
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
          transition: opacity 0.5s ease;
        }

        .loading-video.loading {
          opacity: 0;
        }

        .loading-video.loaded {
          opacity: 1;
        }

        .video-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 5;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
