import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CategoryIcon from '@mui/icons-material/Category';

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

const ExpenseForm = ({ onAdd, categories = [] }) => {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: getToday(),
    category: categories[0]?.name || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.description || !form.date) return;
    onAdd(form);
    setForm({ amount: "", description: "", date: getToday(), category: categories[0]?.name || "" });
  };

  return (
    <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'white' }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Add Expense
      </Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoneyIcon />
              </InputAdornment>
            ),
            inputProps: { min: 0, step: "0.01" },
          }}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DescriptionIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarMonthIcon />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Category"
          name="category"
          select
          value={form.category}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CategoryIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          fullWidth
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id || cat.name} value={cat.name}>{cat.name}</MenuItem>
          ))}
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: 2, fontWeight: 600, mt: 1, boxShadow: 2 }}
          disabled={!form.amount || !form.description || !form.date}
        >
          Add
        </Button>
      </Box>
    </Paper>
  );
};

export default ExpenseForm; 