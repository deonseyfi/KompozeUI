import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchAccountsProps {
  onSearch: (value: string) => void;
}

const SearchAccounts: React.FC<SearchAccountsProps> = ({ onSearch }) => (
  <TextField
    size="small"
    variant="outlined"
    placeholder="Search Accounts"
    onChange={(e) => onSearch(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon fontSize="small" />
        </InputAdornment>
      ),
    }}
    sx={{
      input: { color: "white" },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#ff6b35",
        },
        "&:hover fieldset": {
          borderColor: "#ff6b35",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#ff6b35",
        },
      },
      backgroundColor: "#111",
      borderRadius: 2,
      width: 250,
    }}
  />
);

export default SearchAccounts;
