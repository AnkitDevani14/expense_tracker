import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  Upload as UploadIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { createWorker } from 'tesseract.js';

const ReceiptScanner = ({ open, onClose, onExpenseExtracted, categories = [] }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);
  const cameraRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
      setExtractedData(null);
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleCameraCapture = () => {
    if (cameraRef.current) {
      cameraRef.current.click();
    }
  };

  const scanReceipt = async () => {
    if (!image) return;

    setScanning(true);
    setError(null);

    try {
      const worker = await createWorker('eng');
      
      const { data: { text } } = await worker.recognize(image);
      await worker.terminate();

      // Parse the extracted text
      const parsedData = parseReceiptText(text);
      setExtractedData(parsedData);
      
    } catch (err) {
      setError('Failed to scan receipt. Please try again with a clearer image.');
      console.error('OCR Error:', err);
    } finally {
      setScanning(false);
    }
  };

  const parseReceiptText = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Extract amount (look for currency patterns)
    const amountPattern = /(?:₹|Rs\.?|INR|Total|Amount|TOTAL|AMOUNT)[\s:]*([0-9,]+\.?[0-9]*)/i;
    let amount = null;
    for (const line of lines) {
      const match = line.match(amountPattern);
      if (match) {
        amount = parseFloat(match[1].replace(/,/g, ''));
        break;
      }
    }

    // Extract date (look for date patterns)
    const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/;
    let date = null;
    for (const line of lines) {
      const match = line.match(datePattern);
      if (match) {
        const dateStr = match[1];
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
          date = parsedDate.toISOString().split('T')[0];
          break;
        }
      }
    }

    // Extract description (look for store names, items)
    let description = '';
    const storePatterns = [
      /(?:STORE|SHOP|MARKET|MALL|SUPERMARKET|RETAILER)[\s:]*([A-Za-z\s]+)/i,
      /([A-Za-z\s]+)(?:STORE|SHOP|MARKET|MALL|SUPERMARKET)/i
    ];
    
    for (const line of lines) {
      for (const pattern of storePatterns) {
        const match = line.match(pattern);
        if (match && match[1].trim().length > 2) {
          description = match[1].trim();
          break;
        }
      }
      if (description) break;
    }

    // If no store name found, use first meaningful line
    if (!description && lines.length > 0) {
      const firstLine = lines[0].trim();
      if (firstLine.length > 3 && !firstLine.match(/^\d/)) {
        description = firstLine;
      }
    }

    // Suggest category based on keywords
    const categoryKeywords = {
      'Food': ['restaurant', 'food', 'meal', 'dining', 'cafe', 'pizza', 'burger'],
      'Transport': ['fuel', 'gas', 'petrol', 'diesel', 'uber', 'taxi', 'transport'],
      'Shopping': ['store', 'shop', 'retail', 'clothing', 'fashion'],
      'Entertainment': ['movie', 'cinema', 'theatre', 'game', 'entertainment'],
      'Healthcare': ['medical', 'pharmacy', 'doctor', 'hospital', 'medicine']
    };

    let suggestedCategory = 'Other';
    const textLower = text.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        suggestedCategory = category;
        break;
      }
    }

    return {
      amount: amount || 0,
      date: date || new Date().toISOString().split('T')[0],
      description: description || 'Receipt',
      category: suggestedCategory,
      rawText: text
    };
  };

  const handleUseExtractedData = () => {
    if (extractedData) {
      onExpenseExtracted(extractedData);
      handleClose();
    }
  };

  const handleClose = () => {
    setImage(null);
    setPreview(null);
    setExtractedData(null);
    setError(null);
    setScanning(false);
    setEditing(false);
    onClose();
  };

  const handleEditData = (field, value) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Receipt Scanner</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          {!image ? (
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: 'center', 
                border: '2px dashed',
                borderColor: 'grey.300',
                bgcolor: 'grey.50'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Upload Receipt Image
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Take a photo or upload an image of your receipt to automatically extract expense details
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<CameraIcon />}
                  onClick={handleCameraCapture}
                  sx={{ borderRadius: 2 }}
                >
                  Take Photo
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ borderRadius: 2 }}
                >
                  Upload Image
                </Button>
              </Box>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </Paper>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip 
                  icon={<CheckIcon />} 
                  label="Image uploaded" 
                  color="success" 
                  variant="outlined"
                />
                <Button
                  size="small"
                  onClick={() => setImage(null)}
                >
                  Change Image
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <img 
                    src={preview} 
                    alt="Receipt" 
                    style={{ 
                      width: '100%', 
                      maxHeight: 300, 
                      objectFit: 'contain',
                      borderRadius: 8
                    }} 
                  />
                </Box>
                
                {extractedData && (
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Extracted Data
                    </Typography>
                    
                    {editing ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          label="Amount"
                          type="number"
                          value={extractedData.amount}
                          onChange={(e) => handleEditData('amount', parseFloat(e.target.value) || 0)}
                          fullWidth
                        />
                        <TextField
                          label="Date"
                          type="date"
                          value={extractedData.date}
                          onChange={(e) => handleEditData('date', e.target.value)}
                          fullWidth
                        />
                        <TextField
                          label="Description"
                          value={extractedData.description}
                          onChange={(e) => handleEditData('description', e.target.value)}
                          fullWidth
                        />
                        <TextField
                          label="Category"
                          select
                          value={extractedData.category}
                          onChange={(e) => handleEditData('category', e.target.value)}
                          fullWidth
                        >
                          {categories.map((cat) => (
                            <MenuItem key={cat.name} value={cat.name}>
                              {cat.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography><strong>Amount:</strong> ₹{extractedData.amount.toLocaleString('en-IN')}</Typography>
                        <Typography><strong>Date:</strong> {extractedData.date}</Typography>
                        <Typography><strong>Description:</strong> {extractedData.description}</Typography>
                        <Typography><strong>Category:</strong> {extractedData.category}</Typography>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => setEditing(true)}
                          sx={{ alignSelf: 'flex-start', mt: 1 }}
                        >
                          Edit
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>

        {image && !extractedData && !scanning && (
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={scanReceipt}
              disabled={scanning}
              sx={{ borderRadius: 2 }}
            >
              {scanning ? 'Scanning...' : 'Scan Receipt'}
            </Button>
          </Box>
        )}

        {scanning && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Analyzing receipt image...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {extractedData && (
          <Button 
            variant="contained" 
            onClick={handleUseExtractedData}
            disabled={editing}
          >
            Use Extracted Data
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReceiptScanner; 