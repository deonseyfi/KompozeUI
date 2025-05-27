import React, { useEffect, useRef } from 'react';
import './Landing.css';
import gsap from 'gsap';

import robotBase from '../assets/robotempty.png';
import glowEyes from '../assets/eyes.png';
import glowMouth from '../assets/mouth2.png';
import glowChest from '../assets/chestlights.png';
import glowName from '../assets/namelight.png';

const Landing = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const robotWrapperRef = useRef<HTMLDivElement>(null);
  const robotLayersRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
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

// Complete useEffect with eye flickering animation
// Reordered animation - robot rises first, then lights turn on, then sunrise
useEffect(() => {
  // Simple text display after robot animation
  const showText = async () => {
    // Wait for robot animation to complete
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    if (headingRef.current && paragraphRef.current) {
      // Set the text content directly
      headingRef.current.innerHTML = '<span class="kompoz-text">{Kompoz}</span> the chaos.<br/>Follow the <span class="voices-text">voices</span> that move the markets.';
      paragraphRef.current.innerHTML = 'We harness the power of AI to analyze crypto Twitter/X.<br/>Our platform filters the noise, breaking down each post into actionable insights using NLP and price data correlation.';
      
      // Show the text container
      gsap.to('.overlay-text', {
        opacity: 1,
        duration: 0.5
      });
    }
  };

  showText();
}, []);

useEffect(() => {
  const masterTimeline = gsap.timeline();
  
  // 1. Start with black screen
  if (backgroundRef.current) {
    gsap.set(backgroundRef.current, {
      background: 'black'
    });
  }
  
  // Hide robot initially using bottom property
  if (robotWrapperRef.current) {
    gsap.set(robotWrapperRef.current, {
      css: {
        visibility: 'visible',
        opacity: 0,
        bottom: '-300px'
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
  masterTimeline.to({}, { duration: 0.5 });
  
  // 2. Robot rises from bottom
  if (robotWrapperRef.current) {
    masterTimeline.to(robotWrapperRef.current, {
      css: {
        bottom: '0px',
        opacity: 1
      },
      duration: 2.5,
      ease: 'power2.out'
    });
  }
  
  // 3. Eyes light up with flickering effect - then stay on
  if (glowRefs.eyes.current) {
    const eyesFlickerTimeline = gsap.timeline();
    
    eyesFlickerTimeline
      .to(glowRefs.eyes.current, {
        opacity: 5,
        filter: 'brightness(15) blur(8px)',
        duration: 0.1
      })
      .to(glowRefs.eyes.current, {
        opacity: 5,
        filter: 'brightness(5) blur(3px)',
        duration: 0.1
      })
      .to(glowRefs.eyes.current, {
        opacity: 10,
        filter: 'brightness(20) blur(10px)',
        duration: 0.15
      })
      .to(glowRefs.eyes.current, {
        opacity: 2,
        filter: 'brightness(8) blur(5px)',
        duration: 0.2
      })
      .to(glowRefs.eyes.current, {
        opacity: 1,
        filter: 'brightness(25) blur(12px)',
        duration: 0.1
      })
      .to(glowRefs.eyes.current, {
        opacity: 0.5,
        filter: 'brightness(10) blur(6px)',
        duration: 0.15
      })
      .to(glowRefs.eyes.current, {
        opacity: 1,
        filter: 'brightness(1) blur(0px)',
        duration: 2,
        ease: 'power2.inOut'
      });
    
    masterTimeline.add(eyesFlickerTimeline);
  }
  
  // 4. Mouth lights up
  if (glowRefs.mouth.current) {
    masterTimeline.to(glowRefs.mouth.current, {
      opacity: 1,
      filter: 'brightness(25) blur(0px)',
      duration: 1
    }, "+=0.1");
  }
  
  // 5. Light up name and chest TOGETHER
  if (glowRefs.name.current && glowRefs.chest.current) {
    masterTimeline.to([glowRefs.name.current, glowRefs.chest.current], {
      opacity: 1,
      filter: 'brightness(1) blur(0px)',
      duration: 1.2
    });
  }
  
  // 6. Sunrise background animation
  if (backgroundRef.current) {
    masterTimeline.to(backgroundRef.current, {
      background: 'radial-gradient(ellipse at bottom left, rgba(255, 119, 0, 0.85) 10%, rgba(220, 33, 33, 0.95) 30%, black 100%)',
      duration: 5,
      ease: 'power1.inOut'
    });
  }
  
  // 7. Create combined pulse animation for chest and name lights
  const pulseAnimation = gsap.timeline({repeat: -1});

  if (glowRefs.chest.current && glowRefs.name.current) {
    // Set initial state
    gsap.set([glowRefs.chest.current, glowRefs.name.current], {
      filter: 'brightness(1) blur(0px)'
    });
    
    pulseAnimation
      .to([glowRefs.chest.current, glowRefs.name.current], {
        filter: 'brightness(2) blur(0px)',
        duration: 1,
        ease: "power2.inOut"
      })
      .to([glowRefs.chest.current, glowRefs.name.current], {
        filter: 'brightness(1) blur(0px)',
        duration: 1,
        ease: "power2.inOut"
      });
  }
  return () => {
    // Clean up animations
    masterTimeline.kill();
    pulseAnimation.kill();
  };
  
}, []);

return (
  <div className="landing-page" ref={backgroundRef}>
    <div className="overlay-text">
      <h1 ref={headingRef} className="typewriter-text">
        {/* Content will be typed by JavaScript */}
      </h1>
      <p ref={paragraphRef} className="typewriter-text">
        {/* Content will be typed by JavaScript */}
      </p>
    </div>

    <div className="robot-wrapper" ref={robotWrapperRef}>
    <div className="robot-layers" ref={robotLayersRef}>
        <img src={robotBase} alt="Robot Base" className="robot-layer" />
        <img ref={glowRefs.chest} src={glowChest} alt="Glow Chest" className="glow-layer glow-chest" />
        <img ref={glowRefs.name} src={glowName} alt="Glow Name" className="glow-layer glow-name" />
        <img ref={glowRefs.mouth} src={glowMouth} alt="Glow Mouth" className="glow-layer glow-mouth" />
        <img ref={glowRefs.eyes} src={glowEyes} alt="Glow Eyes" className="glow-layer glow-eyes" />

      </div>
    </div>
  </div>
  );  
};

export default Landing;