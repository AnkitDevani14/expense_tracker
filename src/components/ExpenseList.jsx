import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CategoryIcon from '@mui/icons-material/Category';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonGroup from '@mui/material/ButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SortIcon from '@mui/icons-material/Sort';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ExpenseList = ({ expenses, onDelete, onEdit, loading, sort, setSort }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">Sort by:</Typography>
      <ButtonGroup variant="outlined" size="small">
        <ToggleButton
          value="date"
          selected={sort.field === 'date'}
          onClick={() => setSort(s => ({ ...s, field: 'date' }))}
        >
          <SortIcon sx={{ mr: 0.5 }} fontSize="small" /> Date
        </ToggleButton>
        <ToggleButton
          value="amount"
          selected={sort.field === 'amount'}
          onClick={() => setSort(s => ({ ...s, field: 'amount' }))}
        >
          <SortIcon sx={{ mr: 0.5 }} fontSize="small" /> Amount
        </ToggleButton>
      </ButtonGroup>
      <ToggleButtonGroup
        value={sort.dir}
        exclusive
        onChange={(_, dir) => dir && setSort(s => ({ ...s, dir }))}
        size="small"
        sx={{ ml: 2 }}
      >
        <ToggleButton value="desc">
          <ArrowDownwardIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton value="asc">
          <ArrowUpwardIcon fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
    {loading ? (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', color: 'text.secondary' }}>Loading...</Paper>
    ) : expenses.length === 0 ? (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', color: 'text.secondary' }}>No expenses yet.</Paper>
    ) : (
      <Stack spacing={3}>
        {expenses.map((e) => (
          <Paper
            key={e.id}
            elevation={4}
            sx={{
              p: 2.5,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.06)',
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)' },
            }}
          >
            <Box flex={1}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {e.description}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" color="text.secondary">
                <Typography variant="body2" display="flex" alignItems="center" gap={0.5}>
                  <CategoryIcon fontSize="small" /> {e.category}
                </Typography>
                <Typography variant="body2" display="flex" alignItems="center" gap={0.5}>
                  <CalendarMonthIcon fontSize="small" /> {e.date}
                </Typography>
              </Stack>
            </Box>
            <Typography variant="h6" color="primary.main" fontWeight={700} sx={{ minWidth: 90, textAlign: 'right' }}>
              ₹{Number(e.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => onEdit(e)}
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(e.id)}
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                Delete
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
    )}
  </Box>
);

export default ExpenseList; 