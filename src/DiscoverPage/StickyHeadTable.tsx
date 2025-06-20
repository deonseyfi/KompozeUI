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
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Popper,
  ClickAwayListener,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Stack,
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
} from "./Components/FilterFunctionality";
import {
  useWatchlist,
  filterUsersByWatchlist,
} from "./Components/WatchlistFunctionality";
import SearchBar, { RowData as SearchBarRowData } from "./Components/SearchBar";
import {
  fetchProfilePicturesBatch,
  preloadVisibleAndNext,
} from "./apidata/ProfilePicturesFetch";
import { OptimizedAvatar } from "./Components/OptimizedAvitar";
import { ConsistentLoader } from "../GlobalComponents/Loader";

export interface RowData {
  username: string;
  timeframe: string;
  lastUpdated: string;
  accuracy: number;
}

const formatTimeFrame = (days: number): string => {
  if (days <= 1) return "Day Trader";
  if (days <= 7) return "Swing Trader";
  if (days <= 30) return "Position Trader";
  return "Macro Trader";
};

const formatDate = (dateStr: string): string => {
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

const getAccuracyColor = (value: number) => {
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

// Mobile Card Component
const MobileCard = ({
  row,
  profilePic,
  isInWatchlist,
  onToggleWatchlist,
  onClick,
}: {
  row: RowData;
  profilePic?: string;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  onClick: () => void;
}) => (
  <Card
    sx={{
      backgroundColor: "#111",
      border: "1px solid #333",
      mb: 2,
      cursor: "pointer",
      "&:hover": {
        borderColor: "orange",
        backgroundColor: "rgba(255, 140, 0, 0.05)",
      },
      transition: "all 0.3s ease",
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <Box display="flex" alignItems="center" gap={2} flex={1}>
          <OptimizedAvatar username={row.username} profilePicUrl={profilePic} />
          <Box>
            <Typography sx={{ color: "white", fontWeight: "bold" }}>
              @{row.username}
            </Typography>
            <Typography sx={{ color: "#999", fontSize: "0.875rem" }}>
              {row.timeframe}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist();
          }}
          sx={{
            color: isInWatchlist ? "orange" : "#666",
            p: 0.5,
          }}
        >
          {isInWatchlist ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Typography sx={{ color: "#888", fontSize: "0.75rem" }}>
          Updated: {row.lastUpdated}
        </Typography>
        <Chip
          label={`${row.accuracy}%`}
          size="small"
          sx={{
            backgroundColor: getAccuracyColor(row.accuracy),
            color: "#fff",
            fontWeight: "bold",
          }}
        />
      </Box>
    </CardContent>
  </Card>
);

export default function EnhancedTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery("(max-width:768px)");

  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState<RowData[]>([]);
  const [searchFilteredRows, setSearchFilteredRows] = React.useState<RowData[]>(
    []
  );
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

  const rowsPerPage = isMobile ? 5 : 9;

  React.useEffect(() => {
    const loadDataWithProperCaching = async () => {
      try {
        setLoading(true);
        setError(null);
        setProfilePicsLoading(true);

        const [sentimentData, profilePicsData] = await Promise.all([
          fetchUserSentiment(),
          fetchUserSentiment().then((data) =>
            fetchProfilePicturesBatch(data.map((row) => row.username))
          ),
        ]);

        setRows(sentimentData);
        setProfilePics(profilePicsData);
        setLoading(false);
        setProfilePicsLoading(false);

        setTimeout(() => {
          preloadVisibleAndNext(profilePicsData, page, rowsPerPage);
        }, 100);

        setSearchFilteredRows(sentimentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        setLoading(false);
        setProfilePicsLoading(false);
      }
    };
    loadDataWithProperCaching();
  }, []);

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

  const handleSearchResults = React.useCallback((filteredData: RowData[]) => {
    setSearchFilteredRows(filteredData);
    setPage(0);
  }, []);

  const sortedAndFilteredRows = applyFilters(searchFilteredRows, filterState);
  const filteredRows = filterUsersByWatchlist(
    sortedAndFilteredRows,
    isUserWatchlistView,
    userWatchlist
  );

  const navigate = useNavigate();
  const handleRowClick = (username: string) => {
    navigate(`/analytics/${username.replace("@", "")}`);
  };

  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: "#000",
          minHeight: "calc(100vh - 200px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Typography sx={{ color: "red", textAlign: "center" }}>
          Error: {error}
        </Typography>
      </Box>
    );
  }

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        py: 3,
        px: { xs: 2, sm: 3, md: 4 },
        minHeight: "calc(100vh - 200px)",
        position: "relative",
      }}
    >
      <ConsistentLoader loading={loading} message="Loading sentiment data..." />

      {/* Top Row */}
      <Box
        display="flex"
        flexDirection={{ xs: "row", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
        sx={{ opacity: loading ? 0 : 1, transition: "opacity 0.3s ease" }}
      >
        <Box sx={{ flex: 1, maxWidth: { xs: "calc(100% - 56px)", sm: 250 } }}>
          <SearchBar
            data={rows}
            onFilteredResults={handleSearchResults}
            placeholder="Search Account"
            width={250}
          />
        </Box>
        <Box>
          <IconButton
            onClick={handleFilterClick}
            sx={{ color: "white", "&:hover": { color: "orange" } }}
          >
            <FilterListIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Content Area */}
      {isMobile ? (
        // Mobile Card Layout
        <Box sx={{ opacity: loading ? 0 : 1, transition: "opacity 0.3s ease" }}>
          {paginatedRows.map((row: RowData) => (
            <MobileCard
              key={row.username}
              row={row}
              profilePic={profilePics[row.username]}
              isInWatchlist={isInUserWatchlist(row.username)}
              onToggleWatchlist={() => toggleUserWatchlist(row.username)}
              onClick={() => handleRowClick(`@${row.username}`)}
            />
          ))}
        </Box>
      ) : (
        // Desktop/Tablet Table Layout
        <Paper
          sx={{
            backgroundColor: "#000",
            boxShadow: "none",
            opacity: loading ? 0 : 1,
            transition: "opacity 0.3s ease",
            overflowX: isSmallScreen ? "auto" : "visible",
          }}
        >
          <TableContainer sx={{ maxHeight: "none" }}>
            <Table stickyHeader sx={{ minWidth: isSmallScreen ? 600 : "auto" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={headerStyle}>Account</TableCell>
                  <TableCell
                    sx={{
                      ...headerStyle,
                      display: isSmallScreen ? "none" : "table-cell",
                    }}
                  >
                    Avg. Trading Timeframe
                  </TableCell>
                  <TableCell sx={headerStyle}>Last Updated</TableCell>
                  <TableCell sx={{ ...headerStyle, textAlign: "right" }}>
                    Accuracy
                  </TableCell>
                  <TableCell
                    sx={{ ...headerStyle, textAlign: "center", width: 80 }}
                  >
                    Watch
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row: RowData, index: number) => (
                  <TableRow
                    hover
                    key={index}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(255, 140, 0, 0.12) !important",
                      },
                      transition: "background-color 0.3s ease",
                    }}
                    onClick={() => handleRowClick(`@${row.username}`)}
                  >
                    <TableCell sx={cellStyle}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <OptimizedAvatar
                          username={row.username}
                          profilePicUrl={profilePics[row.username]}
                        />
                        <Box>
                          <Typography sx={{ color: "white" }}>
                            @{row.username}
                          </Typography>
                          {isSmallScreen && (
                            <Typography
                              sx={{ color: "#999", fontSize: "0.75rem" }}
                            >
                              {row.timeframe}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        ...cellStyle,
                        display: isSmallScreen ? "none" : "table-cell",
                      }}
                    >
                      {row.timeframe}
                    </TableCell>
                    <TableCell sx={cellStyle}>
                      <Typography
                        sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem" }}
                      >
                        {isSmallScreen
                          ? row.lastUpdated.split(" ").slice(0, 2).join(" ")
                          : row.lastUpdated}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ ...cellStyle, textAlign: "right" }}>
                      <Chip
                        label={`${row.accuracy}%`}
                        size={isSmallScreen ? "small" : "medium"}
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
                            ? "orange"
                            : "#666",
                          p: isSmallScreen ? 0.5 : 1,
                        }}
                      >
                        {isInUserWatchlist(row.username) ? (
                          <StarIcon
                            fontSize={isSmallScreen ? "small" : "medium"}
                          />
                        ) : (
                          <StarBorderIcon
                            fontSize={isSmallScreen ? "small" : "medium"}
                          />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          sx={{
            color: "white",
            ".MuiButtonBase-root": { color: "orange" },
            ".MuiTablePagination-displayedRows": {
              fontSize: isMobile ? "0.75rem" : "0.875rem",
            },
          }}
        />
      </Box>

      {/* Filter Dropdown */}
      <Popper
        open={filterOpen && !loading}
        anchorEl={filterAnchorEl}
        placement={isSmallScreen ? "bottom-start" : "bottom-end"}
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleFilterClose}>
          <Box
            sx={{
              width: { xs: 260, sm: 280 },
              bgcolor: "#111",
              border: "2px solid #333",
              borderRadius: 2,
              p: { xs: 2, sm: 3 },
              maxWidth: "calc(100vw - 32px)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "white",
                mb: 2,
                textAlign: "center",
                fontSize: { xs: "1rem", sm: "1.1rem" },
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
                      color: "orange",
                      "&.Mui-checked": {
                        color: "orange",
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
                          color: "orange",
                          "&.Mui-checked": {
                            color: "orange",
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
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
                gap: 1,
              }}
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
  color: "orange",
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
  "&:hover": { borderColor: "orange", color: "orange" },
};

const applyButton = {
  color: "white",
  border: "1px solid orange",
  borderRadius: 1,
  px: 1.5,
  py: 0.5,
  fontSize: "0.7rem",
  "&:hover": { backgroundColor: "orange", color: "black" },
};
