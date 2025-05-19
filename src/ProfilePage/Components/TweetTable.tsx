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
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tweet</TableCell>
            <TableCell align="right">Sentiment Rating</TableCell>
            <TableCell align="right">Accuracy</TableCell>
            <TableCell align="right">Time</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {records.map((row, idx) => (
            <TableRow key={idx} hover>
              <TableCell component="th" scope="row">
                {row.tweet}
              </TableCell>
              <TableCell align="right">{row.sentimentRating}</TableCell>
              <TableCell align="right">{row.accuracy}%</TableCell>
              <TableCell align="right">{row.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TweetTable;
