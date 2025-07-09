import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import PaidIcon from '@mui/icons-material/Paid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ["#1976d2", "#26a69a", "#7c4dff", "#ff7043", "#ffd600", "#8d6e63"];

const timeRanges = [
  { label: 'This Month', value: 'month' },
  { label: 'This Week', value: 'week' },
  { label: 'This Year', value: 'year' },
  { label: 'All Time', value: 'all' },
];

function getStartOf(range) {
  const now = new Date();
  if (range === 'month') return new Date(now.getFullYear(), now.getMonth(), 1);
  if (range === 'week') {
    const day = now.getDay();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
  }
  if (range === 'year') return new Date(now.getFullYear(), 0, 1);
  return null;
}

function filterExpenses(expenses, { range, from, to, category }) {
  let filtered = expenses;
  if (range && range !== 'all') {
    const start = getStartOf(range);
    filtered = filtered.filter(e => new Date(e.date) >= start);
  }
  if (from) filtered = filtered.filter(e => new Date(e.date) >= new Date(from));
  if (to) filtered = filtered.filter(e => new Date(e.date) <= new Date(to));
  if (category) filtered = filtered.filter(e => e.category === category);
  return filtered;
}

function getTrends(expenses, range) {
  // Group by day for week/month, by month for year, by year for all
  const map = {};
  expenses.forEach(e => {
    let key;
    if (range === 'year') key = e.date.slice(0, 7); // YYYY-MM
    else if (range === 'all') key = e.date.slice(0, 4); // YYYY
    else key = e.date;
    map[key] = (map[key] || 0) + Number(e.amount);
  });
  return Object.entries(map).sort().map(([date, value]) => ({ date, value }));
}

function getCategoryTotals(expenses) {
  const totals = {};
  expenses.forEach((e) => {
    if (!totals[e.category]) totals[e.category] = 0;
    totals[e.category] += Number(e.amount);
  });
  let entries = Object.entries(totals).map(([category, total], i) => ({
    name: category,
    value: total,
    color: COLORS[i % COLORS.length],
  }));
  // Limit to top 5, group rest as 'Other'
  if (entries.length > 5) {
    const top = entries.sort((a, b) => b.value - a.value).slice(0, 5);
    const rest = entries.slice(5);
    const otherTotal = rest.reduce((sum, e) => sum + e.value, 0);
    if (otherTotal > 0) top.push({ name: 'Other', value: otherTotal, color: '#bdbdbd' });
    entries = top;
  }
  return entries;
}

const Dashboard = ({ expenses, user, categories = [] }) => {
  const [filters, setFilters] = React.useState({ range: 'month', from: '', to: '', category: '' });
  const filtered = React.useMemo(() => filterExpenses(expenses, filters), [expenses, filters]);
  const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0);
  const count = filtered.length;
  const categoryData = getCategoryTotals(filtered);
  const highest = filtered.reduce((max, e) => (!max || Number(e.amount) > Number(max.amount) ? e : max), null);
  const lowest = filtered.reduce((min, e) => (!min || Number(e.amount) < Number(min.amount) ? e : min), null);
  const topCategories = [...categoryData].sort((a, b) => b.value - a.value).slice(0, 3);
  const trends = getTrends(filtered, filters.range);
  const recent = [...filtered].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 } }}>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Welcome{user && user.email ? `, ${user.email}` : ""}!
      </Typography>
      {/* Filter Bar */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: 'white', display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        {timeRanges.map(opt => (
          <Button
            key={opt.value}
            variant={filters.range === opt.value ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setFilters(f => ({ ...f, range: opt.value, from: '', to: '' }))}
            sx={{ fontWeight: 600 }}
          >
            {opt.label}
          </Button>
        ))}
        <TextField
          label="From"
          type="date"
          size="small"
          value={filters.from}
          onChange={e => setFilters(f => ({ ...f, from: e.target.value, range: '' }))}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To"
          type="date"
          size="small"
          value={filters.to}
          onChange={e => setFilters(f => ({ ...f, to: e.target.value, range: '' }))}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Category"
          select
          size="small"
          value={filters.category}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat.id || cat.name} value={cat.name}>{cat.name}</MenuItem>
          ))}
        </TextField>
      </Paper>
      {/* Stats */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={3}>
        <Paper elevation={4} sx={{ flex: 1, p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'white' }}>
          <PaidIcon color="primary" sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Total Spent</Typography>
            <Typography variant="h4" fontWeight={700} color="primary.main">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
            <Typography variant="body2" color="text.secondary">{count} expenses</Typography>
          </Box>
        </Paper>
        <Paper elevation={4} sx={{ flex: 2, p: 3, borderRadius: 3, bgcolor: 'white', minWidth: 0 }}>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>By Category</Typography>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#1976d2"
                label={false}
              >
                {categoryData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n, p) => [`₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, p.payload.name]} />
              <Legend formatter={(value) => <span style={{ fontWeight: 600 }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
        <Paper elevation={4} sx={{ flex: 1, p: 3, borderRadius: 3, bgcolor: 'white', minWidth: 0 }}>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>Highest</Typography>
          {highest ? (
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingUpIcon color="success" />
              <Typography fontWeight={600}>₹{Number(highest.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
              <Typography color="text.secondary">{highest.description}</Typography>
            </Box>
          ) : <Typography color="text.secondary">-</Typography>}
          <Typography variant="subtitle2" color="text.secondary" mt={2} mb={1}>Lowest</Typography>
          {lowest ? (
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingDownIcon color="error" />
              <Typography fontWeight={600}>₹{Number(lowest.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
              <Typography color="text.secondary">{lowest.description}</Typography>
            </Box>
          ) : <Typography color="text.secondary">-</Typography>}
        </Paper>
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={3}>
        <Paper elevation={4} sx={{ flex: 2, p: 3, borderRadius: 3, bgcolor: 'white', minWidth: 0 }}>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>Trends</Typography>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trends} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${v.toFixed(2)}`} />
              <Line type="monotone" dataKey="value" stroke="#1976d2" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
        <Paper elevation={4} sx={{ flex: 1, p: 3, borderRadius: 3, bgcolor: 'white', minWidth: 0 }}>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>Top Categories</Typography>
          <List dense>
            {topCategories.length === 0 && <ListItem><ListItemText primary="-" /></ListItem>}
            {topCategories.map((cat, i) => (
              <ListItem key={cat.name}>
                <ListItemText primary={cat.name} secondary={`₹${cat.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Stack>
      <Paper elevation={3} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'white' }}>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>Recent Expenses</Typography>
        <List dense>
          {recent.length === 0 && <ListItem><ListItemText primary="No expenses yet." /></ListItem>}
          {recent.map((e, i) => (
            <React.Fragment key={e.id}>
              <ListItem>
                <ListItemText
                  primary={e.description}
                  secondary={`${e.category} • ₹${Number(e.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} • ${e.date}`}
                />
              </ListItem>
              {i < recent.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Dashboard; 