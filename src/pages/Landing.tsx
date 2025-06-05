import React, { useState, useRef, useEffect } from "react";
import "./Landing.css";
import videoFile from "../assets/bgvid3.mp4";

import robotBase from "../assets/z31body.png";
import glowEyes from "../assets/eyes.png";
import glowMouth from "../assets/mouth2.png";
import glowChest from "../assets/chestlights.png";
import glowName from "../assets/z31name.png";

const Landing = () => {
  const [showSite, setShowSite] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if user has already seen the intro this session
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro === "true") {
      setShowSite(true); // Skip intro if already seen
    }
  }, []);

  const handleVideoEnd = () => {
    sessionStorage.setItem("hasSeenIntro", "true"); // Mark as seen
    setFadeOut(true);
    setTimeout(() => {
      setShowSite(true);
    }, 1000); // 1 second fade transition
  };

  const skipIntro = () => {
    sessionStorage.setItem("hasSeenIntro", "true"); // Mark as seen
    setFadeOut(true);
    setTimeout(() => {
      setShowSite(true);
    }, 500);
  };

  // Auto-advance after 8 seconds as backup
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!showSite) {
        sessionStorage.setItem("hasSeenIntro", "true"); // Mark as seen
        setFadeOut(true);
        setTimeout(() => {
          setShowSite(true);
        }, 1000);
      }
    }, 8000); // 8 seconds

    return () => clearTimeout(timer);
  }, [showSite]);

  if (showSite) {
    return (
      <div className="main-site">
        {/* Floating particles */}
        <div className="floating-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        {/* Twinkling stars container */}
        <div className="shooting-stars">
          <div className="shooting-star"></div>
          <div className="shooting-star orange"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star blue"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star orange"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star blue"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star orange"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star blue"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star orange"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star blue"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star orange"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star blue"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star orange"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star blue"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star orange"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star blue"></div>
          <div className="shooting-star"></div>
        </div>

        <div className="overlay-text">
          <h1>
            <span className="kompoz-text">{`{Kompoz}`}</span> the chaos.
            <br />
            Follow the <span className="voices-text">voices</span> that move the
            markets.
          </h1>
          <p>
            We harness the power of AI to analyze crypto Twitter/X.
            <br />
            Our platform filters the noise, breaking down each post into
            actionable insights using NLP and price data correlation.
          </p>
        </div>

        <div className="robot-wrapper">
          <div className="robot-layers">
            <img src={robotBase} alt="Robot Base" className="robot-layer" />
            <img
              src={glowChest}
              alt="Glow Chest"
              className="glow-layer glow-chest"
            />
            <img
              src={glowName}
              alt="Glow Name"
              className="glow-layer glow-name"
            />
            <img
              src={glowMouth}
              alt="Glow Mouth"
              className="glow-layer glow-mouth"
            />
            <img
              src={glowEyes}
              alt="Glow Eyes"
              className="glow-layer glow-eyes"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`loading-screen ${fadeOut ? "fade-out" : ""}`}>
      <video
        ref={videoRef}
        className="intro-video"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        onError={(e) => console.log("Video error:", e)}
        onLoadStart={() => console.log("Video starting to load")}
        onCanPlay={() => console.log("Video can play")}
      >
        <source src={videoFile} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Skip button */}
      <button className="skip-button" onClick={skipIntro}>
        Skip Intro
      </button>

      {/* Welcome text */}
      <div className="welcome-text">
        <strong>Hi, I am Z31, the agent for Kompoz</strong>
      </div>
    </div>
  );
};

export default Landing;
