import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const FilterBar = ({ filter, setFilter, categories = [] }) => {
  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };
  const handleReset = () => {
    setFilter({ search: "", category: "", min: "", max: "", from: "", to: "" });
  };
  return (
    <Paper elevation={6} sx={{
      mb: 3,
      p: { xs: 2, sm: 3 },
      borderRadius: 4,
      bgcolor: 'rgba(255,255,255,0.85)',
      boxShadow: '0 4px 32px 0 rgba(80,120,200,0.08)',
      backdropFilter: 'blur(6px)',
      border: '1px solid #e3e8f0',
      minWidth: 0
    }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />}
        alignItems="center"
        useFlexGap
        flexWrap="wrap"
      >
        <TextField
          label="Search"
          name="search"
          value={filter.search}
          onChange={handleChange}
          size="small"
          sx={{ minWidth: 160, flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Category"
          name="category"
          select
          value={filter.category}
          onChange={handleChange}
          size="small"
          sx={{ minWidth: 140, flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CategoryIcon />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem key="all" value="">All</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id || cat.name} value={cat.name}>{cat.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Min Amount"
          name="min"
          type="number"
          value={filter.min}
          onChange={handleChange}
          size="small"
          sx={{ minWidth: 120, flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoneyIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Max Amount"
          name="max"
          type="number"
          value={filter.max}
          onChange={handleChange}
          size="small"
          sx={{ minWidth: 120, flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoneyIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="From"
          name="from"
          type="date"
          value={filter.from}
          onChange={handleChange}
          size="small"
          sx={{ minWidth: 140, flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarMonthIcon />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To"
          name="to"
          type="date"
          value={filter.to}
          onChange={handleChange}
          size="small"
          sx={{ minWidth: 140, flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarMonthIcon />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="outlined"
          color="primary"
          size="medium"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          sx={{ borderRadius: 2, fontWeight: 600, ml: { md: 2 }, mt: { xs: 2, md: 0 }, minWidth: 120 }}
        >
          Reset
        </Button>
      </Stack>
    </Paper>
  );
};

export default FilterBar; 