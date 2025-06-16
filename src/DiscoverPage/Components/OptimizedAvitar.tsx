import * as React from "react";
import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";


export const OptimizedAvatar: React.FC<{
    username: string;
    profilePicUrl?: string;
  }> = ({ username, profilePicUrl }) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);
  
    // Reset states when URL changes
    React.useEffect(() => {
      if (profilePicUrl) {
        setImageLoaded(false);
        setImageError(false);
      }
    }, [profilePicUrl]);
  
    return (
      <Avatar
        src={profilePicUrl && !imageError ? profilePicUrl : undefined}
        sx={{
          border: "2px solid orange",
          color: "orange",
          bgcolor: "transparent",
          // ✅ SMOOTH TRANSITIONS: Like Instagram
          transition: "all 0.2s ease-in-out",
          opacity: profilePicUrl && !imageError && imageLoaded ? 1 : 0.8,
        }}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      >
        {(!profilePicUrl || imageError) && <PersonIcon />}
      </Avatar>
    );
  };