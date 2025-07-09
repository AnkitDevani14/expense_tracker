import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import GoogleIcon from '@mui/icons-material/Google';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

function getInitials(email) {
  if (!email) return "?";
  return email[0].toUpperCase();
}

const AuthMenu = ({ user, setUser, showSignIn, setShowSignIn }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (showSignIn) setDialogOpen(true);
  }, [showSignIn]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setShowSignIn(false);
  };

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailSignIn = async () => {
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailSignUp = async () => {
    setError("");
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    handleClose();
  };

  if (!user) {
    return (
      <>
        <Button
          color="inherit"
          startIcon={<LoginIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ fontWeight: 600 }}
        >
          Sign In
        </Button>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Sign In</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <Button
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                sx={{ fontWeight: 600 }}
              >
                Sign in with Google
              </Button>
              {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleMenu} size="large">
        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
          {getInitials(user.email)}
        </Avatar>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem disabled>{user.email}</MenuItem>
        <MenuItem onClick={handleSignOut} sx={{ color: 'error.main' }}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};

export default AuthMenu; 