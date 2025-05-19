import React from 'react';
import { Box, Avatar, Typography, Stack, Chip } from '@mui/material';

interface UserHeaderProps {
  username: string;
  avgTimeframe: string;
  accuracy: number;
}

const UserHeader: React.FC<UserHeaderProps> = ({ username, avgTimeframe, accuracy }) => {
  // Pick a green chip for high‑accuracy
  const color = accuracy > 80 ? 'success' : 'default';

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle2">Account</Typography>
        <Avatar sx={{ bgcolor: 'primary.main', width: 28, height: 28 }}>
          {username.charAt(1).toUpperCase()}
        </Avatar>
        <Typography variant="body1">{username}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle2">Avg. Trading Timeframe</Typography>
        <Typography variant="body1">{avgTimeframe}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle2">Accuracy</Typography>
        <Chip label={`${accuracy}%`} color={color} size="small" />
      </Stack>
    </Box>
  );
};

export default UserHeader;
