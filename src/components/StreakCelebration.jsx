import React from 'react';
import { Box, Typography, Zoom, Fade } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';

const StreakCelebration = ({ open, streak, onClose }) => {
  if (!open) return null;

  return (
    <Fade in={open} timeout={1000}>
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        <Zoom in={open} timeout={500}>
          <Box
            sx={{
              bgcolor: 'rgba(255, 193, 7, 0.95)',
              borderRadius: 4,
              p: 3,
              boxShadow: 8,
              border: '3px solid #ff9800',
              minWidth: 200
            }}
          >
            <TrophyIcon sx={{ fontSize: 48, color: '#ff6f00', mb: 1 }} />
            <Typography variant="h6" fontWeight={700} color="white" gutterBottom>
              🔥 Streak Milestone! 🔥
            </Typography>
            <Typography variant="body1" color="white" fontWeight={600}>
              {streak} Day Streak!
            </Typography>
            <Typography variant="body2" color="white" sx={{ mt: 1 }}>
              Amazing! Keep up the great work!
            </Typography>
          </Box>
        </Zoom>
      </Box>
    </Fade>
  );
};

export default StreakCelebration; 