import React, { useState, useEffect, useRef, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Header from "./components/Header";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";
import { db, auth } from "./firebase";
import { trackAuth, trackExpense, trackError, initializeGTM } from "./utils/gtm";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where
} from "firebase/firestore";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ExpenseFormFields from "./components/ExpenseFormFields";
import FilterBar from "./components/FilterBar";
import ExportData from "./components/ExportData";
import { onAuthStateChanged } from "firebase/auth";
import Home from "./components/Home";
import PaginationBar from "./components/PaginationBar";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState as useReactState } from "react";
import CategoriesPage from "./components/CategoriesPage";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

function AppRoutes(props) {
  const {
    user, setUser, showSignIn, setShowSignIn, darkMode, handleToggleDarkMode,
    expenses, editExpense, editForm, handleEdit, handleEditChange, handleEditSave, handleEditCancel,
    filteredExpenses, paginatedExpenses, page, setPage, pageSize, setPageSize, totalCount,
    addExpense, deleteExpense, loading, filter, setFilter, total, categories, onCategoriesChange,
    sort, setSort, primaryColor, setPrimaryColor
  } = props;
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Header
        user={user}
        setUser={setUser}
        showSignIn={showSignIn}
        setShowSignIn={setShowSignIn}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        primaryColor={primaryColor}
        setPrimaryColor={setPrimaryColor}
      />
      {!user ? (
        <Home onSignIn={() => setShowSignIn(true)} />
      ) : (
        <Routes>
          <Route path="/dashboard" element={<Dashboard expenses={expenses} user={user} />} />
          <Route path="/categories" element={<CategoriesPage user={user} categories={categories} onCategoriesChange={onCategoriesChange} />} />
          <Route path="/expenses" element={
            <ExpensesPage
              user={user}
              expenses={expenses}
              addExpense={addExpense}
              deleteExpense={deleteExpense}
              handleEdit={handleEdit}
              loading={loading}
              filter={filter}
              setFilter={setFilter}
              filteredExpenses={filteredExpenses}
              paginatedExpenses={paginatedExpenses}
              total={total}
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalCount={totalCount}
              categories={categories}
              sort={sort}
              setSort={setSort}
            />
          } />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      )}
      <Dialog open={!!editExpense} onClose={handleEditCancel}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          {editForm && <ExpenseFormFields form={editForm} onChange={handleEditChange} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function ExpensesPage({
  user, expenses, addExpense, deleteExpense, handleEdit, loading,
  filter, setFilter, filteredExpenses, paginatedExpenses, total, page, setPage, pageSize, setPageSize, totalCount, categories,
  sort, setSort
}) {
  const handleImport = async (imported) => {
    for (const e of imported) {
      await addExpense(e);
    }
  };
  return (
    <Box sx={{ mx: 'auto', px: { xs: 0.5, sm: 2, md: 0 }, py: { xs: 1, sm: 3, md: 5 }, maxWidth: { xs: '100vw', md: 1400 } }}>
      <Grid container spacing={{ xs: 2, md: 4 }} alignItems="flex-start" wrap={{ xs: 'wrap', md: 'nowrap' }}>
        {/* Sidebar: Summary + Add Form */}
        <Grid item xs={12} md={3} sx={{ minWidth: 0, minHeight: { xs: 'auto', md: '80vh' }, display: 'flex' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 2 }, bgcolor: '#f7fafd', borderRadius: 4, width: '100%', boxShadow: 3, p: { xs: 1.5, md: 2.5 }, justifyContent: 'flex-start' }}>
            <Summary total={total} />
            <Box sx={{ mt: 1 }}>
              <ExpenseForm onAdd={addExpense} categories={categories} />
            </Box>
          </Box>
        </Grid>
        {/* Main: Filter + List */}
        <Grid item xs={12} md={9} sx={{ minWidth: 0, minHeight: { xs: 'auto', md: '80vh' }, display: 'flex' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2.5 }, bgcolor: '#fff', borderRadius: 4, width: '100%', boxShadow: 2, p: { xs: 1.5, md: 3 } }}>
            <Box sx={{ maxWidth: { xs: '100%', md: 900 }, width: '100%', mb: 2, alignSelf: 'center' }}>
              <FilterBar filter={filter} setFilter={setFilter} categories={categories} />
            </Box>
            <ExportData expenses={filteredExpenses} onImport={handleImport} />
            <PaginationBar
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalCount={totalCount}
            />
            <ExpenseList expenses={paginatedExpenses} onDelete={deleteExpense} onEdit={handleEdit} loading={loading} sort={sort} setSort={setSort} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editExpense, setEditExpense] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [filter, setFilter] = useState({ search: "", category: "", min: "", max: "", from: "", to: "" });
  const [user, setUser] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [darkMode, setDarkMode] = useReactState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [sort, setSort] = useState({ field: 'date', dir: 'desc' });
  const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('primaryColor') || '#1976d2');
  const [error, setError] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Initialize GTM
  useEffect(() => {
    initializeGTM();
  }, []);
  
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: primaryColor },
      background: {
        default: darkMode ? '#181a1b' : '#f9f9f9',
        paper: darkMode ? '#23272f' : '#fff',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  });
  const navigate = useNavigate();
  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem('darkMode', JSON.stringify(!prev));
      return !prev;
    });
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log("Auth state changed:", u ? "User signed in" : "User signed out");
      
      // Track authentication events
      if (u && !user) {
        trackAuth('login', 'firebase');
      } else if (!u && user) {
        trackAuth('logout', 'firebase');
      }
      
      setUser(u);
      setAuthInitialized(true);
      if (!u) {
        // Clear data when user signs out
        setExpenses([]);
        setCategories(DEFAULT_CATEGORIES.map(name => ({ name, id: name, default: true })));
        setLoading(false);
        setError(null);
      }
    }, (error) => {
      console.error("Auth state change error:", error);
      trackError('auth_error', error.message, 'auth_state_change');
      setError("Authentication error. Please try signing in again.");
      setAuthInitialized(true);
    });
    return () => unsub();
  }, [user]);

  const DEFAULT_CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Other"];
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES.map(name => ({ name, id: name, default: true })));

  // Load from Firestore only after user is authenticated
  useEffect(() => {
    if (!authInitialized || !user) {
      if (authInitialized && !user) {
        setLoading(false);
      }
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching data for user:", user.uid);
        
        // Fetch expenses
        const expensesQuery = query(
          collection(db, "expenses"), 
          where("uid", "==", user.uid),
          orderBy("date", "desc")
        );
        const expensesSnapshot = await getDocs(expensesQuery);
        const expensesData = expensesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setExpenses(expensesData);
        console.log("Fetched expenses:", expensesData.length);
        
        // Fetch categories
        const categoriesQuery = query(
          collection(db, "categories"), 
          where("uid", "==", user.uid), 
          orderBy("name")
        );
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoriesData.length ? categoriesData : DEFAULT_CATEGORIES.map(name => ({ name, id: name, default: true })));
        console.log("Fetched categories:", categoriesData.length);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.code === 'permission-denied') {
          setError("Permission denied. Please make sure you're signed in and try again.");
        } else if (err.code === 'unavailable') {
          setError("Service temporarily unavailable. Please try again later.");
        } else {
          setError(`Failed to load data: ${err.message}`);
        }
        // Fallback to default categories if categories fetch fails
        setCategories(DEFAULT_CATEGORIES.map(name => ({ name, id: name, default: true })));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authInitialized]);

  // Add expense to Firestore
  const addExpense = async (expense) => {
    if (!user) return;
    
    try {
      setError(null);
      const expenseData = { 
        ...expense, 
        uid: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log("Adding expense:", expenseData);
      const docRef = await addDoc(collection(db, "expenses"), expenseData);
      const newExpense = { ...expenseData, id: docRef.id };
      
      setExpenses((prev) => [newExpense, ...prev]);
      console.log("Expense added successfully:", newExpense.id);
      
      // Track expense addition
      trackExpense('add', expenseData);
    } catch (err) {
      console.error("Error adding expense:", err);
      trackError('expense_add_error', err.message, 'add_expense');
      if (err.code === 'permission-denied') {
        setError("Permission denied. Please make sure you're signed in and try again.");
      } else {
        setError(`Failed to add expense: ${err.message}`);
      }
    }
  };

  // Delete expense from Firestore
  const deleteExpense = async (id) => {
    try {
      setError(null);
      console.log("Deleting expense:", id);
      
      // Find the expense to track before deletion
      const expenseToDelete = expenses.find(e => e.id === id);
      
      await deleteDoc(doc(db, "expenses", id));
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      console.log("Expense deleted successfully:", id);
      
      // Track expense deletion
      if (expenseToDelete) {
        trackExpense('delete', expenseToDelete);
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
      trackError('expense_delete_error', err.message, 'delete_expense');
      if (err.code === 'permission-denied') {
        setError("Permission denied. Please make sure you're signed in and try again.");
      } else {
        setError(`Failed to delete expense: ${err.message}`);
      }
    }
  };

  // Edit logic
  const handleEdit = (expense) => {
    setEditExpense(expense);
    setEditForm({ ...expense });
  };
  
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  
  const handleEditSave = async () => {
    try {
      setError(null);
      const updatedData = { 
        ...editForm, 
        updatedAt: new Date().toISOString() 
      };
      
      console.log("Updating expense:", editExpense.id, updatedData);
      await updateDoc(doc(db, "expenses", editExpense.id), updatedData);
      setExpenses((prev) => prev.map((e) => (e.id === editExpense.id ? { ...updatedData, id: e.id } : e)));
      setEditExpense(null);
      setEditForm(null);
      console.log("Expense updated successfully:", editExpense.id);
      
      // Track expense edit
      trackExpense('edit', updatedData);
    } catch (err) {
      console.error("Error updating expense:", err);
      trackError('expense_edit_error', err.message, 'edit_expense');
      if (err.code === 'permission-denied') {
        setError("Permission denied. Please make sure you're signed in and try again.");
      } else {
        setError(`Failed to update expense: ${err.message}`);
      }
    }
  };
  
  const handleEditCancel = () => {
    setEditExpense(null);
    setEditForm(null);
  };

  // Filtering logic
  let filteredExpenses = expenses.filter((e) => {
    if (filter.search && !e.description.toLowerCase().includes(filter.search.toLowerCase())) return false;
    if (filter.category && e.category !== filter.category) return false;
    if (filter.min && Number(e.amount) < Number(filter.min)) return false;
    if (filter.max && Number(e.amount) > Number(filter.max)) return false;
    if (filter.from && e.date < filter.from) return false;
    if (filter.to && e.date > filter.to) return false;
    return true;
  });
  
  // Sort by selected field/dir
  filteredExpenses = [...filteredExpenses].sort((a, b) => {
    if (sort.field === 'date') {
      return sort.dir === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
    } else if (sort.field === 'amount') {
      return sort.dir === 'desc' ? Number(b.amount) - Number(a.amount) : Number(a.amount) - Number(b.amount);
    }
    return 0;
  });

  // Pagination logic
  const totalCount = filteredExpenses.length;
  const paginatedExpenses = filteredExpenses.slice((page - 1) * pageSize, page * pageSize);

  const total = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const fetchCategories = async (uid) => {
    try {
      setError(null);
      console.log("Fetching categories for user:", uid);
      const q = query(collection(db, "categories"), where("uid", "==", uid), orderBy("name"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(data.length ? data : DEFAULT_CATEGORIES.map(name => ({ name, id: name, default: true })));
      console.log("Categories fetched successfully:", data.length);
    } catch (err) {
      console.error("Error fetching categories:", err);
      if (err.code === 'permission-denied') {
        setError("Permission denied. Please make sure you're signed in and try again.");
      } else {
        setError(`Failed to load categories: ${err.message}`);
      }
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  // Track errors when they occur
  useEffect(() => {
    if (error) {
      trackError('app_error', error, 'app_component');
    }
  }, [error]);

  // Don't render anything until auth is initialized
  if (!authInitialized) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes
        user={user}
        setUser={setUser}
        showSignIn={showSignIn}
        setShowSignIn={setShowSignIn}
        darkMode={darkMode}
        handleToggleDarkMode={handleToggleDarkMode}
        expenses={expenses}
        editExpense={editExpense}
        editForm={editForm}
        handleEdit={handleEdit}
        handleEditChange={handleEditChange}
        handleEditSave={handleEditSave}
        handleEditCancel={handleEditCancel}
        filteredExpenses={filteredExpenses}
        paginatedExpenses={paginatedExpenses}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalCount={totalCount}
        addExpense={addExpense}
        deleteExpense={deleteExpense}
        loading={loading}
        filter={filter}
        setFilter={setFilter}
        total={total}
        categories={categories}
        onCategoriesChange={() => user && fetchCategories(user.uid)}
        sort={sort}
        setSort={setSort}
        primaryColor={primaryColor}
        setPrimaryColor={setPrimaryColor}
      />
      
      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
