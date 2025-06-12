import * as React from "react";
import { getAuth } from "firebase/auth";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Popper,
  ClickAwayListener,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useNavigate } from "react-router-dom";
import {
  applyFilters,
  FilterState,
  getDefaultFilterState,
} from "./FilterFunctionality";
import { useWatchlist, filterUsersByWatchlist } from "./WatchlistFunctionality";

export interface RowData {
  username: string;
  timeframe: string;
  lastUpdated: string;
  accuracy: number;
}

export const formatTimeFrame = (days: number): string => {
  if (days <= 1) return "Day Trader";
  if (days <= 7) return "Swing Trader";
  if (days <= 30) return "Position Trader";
  return "Macro Trader";
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

async function fetchUserSentiment(): Promise<RowData[]> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();
  try {
    const response = await fetch("http://localhost:8001/usersentiment", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const apiData = await response.json();
    return Object.entries(apiData.data).map(
      ([username, userData]: [string, any]) => ({
        username: username,
        timeframe: formatTimeFrame(userData.timeFrame),
        lastUpdated: formatDate(userData.latestTweet),
        accuracy: Math.round(userData.sentimentScore * 100),
      })
    );
  } catch (error) {
    console.error("Error fetching user sentiment data:", error);
    throw error;
  }
}

// ✅ INDUSTRY STANDARD: Let browser handle caching with proper headers
const fetchProfilePicturesBatch = async (
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

// ✅ INSTAGRAM TECHNIQUE: Preload images for instant display
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

// ✅ SMART BATCHING: Preload images for current view + next page
const preloadVisibleAndNext = (
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

export const getAccuracyColor = (value: number) => {
  if (value >= 90) return "#3AFF00";
  if (value >= 80) return "#00FFFF";
  if (value >= 70) return "#E8FF00";
  if (value >= 60) return "#FFF700";
  if (value >= 50) return "#FFE000";
  if (value >= 40) return "#FFB600";
  if (value >= 30) return "#FF9700";
  if (value >= 20) return "#FF7400";
  if (value >= 10) return "#FF5D00";
  return "#FF0000";
};

export const OptimizedAvatar: React.FC<{
  username: string;
  profilePicUrl?: string;
  size?: number; // Made optional with default
}> = ({ username, profilePicUrl, size = 56 }) => {
  // Added size to destructuring with default
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
        width: size, // Use the size prop
        height: size, // Use the size prop
        border: "2px solid #ff6b35",
        color: "#ff6b35",
        bgcolor: "transparent",
        // ✅ SMOOTH TRANSITIONS: Like Instagram
        transition: "all 0.2s ease-in-out",
        opacity: profilePicUrl && !imageError && imageLoaded ? 1 : 0.8,
        fontSize: size * 0.4, // Scale icon size with avatar size
      }}
      onLoad={() => setImageLoaded(true)}
      onError={() => setImageError(true)}
    >
      {(!profilePicUrl || imageError) && <PersonIcon />}
    </Avatar>
  );
};

