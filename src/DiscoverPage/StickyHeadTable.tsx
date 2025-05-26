import * as React from "react";
import {
  Avatar,
  Box,
  Chip,
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
  IconButton,
  CircularProgress,
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
import {
  applyFilters,
  FilterState,
  getDefaultFilterState,
} from "./FilterFunctionality";
import { useWatchlist, filterRowsByWatchlist } from "./WatchlistFunctionality";

export interface RowData {
  username: string;
  timeframe: string;
  lastUpdated: string;
  accuracy: number;
}

const formatTimeFrame = (days: number): string => {
  if (days <= 1) return "Day Trader";
  if (days > 1 && days <= 7) return "Swing Trader";
  if (days > 7 && days <= 30) return "Position Trader";
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
  try {
    console.log("Fetching user sentiment data...");

    const response = await fetch("http://localhost:8002/usersentiment", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiData = await response.json();
    console.log("API data fetched successfully:", apiData);

    const transformedData: RowData[] = Object.entries(apiData.data).map(
      ([username, userData]: [string, any]) => ({
        username: `@${username}`,
        timeframe: formatTimeFrame(userData.timeFrame),
        lastUpdated: formatDate(userData.latestTweet),
        accuracy: Math.round(userData.sentimentScore * 100),
      })
    );

    console.log("Transformed data:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Error fetching user sentiment data:", error);
    throw error;
  }
}

//Were going to come back and change this function to be more responsive
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

export default function EnhancedTable() {
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState<RowData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filterAnchorEl, setFilterAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [filterState, setFilterState] = React.useState<FilterState>(
    getDefaultFilterState()
  );

  // Use watchlist context instead of local state
  const { watchlist, isWatchlistView, toggleWatchlist, isInWatchlist } =
    useWatchlist();

  const rowsPerPage = 9;

  // Fetch data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserSentiment();
        setRows(data);
        console.log("Data loaded successfully:", data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
    // The filters are applied automatically through the filteredRows calculation
    // You can add any additional logic here if needed
    handleFilterClose();
  };

  const handleClearFilters = () => {
    setFilterState(getDefaultFilterState());
  };

  // Apply search filter first, then apply sorting/filtering, then watchlist filter
  const searchFilteredRows = rows.filter((row) =>
    row.username.toLowerCase().includes(search.toLowerCase())
  );

  const sortedAndFilteredRows = applyFilters(searchFilteredRows, filterState);

  const filteredRows = filterRowsByWatchlist(
    sortedAndFilteredRows,
    isWatchlistView,
    watchlist
  );

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#000",
          minHeight: "100vh",
          py: 3,
          px: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "orange" }} />
        <Typography sx={{ color: "white", ml: 2 }}>
          Loading sentiment data...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: "#000",
          minHeight: "100vh",
          py: 3,
          px: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "red" }}>Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#000", minHeight: "100vh", py: 3, px: 4 }}>
      {/* Search + Filter row */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        {/* Search bar on the left */}
        <TextField
          placeholder="Search Account"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "orange",
              },
              "&:hover fieldset": {
                borderColor: "orange",
              },
              "&.Mui-focused fieldset": {
                borderColor: "orange",
              },
            },
            backgroundColor: "#111",
            borderRadius: 2,
            width: 250,
          }}
        />

        {/* Filter icon on the right */}
        <IconButton
          onClick={handleFilterClick}
          sx={{
            color: "white",
            transition: "color 0.2s",
            "&:hover": { color: "orange" },
          }}
        >
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* Table */}
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#000",
          boxShadow: "none",
        }}
      >
        <TableContainer
          sx={{
            maxHeight: "70vh",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "#000",
                    borderBottom: "1px solid #444",
                  }}
                >
                  Account
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "#000",
                    borderBottom: "1px solid #444",
                  }}
                >
                  Avg. Trading Timeframe
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "#000",
                    borderBottom: "1px solid #444",
                  }}
                >
                  Last Updated
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "#000",
                    borderBottom: "1px solid #444",
                    textAlign: "right",
                  }}
                >
                  Accuracy
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor: "#000",
                    borderBottom: "1px solid #444",
                    textAlign: "center",
                    width: "60px",
                  }}
                >
                  Watch
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover key={index}>
                    <TableCell
                      sx={{ color: "white", borderBottom: "1px solid #333" }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            bgcolor: "transparent",
                            border: "2px solid orange",
                            color: "orange",
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                        <Typography sx={{ color: "white" }}>
                          {row.username}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell
                      sx={{ color: "white", borderBottom: "1px solid #333" }}
                    >
                      {row.timeframe}
                    </TableCell>

                    <TableCell
                      sx={{ color: "white", borderBottom: "1px solid #333" }}
                    >
                      <Typography sx={{ fontSize: "0.9rem" }}>
                        {row.lastUpdated.split(" ")[0]}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: "#aaa" }}>
                        {row.lastUpdated.split(" ").slice(1).join(" ")}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        borderBottom: "1px solid #333",
                        textAlign: "right",
                      }}
                    >
                      <Chip
                        label={`${row.accuracy}%`}
                        sx={{
                          backgroundColor: getAccuracyColor(row.accuracy),
                          color: "#fff",
                          fontWeight: "bold",
                          borderRadius: "20px",
                          minWidth: "50px",
                          justifyContent: "center",
                        }}
                      />
                    </TableCell>

                    <TableCell
                      sx={{
                        borderBottom: "1px solid #333",
                        textAlign: "center",
                      }}
                    >
                      <IconButton
                        onClick={() => toggleWatchlist(row.username)}
                        sx={{
                          color: isInWatchlist(row.username)
                            ? "orange"
                            : "#666",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            color: "orange",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        {isInWatchlist(row.username) ? (
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

        {/* Pagination Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 2,
            color: "white",
            backgroundColor: "#000",
          }}
        >
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            sx={{
              color: "white",
              ".MuiTablePagination-toolbar": {
                justifyContent: "center",
                color: "white",
              },
              ".MuiButtonBase-root": {
                color: "orange",
              },
            }}
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
              boxShadow: 24,
              p: 3,
              mt: 1,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
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
              {/* Sort by Accuracy */}
              <FormLabel
                component="legend"
                sx={{
                  color: "orange",
                  mb: 1.5,
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              >
                Sort by Accuracy:
              </FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filterState.sortByAccuracy}
                    onChange={handleAccuracySortChange}
                    sx={{
                      color: "orange",
                      "&.Mui-checked": { color: "orange" },
                      transform: "scale(0.9)",
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: "white", fontSize: "0.9rem" }}>
                    Highest to Lowest
                  </Typography>
                }
                sx={{ mb: 2 }}
              />

              {/* Filter by Timeframes */}
              <FormLabel
                component="legend"
                sx={{
                  color: "orange",
                  mb: 1,
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              >
                Filter by Timeframes:
              </FormLabel>
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
                        sx={{
                          color: "orange",
                          "&.Mui-checked": { color: "orange" },
                          transform: "scale(0.8)",
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ color: "white", fontSize: "0.8rem" }}>
                        {timeframe}
                      </Typography>
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>

            {/* Apply/Clear/Close buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
                gap: 1,
              }}
            >
              <IconButton
                onClick={handleClearFilters}
                sx={{
                  color: "white",
                  border: "1px solid #666",
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                  fontSize: "0.7rem",
                  "&:hover": { borderColor: "orange", color: "orange" },
                }}
              >
                <Typography sx={{ fontSize: "0.7rem" }}>Clear</Typography>
              </IconButton>
              <IconButton
                onClick={handleFilterClose}
                sx={{
                  color: "white",
                  border: "1px solid #333",
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                  fontSize: "0.7rem",
                  "&:hover": { borderColor: "orange", color: "orange" },
                }}
              >
                <Typography sx={{ fontSize: "0.7rem" }}>Close</Typography>
              </IconButton>
              <IconButton
                onClick={handleApplyFilter}
                sx={{
                  color: "white",
                  border: "1px solid orange",
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                  fontSize: "0.7rem",
                  "&:hover": { backgroundColor: "orange", color: "black" },
                }}
              >
                <Typography sx={{ fontSize: "0.7rem" }}>Apply</Typography>
              </IconButton>
            </Box>
          </Box>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}
