import React from "react";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

const PAGE_SIZES = [5, 10, 20, 50];

const PaginationBar = ({ page, setPage, pageSize, setPageSize, totalCount }) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mt={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body2">Rows per page:</Typography>
        <Select
          value={pageSize}
          onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          size="small"
        >
          {PAGE_SIZES.map(size => (
            <MenuItem key={size} value={size}>{size}</MenuItem>
          ))}
        </Select>
      </Box>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="primary"
        shape="rounded"
        siblingCount={1}
        boundaryCount={1}
        size="medium"
      />
      <Typography variant="body2" color="text.secondary">
        {totalCount === 0 ? "No expenses" : `Total: ${totalCount}`}
      </Typography>
    </Box>
  );
};

export default PaginationBar; 