import * as React from "react";
import { TextField } from "@mui/material";

export interface RowData {
  username: string;
  timeframe: string;
  lastUpdated: string;
  accuracy: number;
}

interface SearchBarProps {
  data: RowData[];
  onFilteredResults: (filteredData: RowData[]) => void;
  placeholder?: string;
  width?: number;
}

export default function SearchBar({
  data,
  onFilteredResults,
  placeholder = "Search Account",
  width = 250,
}: SearchBarProps) {
  const [searchValue, setSearchValue] = React.useState("");

  // Enhanced search filtering with prioritized matching
  const handleSearchChange = React.useCallback(
    (searchTerm: string) => {
      setSearchValue(searchTerm);

      if (!searchTerm.trim()) {
        onFilteredResults(data);
        return;
      }

      const normalizedSearch = searchTerm.toLowerCase().trim();

      // Separate matches into priority groups
      const startsWithMatches: RowData[] = [];
      const containsMatches: RowData[] = [];

      data.forEach((row) => {
        const username = row.username.toLowerCase();

        if (username.startsWith(normalizedSearch)) {
          startsWithMatches.push(row);
        } else if (username.includes(normalizedSearch)) {
          containsMatches.push(row);
        }
      });

      // Return prioritized results: starts-with matches first, then contains matches
      const filteredResults = [...startsWithMatches, ...containsMatches];
      onFilteredResults(filteredResults);
    },
    [data, onFilteredResults]
  );

  // Update results when data changes
  React.useEffect(() => {
    handleSearchChange(searchValue);
  }, [data, handleSearchChange, searchValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e.target.value);
  };

  return (
    <TextField
      placeholder={placeholder}
      variant="outlined"
      size="small"
      value={searchValue}
      onChange={handleInputChange}
      sx={{
        input: { color: "white" },
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "orange" },
          "&:hover fieldset": { borderColor: "orange" },
          "&.Mui-focused fieldset": { borderColor: "orange" },
        },
        backgroundColor: "#111",
        borderRadius: 2,
        width: width,
      }}
    />
  );
}
