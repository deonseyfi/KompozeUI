// src/GlobalComponents/GlobalStyles.tsx
import { useEffect } from "react";

export const GlobalStyles = () => {
  useEffect(() => {
    // Apply the same styles that were working in StickyHeadTable
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.style.height = "auto";
    document.documentElement.style.height = "auto";
    document.body.style.backgroundColor = "#000";

    const styleElement = document.createElement("style");
    styleElement.id = "global-app-styles";
    styleElement.textContent = `
      /* All Scrollbars - Thin and Grey */
      * {
        scrollbar-width: thin;
        scrollbar-color: #666 transparent;
      }
      
      *::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      
      *::-webkit-scrollbar-track {
        background: transparent;
      }
      
      *::-webkit-scrollbar-thumb {
        background: #666;
        border-radius: 3px;
      }
      
      *::-webkit-scrollbar-thumb:hover {
        background: #888;
      }
      
      *::-webkit-scrollbar-thumb:active {
        background: #555;
      }
      
      *::-webkit-scrollbar-corner {
        background: transparent;
      }
      
      /* Prevent FOUC (Flash of Unstyled Content) */
      #root {
        min-height: 100vh;
        background-color: #000;
      }
    `;

    // Remove any existing global styles
    const existing = document.getElementById("global-app-styles");
    if (existing) existing.remove();

    document.head.appendChild(styleElement);

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.height = "";
      document.body.style.backgroundColor = "";

      // Remove custom scrollbar styles
      const styles = document.getElementById("global-app-styles");
      if (styles) styles.remove();
    };
  }, []);

  return null;
};
