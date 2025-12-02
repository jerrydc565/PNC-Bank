# PNC Bank Application - Complete Testing Checklist

## Backend Setup Required (Do This First!)

### 1. Account Number Database Setup

- [ ] Run SQL script to add `account_number` column to users table
- [ ] Generate account numbers for existing users
- [ ] Update User.java entity with accountNumber field
- [ ] Update SignupService.java to generate account numbers
- [ ] Update login endpoint to return accountNumber
- [ ] Add `/api/user/{userId}/account` endpoint
- [ ] Restart Spring Boot application

**See ACCOUNT_NUMBER_SETUP.md for detailed instructions**

### 2. Chat System Database Setup (If not already done)

- [ ] Run SQL script to create chat_messages and chat_sessions tables
- [ ] Add ChatMessage.java and ChatSession.java entities
- [ ] Add repositories, service, and controller
- [ ] Restart Spring Boot application

**See CHAT_DATABASE_SETUP.md for detailed instructions**

---

## Frontend Testing

### Test 1: User Registration Flow

- [ ] Navigate to http://localhost:5173/signup
- [ ] Fill in all fields (First Name, Last Name, Email, Password)
- [ ] Verify password requirements are displayed
- [ ] Click "Sign Up"
- [ ] Verify auto-login after registration
- [ ] Verify redirect to /user-home
- [ ] **Check localStorage for accountNumber** (should be set)

### Test 2: User Login Flow

- [ ] Navigate to http://localhost:5173/login
- [ ] Enter valid credentials
- [ ] Click "Login"
- [ ] Verify successful login
- [ ] Verify redirect to /user-home
- [ ] **Check localStorage for accountNumber** (should be set)
- [ ] Check console for any errors

### Test 3: Dashboard Account Number Display

- [ ] After login, verify you're on /user-home (Dashboard)
- [ ] **Verify account number shows as \*\***XXXX\*\* (last 4 digits of your unique account number)
- [ ] Verify it's NOT showing \*\*\*\*4832 (old hardcoded value)
- [ ] Verify balance is displayed correctly
- [ ] Test hide/show balance toggle
- [ ] Verify account selector shows: "Premium Checking (\*\*\*\*XXXX) - $X,XXX"

### Test 4: Account Page

- [ ] Navigate to Accounts page (click "View All" under accounts)
- [ ] **Verify account number shows as \*\***XXXX** (NOT \*\***4832)
- [ ] Verify balance matches Dashboard
- [ ] Click on account card to go to details

### Test 5: Checking Details Page

- [ ] From Account page, click on Premium Checking
- [ ] **Verify account number shows as \*\***XXXX** (NOT \*\***4832)
- [ ] Verify balance is displayed
- [ ] Test hide/show balance toggle
- [ ] Verify recent transactions are displayed

### Test 6: Payment/Transfer Page

- [ ] Navigate to Payment page
- [ ] **Verify "From Account" shows: Premium Checking \*\***XXXX** (NOT \*\***4832)
- [ ] **Verify balance is displayed correctly** (NOT hardcoded 5289)
- [ ] Test account lookup feature
- [ ] Test transfer form (enter amount, recipient, memo)
- [ ] Submit a transfer and verify pending status

### Test 7: Settings Page

- [ ] Navigate to Settings
- [ ] Go to "Linked Accounts" section
- [ ] **Verify account shows: Premium Checking \*\***XXXX** (NOT \*\***4832)
- [ ] Test profile editing
- [ ] Test notification preferences
- [ ] Test 2FA toggle

### Test 8: Multiple Users Test (Critical!)

- [ ] **Logout from current user**
- [ ] **Create a new user account** (Signup with different email)
- [ ] **Login with new user**
- [ ] **Verify new user has DIFFERENT account number** (\***\*YYYY, NOT \*\***XXXX)
- [ ] **Open Dashboard and verify account number is unique**
- [ ] **Logout and login with first user**
- [ ] **Verify first user still has original account number (\*\***XXXX)\*\*
- [ ] **This confirms each user has their own unique account number!**

### Test 9: Chat System (User Side)

- [ ] Click on chat widget (bottom right)
- [ ] Send a message
- [ ] Verify message appears in chat
- [ ] Keep chat open for 5-10 seconds
- [ ] Verify new messages from admin appear (if admin responds)

### Test 10: Admin Dashboard

- [ ] Logout from user account
- [ ] Navigate to http://localhost:5173/admin/login
- [ ] Login with admin credentials
- [ ] Verify admin dashboard loads
- [ ] Check statistics (total users, transactions, etc.)
- [ ] Verify user list displays

### Test 11: Admin Chat System

- [ ] From admin dashboard, go to Chat section
- [ ] **Verify multiple users appear in Active Chats** (if you sent messages from multiple users)
- [ ] **This should NOT replace users anymore** (old bug is fixed)
- [ ] Select a user chat
- [ ] Verify message history loads
- [ ] Send a reply
- [ ] Verify reply appears

