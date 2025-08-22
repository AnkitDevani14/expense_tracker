# Firebase Setup Guide

This guide will help you set up Firebase for the Expense Tracker application and resolve any permission issues.

## Prerequisites

1. **Firebase CLI**: Install globally using npm
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Account**: Make sure you have a Firebase account and access to the project

## Project Configuration

The Firebase project is already configured with the following details:
- **Project ID**: `expense-tracker-001-18b7f`
- **Project Name**: `expense-tracker-001`

## Security Rules

The application uses the following Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own expenses
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
    
    // Allow users to read and write their own categories
    match /categories/{categoryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Deployment Steps

### 1. Login to Firebase
```bash
firebase login --no-localhost
```

### 2. Set Active Project
```bash
firebase use expense-tracker-001-18b7f
```

### 3. Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

### 4. Deploy Indexes
```bash
firebase deploy --only firestore:indexes
```

## Resolving Permission Issues

If you encounter "Missing or insufficient permissions" errors:

### 1. Check Authentication State
- Ensure the user is properly signed in before accessing Firestore
- The app now waits for authentication to be fully initialized before making any Firestore calls

### 2. Verify Security Rules
- Make sure the security rules are deployed to Firebase
- Rules require users to be authenticated and can only access their own data

### 3. Check User ID
- All Firestore operations include the user's UID
- Data is filtered by `uid` field to ensure users only see their own data

### 4. Console Logging
- The app now includes comprehensive logging for debugging
- Check the browser console for detailed error information

## Testing Firebase Connection

You can test the Firebase connection using the provided test script:

```bash
node test-firebase.js
```

## Common Issues and Solutions

### Issue: "Permission denied" errors
**Solution**: Ensure the user is authenticated and the security rules are deployed

### Issue: "Service unavailable" errors
**Solution**: Check your internet connection and Firebase service status

### Issue: Data not loading
**Solution**: Verify that the user is signed in and check the browser console for errors

## Security Features

1. **User Isolation**: Each user can only access their own data
2. **Authentication Required**: All operations require valid authentication
3. **Field Validation**: Data includes timestamps and user IDs for security
4. **Error Handling**: Comprehensive error handling with user-friendly messages

## Monitoring

- Check the Firebase Console for usage statistics
- Monitor security rules in the Firestore Rules section
- Review authentication logs in the Authentication section

## Support

If you continue to experience issues:
1. Check the browser console for detailed error messages
2. Verify Firebase project configuration
3. Ensure all security rules are properly deployed
4. Check that the user is authenticated before accessing data
