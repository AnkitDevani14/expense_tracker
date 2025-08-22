import React from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon
} from '@mui/icons-material';

const AchievementNotification = ({ open, achievement, onClose }) => {
  if (!achievement) return null;

  const IconComponent = achievement.icon;

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        sx={{
          width: '100%',
          minWidth: 300,
          bgcolor: 'success.light',
          color: 'success.contrastText',
          '& .MuiAlert-icon': {
            color: 'success.contrastText'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: achievement.color,
              color: 'white'
            }}
          >
            <IconComponent />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Achievement Unlocked!
            </Typography>
            <Typography variant="body2">
              {achievement.title} - {achievement.description}
            </Typography>
          </Box>
          <Chip
            label={`+${achievement.points} pts`}
            size="small"
            color="primary"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default AchievementNotification; 