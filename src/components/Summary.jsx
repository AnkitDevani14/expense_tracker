import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PaidIcon from '@mui/icons-material/Paid';

const Summary = ({ total }) => (
  <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'white', minWidth: 0, maxWidth: '100%' }}>
    <PaidIcon color="primary" sx={{ fontSize: 48, minWidth: 48 }} />
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="subtitle2" color="text.secondary" noWrap>Total Expense</Typography>
      <Typography
        variant="h4"
        fontWeight={700}
        color="primary.main"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: { xs: 160, sm: 220, md: 260 },
          fontSize: { xs: '2rem', sm: '2.5rem', md: '2.7rem' },
        }}
      >
        ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Typography>
    </Box>
  </Paper>
);

export default Summary; 