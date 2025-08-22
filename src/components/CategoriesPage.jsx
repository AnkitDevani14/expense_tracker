import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from "firebase/firestore";

const DEFAULT_CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Other"];

const CategoriesPage = ({ user, categories, onCategoriesChange }) => {
  const [loading, setLoading] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [editCat, setEditCat] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAdd = async () => {
    if (!newCat.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "categories"), { name: newCat.trim(), uid: user.uid });
      setNewCat("");
      if (onCategoriesChange) await onCategoriesChange();
    } catch (err) {
      console.error("Error adding category:", err);
      // You could add a toast notification here for better UX
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cat) => {
    if (cat.default) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "categories", cat.id));
      if (onCategoriesChange) await onCategoriesChange();
    } catch (err) {
      console.error("Error deleting category:", err);
      // You could add a toast notification here for better UX
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditCat(cat);
    setEditValue(cat.name);
    setDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editValue.trim() || editCat.default) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "categories", editCat.id), { name: editValue.trim() });
      if (onCategoriesChange) await onCategoriesChange();
    } catch (err) {
      console.error("Error updating category:", err);
      // You could add a toast notification here for better UX
    } finally {
      setDialogOpen(false);
      setEditCat(null);
      setEditValue("");
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 } }}>
      <Typography variant="h5" fontWeight={700} mb={2}>Manage Categories</Typography>
      <Paper elevation={3} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'white', mb: 3 }}>
        <Box display="flex" gap={2} alignItems="center" mb={2}>
          <TextField
            label="New Category"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            size="small"
            fullWidth
          />
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd} disabled={!newCat.trim()}>
            Add
          </Button>
        </Box>
        <List>
          {loading ? <ListItem><ListItemText primary="Loading..." /></ListItem> :
            (categories || []).map(cat => (
              <ListItem key={cat.id} secondaryAction={
                !cat.default && <>
                  <IconButton edge="end" onClick={() => handleEdit(cat)}><EditIcon /></IconButton>
                  <IconButton edge="end" color="error" onClick={() => handleDelete(cat)}><DeleteIcon /></IconButton>
                </>
              }>
                <ListItemText primary={cat.name} secondary={cat.default ? "Default" : null} />
              </ListItem>
            ))}
        </List>
      </Paper>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={!editValue.trim()}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage; 