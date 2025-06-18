import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const videoRef = useRef(null);
  const navigate = useNavigate();

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

  // Generate stars - WHITE AND ORANGE ONLY
  const generateStars = () => {
    const stars = [];
    const starTypes = ["", "orange"]; // Only white (empty string) and orange

    // Generate 120 stars total
    for (let i = 0; i < 120; i++) {
      const starType = starTypes[i % 2]; // Alternate between white and orange
      stars.push(<div key={i} className={`shooting-star ${starType}`}></div>);
    }

    return stars;
  };

  // Handle get started button click
  const handleGetStarted = () => {
    navigate("/");
  };

  if (showSite) {
    return (
      <div className="main-site">
        {/* Twinkling stars container with many more stars */}
        <div className="shooting-stars">{generateStars()}</div>

        {/* Centered Caption */}
        <div className="main-caption">
          <h1>Future of Media Analytics</h1>
          <p>Quantifying crypto influence through AI-driven tweet intelligence.</p>
        </div>

        {/* Get Started Button */}
        <div className="get-started-wrapper">
          <button className="get-started-btn" onClick={handleGetStarted}>
            Let's Get Started
          </button>
        </div>

        <div className="robot-wrapper">
          <div className="robot-animation">
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
       
      </div>
    </div>
  );
};

export default Landing;
