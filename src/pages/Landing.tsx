import React, { useEffect, useRef } from 'react';
import './Landing.css';
import gsap from 'gsap';

import robotBase from '../assets/robotempty.png';
import glowEyes from '../assets/eyes.png';
import glowMouth from '../assets/mouth.png';
import glowChest from '../assets/chestlights.png';
import glowName from '../assets/namelight.png';

const Landing = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const robotWrapperRef = useRef<HTMLDivElement>(null);
  const robotLayersRef = useRef<HTMLDivElement>(null);
  const glowRefs = {
    eyes: useRef<HTMLImageElement>(null),
    mouth: useRef<HTMLImageElement>(null),
    name: useRef<HTMLImageElement>(null),
    chest: useRef<HTMLImageElement>(null),
  };

  // Simplified centering approach - no dynamic transform calculations
  useEffect(() => {
    // Function to properly center the robot
    const centerRobot = () => {
      if (robotWrapperRef.current && robotLayersRef.current) {
        // Get the robot base image
        const robotBase = robotLayersRef.current.querySelector('.robot-layer') as HTMLImageElement;
        if (robotBase) {
          // Apply centering calculations after image loads
          if (robotBase.complete) {
            setRobotDimensions(robotBase);
          } else {
            robotBase.onload = () => setRobotDimensions(robotBase);
          }
        }
      }
    };

    // Helper function for setting robot dimensions only (no transform changes)
    const setRobotDimensions = (robotBase: HTMLImageElement) => {
      const baseWidth = robotBase.offsetWidth;
      
      // Set exact width to robot wrapper and layers
      robotLayersRef.current!.style.width = `${baseWidth}px`;
      
      // Make sure all glow layers match exactly
      const glowLayers = robotLayersRef.current!.querySelectorAll('.glow-layer');
      glowLayers.forEach((layer) => {
        (layer as HTMLElement).style.width = `${baseWidth}px`;
      });
    };

    // Initial centering
    centerRobot();
    
    // Also center on window resize
    window.addEventListener('resize', centerRobot);
    window.addEventListener('load', centerRobot);
    
    return () => {
      window.removeEventListener('resize', centerRobot);
      window.removeEventListener('load', centerRobot);
    };
  }, []);

  useEffect(() => {
    const masterTimeline = gsap.timeline();
    
    // 1. Start with black screen
    if (backgroundRef.current) {
      gsap.set(backgroundRef.current, {
        background: 'black'
      });
    }
    
    // Hide robot initially but preserve translateX
    if (robotWrapperRef.current) {
      // Important: Store the original transform (translateX) so we don't lose centering
      const originalTransform = 'translateX(-50%)';

      // Set initial state with the robot below viewport
      gsap.set(robotWrapperRef.current, {
        css: {
          // Keep the translateX(-50%) for centering but add Y offset to hide below
          transform: `${originalTransform} translateY(400px)`,
          autoAlpha: 0
        }
      });
    }
    
    // Make sure all lights are off initially
    const glowElements = [
      glowRefs.eyes.current,
      glowRefs.mouth.current,
      glowRefs.name.current,
      glowRefs.chest.current
    ].filter(el => el !== null);
    
    if (glowElements.length) {
      gsap.set(glowElements, {
        opacity: 0
      });
    }

    // Wait a moment before starting
    masterTimeline.to({}, { duration: 1 });
    
    // 2. Sunrise background animation
    if (backgroundRef.current) {
      masterTimeline.to(backgroundRef.current, {
        background: 'radial-gradient(ellipse at bottom center, rgba(255, 255, 255, 0.85) 5%, rgba(255, 119, 0, 0.85) 10%, rgba(220, 33, 33, 0.95) 30%, black 100%)',
        duration: 3.5,
        ease: 'power1.inOut'
      });
    }
    
    // 3. Robot rises from bottom - uses translateY to preserve the horizontal centering
    if (robotWrapperRef.current) {
      masterTimeline.to(robotWrapperRef.current, {
        css: {
          transform: 'translateX(-50%) translateY(0px)', // Keep X transform, reset Y
          autoAlpha: 1
        },
        duration: 2.5,
        ease: 'power2.out'
      });
    }
    
    // 4. Eyes light up
    if (glowRefs.eyes.current) {
      masterTimeline.to(glowRefs.eyes.current, {
        opacity: 1,
        filter: 'brightness(25) blur(10px)',
        duration: 1.8,
        ease: 'power1.inOut'
      });
    }
    
    // 5. Mouth lights up
    if (glowRefs.mouth.current) {
      masterTimeline.to(glowRefs.mouth.current, {
        opacity: 1,
        filter: 'brightness(10) blur(3px)',
        duration: 0.8
      }, "+=0.3");
    }
    
    // 6. Name and chest light up together
    if (glowRefs.name.current && glowRefs.chest.current) {
      masterTimeline.to([glowRefs.name.current, glowRefs.chest.current], {
        opacity: 1,
        filter: 'brightness(5) blur(3px)',
        duration: 1.2
      });
    }
    
    // 7. Create pulsating animations - FIXED to just change brightness and not move
    const eyesTimeline = gsap.timeline({repeat: -1, yoyo: true});
    const chestNameTimeline = gsap.timeline({repeat: -1, yoyo: true});
    
    if (glowRefs.eyes.current) {
      // Create a separate timeline for brightness animation only
      eyesTimeline.to(glowRefs.eyes.current, {
        filter: 'brightness(25) blur(12px)',
        duration: 1.2,
        ease: "sine.inOut"
      })
      .to(glowRefs.eyes.current, {
        filter: 'brightness(15) blur(8px)',
        duration: 1.2,
        ease: "sine.inOut" 
      });
    }
    
    if (glowRefs.name.current && glowRefs.chest.current) {
      // Create a separate timeline for brightness animation only
      chestNameTimeline.to([glowRefs.name.current, glowRefs.chest.current], {
        filter: 'brightness(7) blur(4px)',
        duration: 1.5,
        ease: "sine.inOut"
      })
      .to([glowRefs.name.current, glowRefs.chest.current], {
        filter: 'brightness(4) blur(2px)',
        duration: 1.5,
        ease: "sine.inOut"
      });
    }
    
    return () => {
      // Clean up animations
      masterTimeline.kill();
      eyesTimeline.kill();
      chestNameTimeline.kill();
    };
  }, []);

  return (
    <div className="landing-page" ref={backgroundRef}>
      <div className="overlay-text">
        <h1>
          <span className="kompoz-text">{'{Kompoz}'}</span> the chaos. <br />
          Follow the <span className="voices-text">voices</span> that move the markets.
        </h1>
        <p>
          We harness the power of AI to analyze crypto Twitter/X. <br />
          Our platform filters the noise, breaking down each post into actionable insights using NLP and price data correlation.
        </p>
      </div>

      <div className="robot-wrapper" ref={robotWrapperRef}>
        <div className="robot-layers" ref={robotLayersRef}>
          <img src={robotBase} alt="Robot Base" className="robot-layer" />
          <img ref={glowRefs.eyes} src={glowEyes} alt="Glow Eyes" className="glow-layer glow-eyes" />
          <img ref={glowRefs.mouth} src={glowMouth} alt="Glow Mouth" className="glow-layer glow-mouth" />
          <img ref={glowRefs.chest} src={glowChest} alt="Glow Chest" className="glow-layer glow-chest" />
          <img ref={glowRefs.name} src={glowName} alt="Glow Name" className="glow-layer glow-name" />
        </div>
      </div>
    </div>
  );
};

export default Landing;