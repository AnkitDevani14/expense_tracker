import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Home = ({ onSignIn }) => (
  <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f9f9f9' }}>
    <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, maxWidth: 420, width: '100%', textAlign: 'center', bgcolor: 'white' }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <ReceiptLongIcon color="primary" sx={{ fontSize: 64 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Expense Tracker
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={1}>
          Track your expenses, analyze your spending, and stay in control.
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Simple. Secure. Free. Your personal finance dashboard, accessible anywhere.
        </Typography>
        <List dense sx={{ width: '100%', mb: 2 }}>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Add, edit, and delete expenses easily" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Visualize spending by category" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Export your data (CSV/JSON)" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Google & Email sign-in, secure and private" />
          </ListItem>
        </List>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: 2, fontWeight: 600, px: 4, py: 1.5, fontSize: 18 }}
          onClick={onSignIn}
        >
          Sign In
        </Button>
        <Box mt={4} color="text.secondary" fontSize={13}>
          &copy; {new Date().getFullYear()} Expense Tracker. Built with Material UI & Firebase.
        </Box>
      </Box>
    </Paper>
  </Box>
);

export default Home; 