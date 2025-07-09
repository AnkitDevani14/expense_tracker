import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AuthMenu from "./AuthMenu";
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import PaletteIcon from '@mui/icons-material/Palette';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Expenses', path: '/expenses' },
  { label: 'Categories', path: '/categories' }
];

const Header = ({ user, setUser, showSignIn, setShowSignIn, darkMode, onToggleDarkMode, primaryColor, setPrimaryColor }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const colorInputRef = React.useRef();
  const handleColorChange = (e) => {
    setPrimaryColor(e.target.value);
    localStorage.setItem('primaryColor', e.target.value);
  };
  return (
    <AppBar position="sticky" color="primary" elevation={3} sx={{ mb: 4 }}>
      <Toolbar>
        <Box display="flex" alignItems="center" gap={1}>
          <ReceiptLongIcon fontSize="large" />
          <Typography variant="h5" component="div" fontWeight={700} letterSpacing={1}>
            Expense Tracker
          </Typography>
        </Box>
        {user && (
          <Box sx={{ ml: 4, display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color={location.pathname === item.path ? 'secondary' : 'inherit'}
                variant={location.pathname === item.path ? 'contained' : 'text'}
                onClick={() => navigate(item.path)}
                sx={{ fontWeight: 600, borderRadius: 2, px: 2 }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Pick theme color">
          <IconButton
            sx={{ bgcolor: primaryColor, color: '#fff', mx: 1, '&:hover': { bgcolor: primaryColor } }}
            onClick={() => colorInputRef.current && colorInputRef.current.click()}
          >
            <PaletteIcon />
            <input
              type="color"
              ref={colorInputRef}
              value={primaryColor}
              onChange={handleColorChange}
              style={{ display: 'none' }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
          <Switch checked={darkMode} onChange={onToggleDarkMode} color="default" />
        </Tooltip>
        <AuthMenu user={user} setUser={setUser} showSignIn={showSignIn} setShowSignIn={setShowSignIn} />
      </Toolbar>
    </AppBar>
  );
};

export default Header; 