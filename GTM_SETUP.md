# Google Tag Manager Setup Guide

This guide explains how to set up and use Google Tag Manager (GTM) with your expense tracker application.

## Setup Instructions

### 1. Get Your GTM Container ID

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new container or use an existing one
3. Copy your Container ID (format: `GTM-XXXXXXX`)

### 2. Update the GTM Container ID

Replace `GTM-XXXXXXX` in the following files with your actual Container ID:

- `public/index.html` (lines 33 and 40)
- Update both the script tag in the `<head>` and the noscript iframe in the `<body>`

### 3. Verify Installation

1. Start your development server: `npm start`
2. Open your browser's Developer Tools
3. Go to the Console tab
4. Look for GTM-related messages or check the Network tab for requests to `googletagmanager.com`

## Tracked Events

The application automatically tracks the following events:

### Authentication Events
- **Login**: When a user signs in
- **Logout**: When a user signs out

### Expense Events
- **Add**: When a new expense is created
- **Edit**: When an expense is updated
- **Delete**: When an expense is removed

### Error Events
- **Auth Errors**: Authentication-related errors
- **Expense Errors**: Errors during expense operations
- **App Errors**: General application errors

## Custom Event Tracking

You can also track custom events using the GTM utility functions:

```javascript
import { trackCustomEvent, trackUIInteraction } from './utils/gtm';

// Track custom events
trackCustomEvent('button_click', {
  button_name: 'export_data',
  page: 'expenses'
});

// Track UI interactions
trackUIInteraction('filter_bar', 'search', {
  search_term: 'food',
  results_count: 15
});
```

## Available GTM Functions

- `trackPageView(pagePath, pageTitle)` - Track page views
- `trackAuth(action, method)` - Track authentication events
- `trackExpense(action, expenseData)` - Track expense-related events
- `trackCategory(action, categoryName)` - Track category management
- `trackFilter(filterData)` - Track filter/search usage
- `trackDataExport(action, format, recordCount)` - Track data export/import
- `trackUIInteraction(element, action, additionalData)` - Track UI interactions
- `trackError(errorType, errorMessage, errorLocation)` - Track errors
- `trackCustomEvent(eventName, eventData)` - Track custom events

## GTM Configuration

In your GTM container, you can set up triggers and tags to respond to these events:

### Recommended Triggers
- **Custom Event**: `auth_event` for login/logout tracking
- **Custom Event**: `expense_event` for expense operations
- **Custom Event**: `error_event` for error tracking

### Recommended Tags
- **Google Analytics 4**: For comprehensive analytics
- **Google Ads Conversion**: For conversion tracking
- **Facebook Pixel**: For social media tracking

## Testing

To test your GTM setup:

1. Use GTM Preview mode
2. Check the dataLayer in browser console: `window.dataLayer`
3. Verify events are firing in GTM debug console
4. Test in production environment

## Privacy Considerations

- Ensure compliance with GDPR, CCPA, and other privacy regulations
- Consider implementing cookie consent management
- Review data collection practices and user consent requirements

## Troubleshooting

### Common Issues

1. **GTM not loading**: Check container ID and network connectivity
2. **Events not firing**: Verify GTM utility functions are imported correctly
3. **Data not appearing**: Check GTM container configuration and publishing status

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify GTM container is published
3. Use GTM Preview mode for debugging
4. Check network requests to GTM endpoints
