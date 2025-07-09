import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Alert from '@mui/material/Alert';

function toCSV(expenses) {
  if (!expenses.length) return '';
  const keys = Object.keys(expenses[0]);
  const header = keys.join(',');
  const rows = expenses.map(e => keys.map(k => `"${String(e[k]).replace(/"/g, '""')}"`).join(','));
  return [header, ...rows].join('\r\n');
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

const parseCSV = (text) => {
  const [header, ...rows] = text.trim().split(/\r?\n/);
  const keys = header.split(',');
  return rows.map(row => {
    const values = row.match(/("[^"]*"|[^,]+)/g).map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
    const obj = {};
    keys.forEach((k, i) => { obj[k] = values[i] || ""; });
    return obj;
  });
};

const parseJSON = (text) => {
  try { return JSON.parse(text); } catch { return null; }
};

const ExportData = ({ expenses, onImport }) => {
  const [error, setError] = React.useState("");
  const fileInput = React.useRef();
  const handleExportCSV = () => {
    const csv = toCSV(expenses);
    download('expenses.csv', csv, 'text/csv');
  };
  const handleExportJSON = () => {
    const json = JSON.stringify(expenses, null, 2);
    download('expenses.json', json, 'application/json');
  };
  const handleImport = async (e) => {
    setError("");
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    const text = await file.text();
    let imported = [];
    if (ext === 'csv') imported = parseCSV(text);
    else if (ext === 'json') imported = parseJSON(text) || [];
    else setError('Unsupported file type. Use CSV or JSON.');
    if (!Array.isArray(imported) || !imported.length) {
      setError('No valid expenses found.');
      return;
    }
    // Basic validation: must have amount, description, date, category
    const valid = imported.filter(e => e.amount && e.description && e.date && e.category);
    if (!valid.length) {
      setError('No valid expenses found. Each must have amount, description, date, category.');
      return;
    }
    if (onImport) await onImport(valid);
    fileInput.current.value = "";
  };
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2} alignItems="center">
      <Button
        variant="outlined"
        color="primary"
        startIcon={<FileDownloadOutlinedIcon />}
        onClick={handleExportCSV}
        sx={{ fontWeight: 600, borderRadius: 2 }}
        disabled={!expenses.length}
      >
        Export CSV
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<DownloadIcon />}
        onClick={handleExportJSON}
        sx={{ fontWeight: 600, borderRadius: 2 }}
        disabled={!expenses.length}
      >
        Export JSON
      </Button>
      <input
        type="file"
        accept=".csv,.json"
        style={{ display: 'none' }}
        ref={fileInput}
        onChange={handleImport}
      />
      <Button
        variant="contained"
        color="success"
        startIcon={<UploadFileIcon />}
        onClick={() => fileInput.current && fileInput.current.click()}
        sx={{ fontWeight: 600, borderRadius: 2 }}
      >
        Import Expenses
      </Button>
      {error && <Alert severity="error" sx={{ ml: 2 }}>{error}</Alert>}
    </Stack>
  );
};

export default ExportData; 