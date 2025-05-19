// Toolbar.tsx
import { Box, IconButton } from "@mui/material";
import CropFreeIcon from "@mui/icons-material/CropFree";   // crosshair
import TimelineIcon from "@mui/icons-material/Timeline";   // trend line
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule"; // h‑line
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";       // scatter
import GestureIcon from "@mui/icons-material/Gesture";   // brush
import TextFieldsIcon from "@mui/icons-material/TextFields"; // text

export type Tool = 
  | "cursor" 
  | "trendline" 
  | "hline" 
  | "scatter" 
  | "brush" 
  | "text";

interface Props { active: Tool; onChange(tool: Tool): void }

const Toolbar: React.FC<Props> = ({ active, onChange }) => (
  <Box display="flex" flexDirection="column">
    <IconButton 
      color={active==="cursor"? "primary":"default"} 
      onClick={() => onChange("cursor")}
    >
      <CropFreeIcon />
    </IconButton>
    <IconButton 
      color={active==="trendline"? "primary":"default"} 
      onClick={() => onChange("trendline")}
    >
      <TimelineIcon />
    </IconButton>
    <IconButton 
      color={active==="hline"? "primary":"default"} 
      onClick={() => onChange("hline")}
    >
      <HorizontalRuleIcon />
    </IconButton>
    <IconButton 
      color={active==="scatter"? "primary":"default"} 
      onClick={() => onChange("scatter")}
    >
      <ScatterPlotIcon />
    </IconButton>
    <IconButton 
      color={active==="brush"? "primary":"default"} 
      onClick={() => onChange("brush")}
    >
      <GestureIcon />
    </IconButton>
    <IconButton 
      color={active==="text"? "primary":"default"} 
      onClick={() => onChange("text")}
    >
      <TextFieldsIcon />
    </IconButton>
  </Box>
);

export default Toolbar;
