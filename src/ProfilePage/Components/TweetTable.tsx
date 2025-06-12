import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  alpha,
  useTheme,
} from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage,
} from "@mui/icons-material";

export interface TweetRecord {
  tweet: string;
  sentimentRating: number | null; // e.g. –1 to +1 or 0–100 scale
  accuracy: number | null; // percent
  time: string; // formatted time string
}

interface TweetTableProps {
  records: TweetRecord[];
}

const TweetTable: React.FC<TweetTableProps> = ({ records }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!records.length) {
    return (
      <Typography
        variant="body2"
        sx={{ color: "#666", textAlign: "center", py: 3 }}
      >
        No tweets to display.
      </Typography>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(records.length / rowsPerPage) || 1;
  const startIndex = page * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, records.length);
  const currentRecords = records.slice(startIndex, endIndex);

  const handleChangePage = (newPage: number) => {
    const maxPage = Math.max(0, totalPages - 1);
    const validPage = Math.max(0, Math.min(newPage, maxPage));
    setPage(validPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    // Adjust page if current page would be out of bounds
    const newTotalPages = Math.ceil(records.length / newRowsPerPage) || 1;
    if (page >= newTotalPages) {
      setPage(Math.max(0, newTotalPages - 1));
    }
  };

  const getSentimentColor = (rating: number | null) => {
    if (rating === null || rating === undefined) return "#666";
    if (rating > 0.3) return "#4caf50";
    if (rating < -0.3) return "#f44336";
    return "#999";
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Fixed Header */}
      <Box
        sx={{
          backgroundColor: "#0a0a0a",
          borderBottom: `2px solid ${alpha("#ff6b35", 0.3)}`,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "#ff6b35",
                  fontWeight: 600,
                  backgroundColor: "#0a0a0a",
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  py: 2,
                  border: "none",
                }}
              >
                Tweet Content
              </TableCell>
              <TableCell
                sx={{
                  color: "#ff6b35",
                  fontWeight: 600,
                  backgroundColor: "#0a0a0a",
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  py: 2,
                  width: "150px",
                  border: "none",
                }}
                align="center"
              >
                Sentiment
              </TableCell>
              <TableCell
                sx={{
                  color: "#ff6b35",
                  fontWeight: 600,
                  backgroundColor: "#0a0a0a",
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  py: 2,
                  width: "100px",
                  border: "none",
                }}
                align="center"
              >
                Accuracy
              </TableCell>
              <TableCell
                sx={{
                  color: "#ff6b35",
                  fontWeight: 600,
                  backgroundColor: "#0a0a0a",
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  py: 2,
                  width: "120px",
                  border: "none",
                  paddingRight: "24px", // Account for scrollbar width
                }}
                align="right"
              >
                Time
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </Box>

      {/* Scrollable Body */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "750px",
          backgroundColor: "transparent",
          boxShadow: "none",
          position: "relative",
          "&::-webkit-scrollbar": {
            width: "10px",
            backgroundColor: alpha("#ff6b35", 0.05),
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: alpha("#ff6b35", 0.1),
            borderRadius: "5px",
            margin: "5px 0",
          },
          "&::-webkit-scrollbar-thumb": {
            background: `linear-gradient(180deg, #ff6b35 0%, #ff8555 100%)`,
            borderRadius: "5px",
            border: "2px solid transparent",
            backgroundClip: "content-box",
            "&:hover": {
              background: `linear-gradient(180deg, #ff8555 0%, #ffa575 100%)`,
              backgroundClip: "content-box",
            },
          },
          "& .MuiTable-root": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Table size="small">
          <TableBody>
            {currentRecords.map((row, idx) => (
              <TableRow
                key={idx}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: alpha("#ff6b35", 0.05),
                  },
                  transition: "background-color 0.2s ease",
                }}
              >
                <TableCell
                  sx={{
                    color: "#ddd",
                    borderBottom: `1px solid ${alpha("#fff", 0.05)}`,
                    py: 2,
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
                  component="th"
                  scope="row"
                >
                  <Typography
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.tweet}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: `1px solid ${alpha("#fff", 0.05)}`,
                    py: 2,
                  }}
                  align="center"
                >
                  <Typography
                    sx={{
                      color: getSentimentColor(row.sentimentRating),
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    {row.sentimentRating !== null &&
                    row.sentimentRating !== undefined
                      ? row.sentimentRating.toFixed(2)
                      : "N/A"}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: `1px solid ${alpha("#fff", 0.05)}`,
                    py: 2,
                  }}
                  align="center"
                >
                  <Typography
                    sx={{
                      color: "#999",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    {row.accuracy !== null && row.accuracy !== undefined
                      ? row.accuracy
                      : "N/A"}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    color: "#999",
                    borderBottom: `1px solid ${alpha("#fff", 0.05)}`,
                    py: 2,
                    fontSize: "0.85rem",
                  }}
                  align="right"
                >
                  {formatTime(row.time)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          px: 1,
          py: 1.5,
          borderTop: "1px solid #222",
        }}
      >
        {/* Rows per page selector */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography sx={{ color: "#666", fontSize: "0.813rem" }}>
            Rows per page:
          </Typography>
          <FormControl size="small">
            <Select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              sx={{
                color: "#999",
                fontSize: "0.813rem",
                height: "28px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#333",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#555",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#666",
                },
                "& .MuiSvgIcon-root": {
                  color: "#666",
                },
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Page info */}
        <Typography sx={{ color: "#666", fontSize: "0.813rem" }}>
          {startIndex + 1}-{Math.min(endIndex, records.length)} of{" "}
          {records.length}
        </Typography>

        {/* Navigation buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            onClick={() => handleChangePage(0)}
            disabled={page === 0}
            size="small"
            sx={{
              color: "#666",
              "&:hover": { color: "#999" },
              "&.Mui-disabled": { color: "#333" },
            }}
          >
            <FirstPage fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 0}
            size="small"
            sx={{
              color: "#666",
              "&:hover": { color: "#999" },
              "&.Mui-disabled": { color: "#333" },
            }}
          >
            <KeyboardArrowLeft fontSize="small" />
          </IconButton>

          <Typography
            sx={{
              color: "#666",
              fontSize: "0.813rem",
              px: 1.5,
            }}
          >
            {page + 1} / {totalPages}
          </Typography>

          <IconButton
            onClick={() => handleChangePage(page + 1)}
            disabled={page >= totalPages - 1}
            size="small"
            sx={{
              color: "#666",
              "&:hover": { color: "#999" },
              "&.Mui-disabled": { color: "#333" },
            }}
          >
            <KeyboardArrowRight fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleChangePage(totalPages - 1)}
            disabled={page >= totalPages - 1}
            size="small"
            sx={{
              color: "#666",
              "&:hover": { color: "#999" },
              "&.Mui-disabled": { color: "#333" },
            }}
          >
            <LastPage fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default TweetTable;
