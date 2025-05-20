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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import FilterListIcon from "@mui/icons-material/FilterList";

interface RowData {
  username: string;
  timeframe: string;
  lastUpdated: string;
  accuracy: number;
}

const rows: RowData[] = [
  { username: "@username", timeframe: "Daily", lastUpdated: "April 26, 2025 5:45 PM", accuracy: 85 },
  { username: "@username", timeframe: "Short Term", lastUpdated: "April 26, 2025 5:45 PM", accuracy: 66 },
  { username: "@username", timeframe: "Long Term", lastUpdated: "April 26, 2025 5:45 PM", accuracy: 53 },
  { username: "@username", timeframe: "Short Term", lastUpdated: "April 26, 2025 5:45 PM", accuracy: 45 },
  { username: "@username", timeframe: "Daily", lastUpdated: "April 26, 2025 5:45 PM", accuracy: 38 },
  { username: "@username", timeframe: "Long Term", lastUpdated: "April 26, 2025 5:45 PM", accuracy: 20 },
  { username: "@username", timeframe: "Long Term", lastUpdated: "April 26, 2025 5:45 PM", accuracy: 13 },
  { username: "@username", timeframe: "Short Term", lastUpdated: "April 26, 2025 5:45 PM", accuracy: 10 },
  { username: "@username", timeframe: "Daily", lastUpdated: "April 26, 2025 5:45 PM", accuracy: 10 },
];

const getAccuracyColor = (value: number) => {
  if (value >= 80) return "#4caf50";
  if (value >= 60) return "#fdd835";
  if (value >= 40) return "#fb8c00";
  return "#e53935";
};

export default function EnhancedTable() {
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const rowsPerPage = 9;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const filteredRows = rows.filter((row) =>
    row.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ backgroundColor: "#000", minHeight: "100vh", py: 3, px: 4 }}>
      {/* Search + Filter row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
      <Paper sx={{ width: "100%", overflow: "hidden", backgroundColor: "#000", boxShadow: "none" }}>
        <TableContainer sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#000", borderBottom: "1px solid #444" }}>
                  Account
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#000", borderBottom: "1px solid #444" }}>
                  Avg. Trading Timeframe
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#000", borderBottom: "1px solid #444" }}>
                  Last Updated
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#000", borderBottom: "1px solid #444", textAlign: "right" }}>
                  Accuracy
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover key={index}>
                    <TableCell sx={{ color: "white", borderBottom: "1px solid #333" }}>
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
                        <Typography sx={{ color: "white" }}>{row.username}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ color: "white", borderBottom: "1px solid #333" }}>
                      {row.timeframe}
                    </TableCell>

                    <TableCell sx={{ color: "white", borderBottom: "1px solid #333" }}>
                      <Typography sx={{ fontSize: "0.9rem" }}>
                        {row.lastUpdated.split(" ")[0]}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: "#aaa" }}>
                        {row.lastUpdated.split(" ").slice(1).join(" ")}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ borderBottom: "1px solid #333", textAlign: "right" }}>
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
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Footer */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 2, color: "white", backgroundColor: "#000" }}>
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
    </Box>
  );
}