export default function EnhancedTable() {
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState<RowData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [profilePics, setProfilePics] = React.useState<Record<string, string>>(
    {}
  );
  const [profilePicsLoading, setProfilePicsLoading] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filterAnchorEl, setFilterAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [filterState, setFilterState] = React.useState<FilterState>(
    getDefaultFilterState()
  );

  const {
    userWatchlist,
    isUserWatchlistView,
    toggleUserWatchlist,
    isInUserWatchlist,
  } = useWatchlist();

  const rowsPerPage = 9;

  const searchFilteredRows = rows.filter((row) =>
    row.username.toLowerCase().includes(search.toLowerCase())
  );
  const sortedAndFilteredRows = applyFilters(searchFilteredRows, filterState);
  const filteredRows = filterUsersByWatchlist(
    sortedAndFilteredRows,
    isUserWatchlistView,
    userWatchlist
  );

  // ✅ INDUSTRY STANDARD: Single API call, browser handles caching
  React.useEffect(() => {
    const loadDataWithProperCaching = async () => {
      try {
        setLoading(true);
        setError(null);
        setProfilePicsLoading(true);

        // Load sentiment data and profile pictures in parallel
        const [sentimentData, profilePicsData] = await Promise.all([
          fetchUserSentiment(),
          // Get ALL profile pictures at once (browser will cache them)
          fetchUserSentiment().then((data) =>
            fetchProfilePicturesBatch(data.map((row) => row.username))
          ),
        ]);

        // Set data immediately
        setRows(sentimentData);
        setProfilePics(profilePicsData);
        setLoading(false);
        setProfilePicsLoading(false);

        // ✅ SMART PRELOADING: Preload visible + next page images
        setTimeout(() => {
          preloadVisibleAndNext(profilePicsData, page, rowsPerPage);
        }, 100);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        setLoading(false);
        setProfilePicsLoading(false);
      }
    };

    loadDataWithProperCaching();
  }, []);

  // ✅ PRELOAD NEXT PAGE: When user changes pages
  React.useEffect(() => {
    if (Object.keys(profilePics).length > 0) {
      preloadVisibleAndNext(profilePics, page, rowsPerPage);
    }
  }, [page, profilePics]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
    setFilterOpen(true);
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
    setFilterAnchorEl(null);
  };

  const handleAccuracySortChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterState((prev) => ({
      ...prev,
      sortByAccuracy: event.target.checked,
    }));
  };

  const handleTimeframeChange = (timeframe: string) => {
    setFilterState((prev) => ({
      ...prev,
      selectedTimeframes: prev.selectedTimeframes.includes(timeframe)
        ? prev.selectedTimeframes.filter((t) => t !== timeframe)
        : [...prev.selectedTimeframes, timeframe],
    }));
  };

  const handleApplyFilter = () => {
    handleFilterClose();
  };

  const handleClearFilters = () => {
    setFilterState(getDefaultFilterState());
  };

  const navigate = useNavigate();
  const handleRowClick = (username: string) => {
    navigate(`/analytics/${username.replace("@", "")}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#000",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#ff6b35" }} />
        <Typography sx={{ color: "white", ml: 2 }}>
          Loading sentiment data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: "#000",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "#ff6b35" }}>Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#000", minHeight: "100vh", py: 3, px: 4 }}>
      {/* Top Row */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <TextField
          placeholder="Search Account"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#ff6b35" },
              "&:hover fieldset": { borderColor: "#ff6b35" },
              "&.Mui-focused fieldset": { borderColor: "#ff6b35" },
            },
            backgroundColor: "#111",
            borderRadius: 2,
            width: 250,
          }}
        />
        <Box display="flex" alignItems="center" gap={2}>
          {/* ✅ SIMPLIFIED: No manual loading states needed */}
          <IconButton
            onClick={handleFilterClick}
            sx={{ color: "white", "&:hover": { color: "#ff6b35" } }}
          >
            <FilterListIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Table */}
      <Paper sx={{ backgroundColor: "#000", boxShadow: "none" }}>
        <TableContainer sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>Account</TableCell>
                <TableCell sx={headerStyle}>Avg. Trading Timeframe</TableCell>
                <TableCell sx={headerStyle}>Last Updated</TableCell>
                <TableCell sx={{ ...headerStyle, textAlign: "right" }}>
                  Accuracy
                </TableCell>
                <TableCell sx={{ ...headerStyle, textAlign: "center" }}>
                  Watch
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: RowData, index: number) => (
                  <TableRow
                    hover
                    key={index}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(255, 107, 53, 0.12) !important",
                      },
                      transition: "background-color 0.3s ease",
                    }}
                    onClick={() => handleRowClick(`@${row.username}`)}
                  >
                    <TableCell sx={cellStyle}>
                      <Box display="flex" alignItems="center" gap={2}>
                        {/* ✅ OPTIMIZED AVATAR: Instagram-style loading */}
                        <OptimizedAvatar
                          username={row.username}
                          profilePicUrl={profilePics[row.username]}
                          size={40} // Changed from 64 to 40 for smaller table rows
                        />
                        @{row.username}
                      </Box>
                    </TableCell>

                    <TableCell sx={cellStyle}>{row.timeframe}</TableCell>
                    <TableCell sx={cellStyle}>
                      <Typography>{row.lastUpdated}</Typography>
                    </TableCell>
                    <TableCell sx={{ ...cellStyle, textAlign: "right" }}>
                      <Chip
                        label={`${row.accuracy}%`}
                        sx={{
                          backgroundColor: getAccuracyColor(row.accuracy),
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ ...cellStyle, textAlign: "center" }}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleUserWatchlist(row.username);
                        }}
                        sx={{
                          color: isInUserWatchlist(row.username)
                            ? "#ff6b35"
                            : "#666",
                        }}
                      >
                        {isInUserWatchlist(row.username) ? (
                          <StarIcon />
                        ) : (
                          <StarBorderIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            sx={{ color: "white", ".MuiButtonBase-root": { color: "#ff6b35" } }}
          />
        </Box>
      </Paper>

      {/* Filter Dropdown */}
      <Popper
        open={filterOpen}
        anchorEl={filterAnchorEl}
        placement="bottom-end"
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleFilterClose}>
          <Box
            sx={{
              width: 280,
              bgcolor: "#111",
              border: "2px solid #333",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "white",
                mb: 2,
                textAlign: "center",
                fontSize: "1.1rem",
              }}
            >
              Filter Options
            </Typography>
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormLabel sx={filterLabel}>Sort by Accuracy:</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filterState.sortByAccuracy}
                    onChange={handleAccuracySortChange}
                    disableRipple
                    sx={{
                      color: "#ff6b35",
                      "&.Mui-checked": {
                        color: "#ff6b35",
                      },
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                      transform: "scale(0.9)",
                    }}
                  />
                }
                label={
                  <Typography sx={filterText}>Highest to Lowest</Typography>
                }
                sx={{ mb: 2 }}
              />
              <FormLabel sx={filterLabel}>Filter by Timeframes:</FormLabel>
              <FormGroup sx={{ mb: 2 }}>
                {[
                  "Day Trader",
                  "Swing Trader",
                  "Position Trader",
                  "Macro Trader",
                ].map((timeframe) => (
                  <FormControlLabel
                    key={timeframe}
                    control={
                      <Checkbox
                        checked={filterState.selectedTimeframes.includes(
                          timeframe
                        )}
                        onChange={() => handleTimeframeChange(timeframe)}
                        disableRipple
                        sx={{
                          color: "#ff6b35",
                          "&.Mui-checked": {
                            color: "#ff6b35",
                          },
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                          transform: "scale(0.9)",
                        }}
                      />
                    }
                    label={<Typography sx={filterText}>{timeframe}</Typography>}
                  />
                ))}
              </FormGroup>
            </FormControl>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <IconButton onClick={handleClearFilters} sx={filterButton}>
                Clear
              </IconButton>
              <IconButton onClick={handleFilterClose} sx={filterButton}>
                Close
              </IconButton>
              <IconButton onClick={handleApplyFilter} sx={applyButton}>
                Apply
              </IconButton>
            </Box>
          </Box>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}

const headerStyle = {
  color: "white",
  fontWeight: "bold",
  backgroundColor: "#000",
  borderBottom: "1px solid #444",
};

const cellStyle = {
  color: "white",
  borderBottom: "1px solid #333",
};

const filterLabel = {
  color: "#ff6b35",
  mb: 1.5,
  fontWeight: "bold",
  fontSize: "0.9rem",
};

const filterText = {
  color: "white",
  fontSize: "0.8rem",
};

const filterButton = {
  color: "white",
  border: "1px solid #666",
  borderRadius: 1,
  px: 1.5,
  py: 0.5,
  fontSize: "0.7rem",
  "&:hover": { borderColor: "#ff6b35", color: "#ff6b35" },
};

const applyButton = {
  color: "white",
  border: "1px solid #ff6b35",
  borderRadius: 1,
  px: 1.5,
  py: 0.5,
  fontSize: "0.7rem",
  "&:hover": { backgroundColor: "#ff6b35", color: "black" },
};
