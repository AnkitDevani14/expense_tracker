import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#1976d2", "#26a69a", "#7c4dff", "#ff7043", "#ffd600", "#8d6e63"];

function getCategoryTotals(expenses) {
  const totals = {};
  expenses.forEach((e) => {
    if (!totals[e.category]) totals[e.category] = 0;
    totals[e.category] += Number(e.amount);
  });
  return Object.entries(totals).map(([category, total], i) => ({
    name: category,
    value: total,
    color: COLORS[i % COLORS.length],
  }));
}

const CategorySummary = ({ expenses }) => {
  const data = getCategoryTotals(expenses);
  return (
    <Paper elevation={4} sx={{ p: 3, borderRadius: 3, mb: 3, bgcolor: 'white' }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Category Summary
      </Typography>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} alignItems="center">
        {/* List */}
        <Box flex={1} minWidth={180}>
          <List dense>
            {data.map((cat, i) => (
              <React.Fragment key={cat.name}>
                <ListItem>
                  <Box width={12} height={12} borderRadius={2} mr={1} bgcolor={cat.color} />
                  <ListItemText
                    primary={cat.name}
                    secondary={`$${cat.value.toFixed(2)}`}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
                {i < data.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Box>
        {/* Pie Chart */}
        <Box flex={2} minWidth={220} height={220}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#1976d2"
                label={({ name }) => name}
              >
                {data.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
};

export default CategorySummary; 