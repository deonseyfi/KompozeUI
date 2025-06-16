import { getAuth } from "firebase/auth";

export const fetchProfilePicturesBatch = async (
    usernames: string[]
  ): Promise<Record<string, string>> => {
    if (usernames.length === 0) return {};
  
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();
  
    try {
      const response = await fetch(
        "http://localhost:8001/profile-pictures/batch",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            // ✅ PROPER HTTP CACHING: Let browser handle caching
            "Cache-Control": "public, max-age=86400", // Cache for 24 hours
          },
          body: JSON.stringify({ usernames }),
        }
      );
  
      if (!response.ok) {
        console.error("Failed to fetch batch profile pictures");
        return {};
      }
  
      const data = await response.json();
      const profilePics: Record<string, string> = {};
  
      // Extract profile image URLs from the response
      Object.entries(data.data).forEach(([username, userData]: [string, any]) => {
        if (userData.profile_image_url) {
          profilePics[username] = userData.profile_image_url;
          // ✅ PRELOAD IMAGES: Browser automatically caches them
          preloadImage(userData.profile_image_url);
        }
      });
  
      console.log(
        `✅ Batch loaded ${Object.keys(profilePics).length} profile pictures in ${
          data.stats?.api_calls === 0 ? "CACHED" : "API"
        } mode`
      );
      return profilePics;
    } catch (error) {
      console.error("Error fetching batch profile pictures:", error);
      return {};
    }
  };

  export const preloadImage = (url: string) => {
    const img = new Image();
    img.onload = () => {
      console.log(`✅ Preloaded: ${url.split("/").pop()}`);
    };
    img.onerror = () => {
      console.warn(`❌ Failed to preload: ${url}`);
    };
    img.src = url; // Browser automatically caches this
  };

  export const preloadVisibleAndNext = (
    allProfilePics: Record<string, string>,
    currentPage: number,
    rowsPerPage: number
  ) => {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage * 2; // Current page + next page
  
    Object.values(allProfilePics)
      .slice(startIndex, endIndex)
      .forEach((url) => {
        if (url) preloadImage(url);
      });
  };
  