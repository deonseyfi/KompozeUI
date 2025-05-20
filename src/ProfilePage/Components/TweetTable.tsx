import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography
} from '@mui/material';

export interface TweetRecord {
  tweet: string;
  sentimentRating: number; // e.g. –1 to +1 or 0–100 scale
  accuracy: number;         // percent
  time: string;             // formatted time string
}

interface TweetTableProps {
  records: TweetRecord[];
}

const TweetTable: React.FC<TweetTableProps> = ({ records }) => {
  if (!records.length) {
    return (
      <Typography variant="body2" color="textSecondary">
        No tweets to display.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: "70vh", mt: 2, backgroundColor: "#111", borderRadius: 5 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#000", borderBottom: "1px solid #444" }}> Tweet</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#000", borderBottom: "1px solid #444" }} align="right">Sentiment Rating</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#000", borderBottom: "1px solid #444" }} align="right">Accuracy</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: "#000", borderBottom: "1px solid #444" }} align="right">Time</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {records.map((row, idx) => (
            <TableRow key={idx} hover>
              <TableCell sx={{ color: "white", borderBottom: "1px solid #333" }} component="th" scope="row">
                {row.tweet}
              </TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid #333" }} align="right">{row.sentimentRating}</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid #333" }} align="right">{row.accuracy}%</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid #333" }} align="right">{row.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TweetTable;
