import * as React from "react";
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
  try {
    const response = await fetch("http://localhost:8001/usersentiment", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const apiData = await response.json();
    return Object.entries(apiData.data).map(
      ([username, userData]: [string, any]) => ({
        username: `@${username}`,
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

  // Updated to use new watchlist API
  const {
    userWatchlist,
    isUserWatchlistView,
    toggleUserWatchlist,
    isInUserWatchlist,
  } = useWatchlist();

  const rowsPerPage = 9;

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserSentiment();
        setRows(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
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
    handleFilterClose();
  };

  const handleClearFilters = () => {
    setFilterState(getDefaultFilterState());
  };

  const searchFilteredRows = rows.filter((row) =>
    row.username.toLowerCase().includes(search.toLowerCase())
  );
  const sortedAndFilteredRows = applyFilters(searchFilteredRows, filterState);
  const filteredRows = filterUsersByWatchlist(
    sortedAndFilteredRows,
    isUserWatchlistView,
    userWatchlist
  );

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
        <CircularProgress sx={{ color: "orange" }} />
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
        <Typography sx={{ color: "red" }}>Error: {error}</Typography>
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
              "& fieldset": { borderColor: "orange" },
              "&:hover fieldset": { borderColor: "orange" },
              "&.Mui-focused fieldset": { borderColor: "orange" },
            },
            backgroundColor: "#111",
            borderRadius: 2,
            width: 250,
          }}
        />
        <IconButton
          onClick={handleFilterClick}
          sx={{ color: "white", "&:hover": { color: "orange" } }}
        >
          <FilterListIcon />
        </IconButton>
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
                  <TableRow hover key={index}>
                    <TableCell sx={cellStyle}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            border: "2px solid orange",
                            color: "orange",
                            bgcolor: "transparent",
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                        {row.username}
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
                        onClick={() => toggleUserWatchlist(row.username)}
                        sx={{
                          color: isInUserWatchlist(row.username)
                            ? "orange"
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
            sx={{ color: "white", ".MuiButtonBase-root": { color: "orange" } }}
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
                    sx={checkboxStyle}
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
                        sx={checkboxStyle}
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
  color: "orange",
  mb: 1.5,
  fontWeight: "bold",
  fontSize: "0.9rem",
};

const filterText = {
  color: "white",
  fontSize: "0.8rem",
};

const checkboxStyle = {
  color: "orange",
  "&.Mui-checked": { color: "orange" },
  transform: "scale(0.9)",
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
