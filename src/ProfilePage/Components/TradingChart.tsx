import React from 'react';
import { Box } from '@mui/material';
import CandleChartWithDots from './CandleChartWithDots'; // Adjust the import path as necessary

const TradingChart: React.FC = () => {
  return (
    <Box
      height={400}
      width="100%"
      borderRadius={1}
      bgcolor="grey.100"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {/* TODO: swap this out for your TradingView widget or other chart component */}
      <CandleChartWithDots />
    </Box>
  );
};

export default TradingChart;
