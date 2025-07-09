import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const categories = ["Food", "Transport", "Shopping", "Bills", "Other"];

const ExpenseFormFields = ({ form, onChange }) => (
  <>
    <TextField
      label="Amount"
      name="amount"
      type="number"
      value={form.amount}
      onChange={onChange}
      fullWidth
      margin="normal"
      required
      inputProps={{ min: 0, step: "0.01" }}
    />
    <TextField
      label="Description"
      name="description"
      value={form.description}
      onChange={onChange}
      fullWidth
      margin="normal"
      required
    />
    <TextField
      label="Date"
      name="date"
      type="date"
      value={form.date}
      onChange={onChange}
      fullWidth
      margin="normal"
      required
      InputLabelProps={{ shrink: true }}
    />
    <TextField
      label="Category"
      name="category"
      select
      value={form.category}
      onChange={onChange}
      fullWidth
      margin="normal"
    >
      {categories.map((cat) => (
        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
      ))}
    </TextField>
  </>
);

export default ExpenseFormFields; 