### Test 12: Transaction Approval

- [ ] From admin dashboard, go to Transactions
- [ ] Find pending transactions
- [ ] Approve a transaction
- [ ] Verify transaction status changes
- [ ] Check user balance updates
- [ ] Reject a transaction
- [ ] Verify proper handling

### Test 13: Responsive Design

- [ ] Open browser DevTools (F12)
- [ ] Toggle device toolbar (mobile view)
- [ ] Test all pages on:
  - [ ] Mobile (375px width)
  - [ ] Tablet (768px width)
  - [ ] Desktop (1920px width)
- [ ] Verify Header hamburger menu works on mobile
- [ ] Verify all cards/sections are responsive
- [ ] Verify text is readable on all screen sizes

### Test 14: Navigation & Routing

- [ ] Test all navigation links in Header
- [ ] Test Footer links
- [ ] Test Products dropdown menu
- [ ] Test breadcrumb navigation
- [ ] Verify browser back/forward buttons work
- [ ] Test direct URL access to protected routes

### Test 15: Error Handling

- [ ] Try to access /user-home without logging in (should redirect to login)
- [ ] Try invalid login credentials (should show error)
- [ ] Try to submit transfer with insufficient funds
- [ ] Try to submit form with missing fields
- [ ] Disconnect backend and verify error messages display

### Test 16: Data Persistence

- [ ] Login and create some goals on Dashboard
- [ ] Logout
- [ ] Login again
- [ ] Verify goals are still there
- [ ] Test with scheduled payments
- [ ] Test with notification preferences

### Test 17: Cross-Browser Testing

- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Edge
- [ ] Test on Safari (if available)

---

## Expected Results

### Account Number Generation

✅ Each user should have a **unique 16-digit account number**
✅ Account number format: `YYYYMM` + 8 random digits + 2 check digits
✅ Example: `2025120012345678`
✅ Display format: `****5678` (showing last 4 digits)

### Account Number Locations

The account number should appear (as \*\*\*\*XXXX) in:

1. Dashboard - Account card
2. Dashboard - Account selector dropdown
3. Account page - Premium Checking card
4. Checking Details page - Header
5. Payment page - From Account dropdown
6. Settings page - Linked Accounts section

### Chat System

✅ Multiple users can chat simultaneously
✅ Admin sees all users in Active Chats list
✅ Messages persist across logout/login
✅ Real-time updates via polling

---

## Common Issues & Solutions

### Issue: Account number shows \*\*\*\*----

**Solution:** Backend endpoint `/api/user/{userId}/account` is not working or user doesn't have account number in database. Check ACCOUNT_NUMBER_SETUP.md.

### Issue: Account number still shows \*\*\*\*4832

**Solution:**

1. Clear localStorage in browser DevTools (Application > Local Storage)
2. Logout and login again
3. Verify backend is returning accountNumber in login response

### Issue: Chat shows only one user

**Solution:** Database migration not complete. Follow CHAT_DATABASE_SETUP.md step by step.

### Issue: Balance shows as $1 or wrong amount

**Solution:**

1. Check if balance API is working: `http://localhost:8080/api/transactions/balance`
2. Verify userId is stored correctly in localStorage
3. Check browser console for errors

### Issue: Pages not loading

**Solution:**

1. Verify backend is running on port 8080
2. Verify frontend is running on port 5173
3. Check for CORS errors in console
4. Verify database connection

---

## Test Results Template

Copy this template for your test report:

```
## Test Session Report
Date: _____________
Tester: _____________

### Backend Setup
- [ ] Account number column added to database
- [ ] Account numbers generated for existing users
- [ ] Backend endpoints updated
- [ ] Backend server restarted successfully

### Critical Tests
- [ ] New users get unique account numbers
- [ ] Account numbers persist across login/logout
- [ ] Multiple users have different account numbers
- [ ] Account number displays correctly in all 6 locations
- [ ] Chat system supports multiple users

### Issues Found
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Overall Status
- [ ] All tests passed
- [ ] Minor issues (list above)
- [ ] Critical issues blocking production
```

---

## Performance Benchmarks

Expected performance:

- **Page load time:** < 2 seconds
- **API response time:** < 500ms
- **Transaction submission:** < 1 second
- **Chat message delivery:** < 3 seconds (due to polling)

---

## Security Checklist

- [ ] Passwords are not visible in console logs
- [ ] JWT tokens (if used) are stored securely
- [ ] API endpoints validate user authorization
- [ ] XSS protection in place (React escapes by default)
- [ ] CORS properly configured
- [ ] Sensitive data not exposed in URLs

---

**Ready to test? Start with Backend Setup, then proceed through Frontend Testing in order!**
