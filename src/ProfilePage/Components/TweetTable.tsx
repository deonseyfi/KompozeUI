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
  useMediaQuery,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage,
  TrendingUp,
  TrendingDown,
  Remove,
  AccessTime,
  Speed,
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

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

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

  const getSentimentIcon = (rating: number | null) => {
    if (rating === null || rating === undefined) return <Remove />;
    if (rating > 0.3) return <TrendingUp />;
    if (rating < -0.3) return <TrendingDown />;
    return <Remove />;
  };

  const getSentimentLabel = (rating: number | null) => {
    if (rating === null || rating === undefined) return "Neutral";
    if (rating > 0.3) return "Bullish";
    if (rating < -0.3) return "Bearish";
    return "Neutral";
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

  // Mobile Card View
  const MobileCardView = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {currentRecords.map((row, idx) => (
        <Card
          key={idx}
          sx={{
            backgroundColor: "#0a0a0a",
            border: "1px solid #333",
            borderRadius: 2,
            "&:hover": {
              borderColor: "#555",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            {/* Tweet Content */}
            <Typography
              sx={{
                color: "white",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                mb: 2,
              }}
            >
              {row.tweet}
            </Typography>

            {/* Metadata Row */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                alignItems: "center",
              }}
            >
              {/* Sentiment Chip */}
              <Chip
                icon={getSentimentIcon(row.sentimentRating)}
                label={`${getSentimentLabel(row.sentimentRating)} ${
                  row.sentimentRating !== null
                    ? `(${row.sentimentRating.toFixed(2)})`
                    : ""
                }`}
                size="small"
                sx={{
                  backgroundColor: alpha(
                    getSentimentColor(row.sentimentRating),
                    0.2
                  ),
                  color: getSentimentColor(row.sentimentRating),
                  borderColor: getSentimentColor(row.sentimentRating),
                  border: "1px solid",
                  "& .MuiChip-icon": {
                    color: getSentimentColor(row.sentimentRating),
                    fontSize: 16,
                  },
                }}
              />

              {/* Accuracy */}
              {row.accuracy !== null && row.accuracy !== undefined && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Speed sx={{ color: "#666", fontSize: 16 }} />
                  <Typography sx={{ color: "#999", fontSize: "0.8rem" }}>
                    {row.accuracy}% accuracy
                  </Typography>
                </Box>
              )}

              {/* Time */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  ml: { xs: 0, sm: "auto" },
                }}
              >
                <AccessTime sx={{ color: "#666", fontSize: 16 }} />
                <Typography sx={{ color: "#666", fontSize: "0.8rem" }}>
                  {formatTime(row.time)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  // Desktop Table View
  const DesktopTableView = () => (
    <TableContainer
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                color: "#888",
                fontSize: "0.9rem",
                fontWeight: 600,
                backgroundColor: "transparent",
                borderBottom: "1px solid #333",
                py: 2,
                textTransform: "none",
              }}
            >
              Tweet Content
            </TableCell>
            <TableCell
              sx={{
                color: "#888",
                fontSize: "0.9rem",
                fontWeight: 600,
                backgroundColor: "transparent",
                borderBottom: "1px solid #333",
                py: 2,
                width: isTablet ? "120px" : "150px",
                textTransform: "none",
                display: { xs: "none", sm: "table-cell" },
              }}
              align="center"
            >
              Sentiment
            </TableCell>
            <TableCell
              sx={{
                color: "#888",
                fontSize: "0.9rem",
                fontWeight: 600,
                backgroundColor: "transparent",
                borderBottom: "1px solid #333",
                py: 2,
                width: "100px",
                textTransform: "none",
                display: { xs: "none", md: "table-cell" },
              }}
              align="center"
            >
              Accuracy
            </TableCell>
            <TableCell
              sx={{
                color: "#888",
                fontSize: "0.9rem",
                fontWeight: 600,
                backgroundColor: "transparent",
                borderBottom: "1px solid #333",
                py: 2,
                width: "120px",
                textTransform: "none",
              }}
              align="right"
            >
              Time
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentRecords.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{
                backgroundColor:
                  idx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.02)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
                transition: "background-color 0.2s ease",
              }}
            >
              <TableCell
                sx={{
                  color: "white",
                  borderBottom: "1px solid #333",
                  py: 2,
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                }}
              >
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: isTablet ? 3 : 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "white",
                    fontSize: "0.9rem",
                  }}
                >
                  {row.tweet}
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "1px solid #333",
                  py: 2,
                  display: { xs: "none", sm: "table-cell" },
                }}
                align="center"
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                  }}
                >
                  {getSentimentIcon(row.sentimentRating)}
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
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "1px solid #333",
                  py: 2,
                  display: { xs: "none", md: "table-cell" },
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
                    ? `${row.accuracy}%`
                    : "N/A"}
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  color: "#999",
                  borderBottom: "1px solid #333",
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
  );

  return (
    <Box sx={{ width: "100%", backgroundColor: "transparent" }}>
      {/* Conditional Rendering based on screen size */}
      {isMobile ? <MobileCardView /> : <DesktopTableView />}

      {/* Pagination Controls - Responsive */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 2, sm: 0 },
          mt: 3,
          pt: 2,
          borderTop: "1px solid #333",
        }}
      >
        {/* Rows per page selector */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <Typography sx={{ color: "#666", fontSize: "0.875rem" }}>
            Rows per page:
          </Typography>
          <FormControl size="small">
            <Select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              sx={{
                color: "#999",
                fontSize: "0.875rem",
                height: "32px",
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

        {/* Page info - Hidden on mobile */}
        <Typography
          sx={{
            color: "#666",
            fontSize: "0.875rem",
            display: { xs: "none", sm: "block" },
          }}
        >
          Showing {startIndex + 1} - {Math.min(endIndex, records.length)} out of{" "}
          {records.length}
        </Typography>

        {/* Navigation buttons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            justifyContent: { xs: "center", sm: "flex-end" },
          }}
        >
          {/* First and Last page buttons - Hidden on mobile */}
          <IconButton
            onClick={() => handleChangePage(0)}
            disabled={page === 0}
            size="small"
            sx={{
              color: "#666",
              display: { xs: "none", sm: "inline-flex" },
              "&:hover": {
                color: "#999",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
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
              "&:hover": {
                color: "#999",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
              "&.Mui-disabled": { color: "#333" },
            }}
          >
            <KeyboardArrowLeft fontSize="small" />
          </IconButton>

          <Typography
            sx={{
              color: "#666",
              fontSize: "0.875rem",
              px: { xs: 1.5, sm: 2 },
              py: 1,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 1,
              minWidth: { xs: "50px", sm: "60px" },
              textAlign: "center",
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
              "&:hover": {
                color: "#999",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
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
              display: { xs: "none", sm: "inline-flex" },
              "&:hover": {
                color: "#999",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
              "&.Mui-disabled": { color: "#333" },
            }}
          >
            <LastPage fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Mobile Page Info */}
      {isMobile && (
        <Typography
          sx={{
            color: "#666",
            fontSize: "0.8rem",
            textAlign: "center",
            mt: 2,
          }}
        >
          Showing {startIndex + 1} - {Math.min(endIndex, records.length)} of{" "}
          {records.length} tweets
        </Typography>
      )}
    </Box>
  );
};

export default TweetTable;
