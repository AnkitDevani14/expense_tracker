// Google Tag Manager utility functions
// Replace 'GTM-XXXXXXX' with your actual GTM container ID

/**
 * Push data to Google Tag Manager dataLayer
 * @param {Object} data - Data to push to dataLayer
 */
export const gtmPush = (data) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

/**
 * Track page views
 * @param {string} pagePath - The path of the page
 * @param {string} pageTitle - The title of the page
 */
export const trackPageView = (pagePath, pageTitle) => {
  gtmPush({
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href
  });
};

/**
 * Track user authentication events
 * @param {string} action - 'login' or 'logout'
 * @param {string} method - Authentication method (e.g., 'google', 'email')
 */
export const trackAuth = (action, method = 'unknown') => {
  gtmPush({
    event: 'auth_event',
    auth_action: action,
    auth_method: method
  });
};

/**
 * Track expense-related events
 * @param {string} action - 'add', 'edit', 'delete', 'view'
 * @param {Object} expenseData - Expense data (optional)
 */
export const trackExpense = (action, expenseData = {}) => {
  gtmPush({
    event: 'expense_event',
    expense_action: action,
    expense_category: expenseData.category || 'unknown',
    expense_amount: expenseData.amount || 0,
    expense_date: expenseData.date || new Date().toISOString()
  });
};

/**
 * Track category management events
 * @param {string} action - 'add', 'edit', 'delete'
 * @param {string} categoryName - Name of the category
 */
export const trackCategory = (action, categoryName) => {
  gtmPush({
    event: 'category_event',
    category_action: action,
    category_name: categoryName
  });
};

/**
 * Track filter/search events
 * @param {Object} filterData - Filter criteria used
 */
export const trackFilter = (filterData) => {
  gtmPush({
    event: 'filter_event',
    filter_criteria: filterData
  });
};

/**
 * Track export/import events
 * @param {string} action - 'export' or 'import'
 * @param {string} format - File format (e.g., 'csv', 'json')
 * @param {number} recordCount - Number of records processed
 */
export const trackDataExport = (action, format, recordCount = 0) => {
  gtmPush({
    event: 'data_export_event',
    export_action: action,
    export_format: format,
    record_count: recordCount
  });
};

/**
 * Track UI interaction events
 * @param {string} element - UI element interacted with
 * @param {string} action - Type of interaction
 * @param {Object} additionalData - Additional data to track
 */
export const trackUIInteraction = (element, action, additionalData = {}) => {
  gtmPush({
    event: 'ui_interaction',
    ui_element: element,
    ui_action: action,
    ...additionalData
  });
};

/**
 * Track error events
 * @param {string} errorType - Type of error
 * @param {string} errorMessage - Error message
 * @param {string} errorLocation - Where the error occurred
 */
export const trackError = (errorType, errorMessage, errorLocation) => {
  gtmPush({
    event: 'error_event',
    error_type: errorType,
    error_message: errorMessage,
    error_location: errorLocation
  });
};

/**
 * Track custom events
 * @param {string} eventName - Name of the custom event
 * @param {Object} eventData - Data associated with the event
 */
export const trackCustomEvent = (eventName, eventData = {}) => {
  gtmPush({
    event: eventName,
    ...eventData
  });
};

// Initialize GTM if not already done
export const initializeGTM = () => {
  if (typeof window !== 'undefined' && !window.dataLayer) {
    window.dataLayer = window.dataLayer || [];
  }
};
