# User Management Implementation Guide

## Overview
This document describes the implementation of the admin user creation feature and the integration of actual user data in the dashboard.

## Features Implemented

### 1. Admin User Creation
- **Admin-only access**: Only users with Admin role can create new users
- **Random password generation**: 16-character secure passwords using Node.js crypto module
- **Allowed roles**: Employee, HR Manager, Payroll Officer
- **Employee code auto-generation**: Format OIJODO20220001 (OI=company, JODO=initials, 2022=year, 0001=serial)

### 2. Dashboard User Display
- **Real-time data**: Fetches actual users from the database
- **Loading states**: Shows loading indicator while fetching data
- **Empty states**: Displays message when no employees exist
- **Status indicators**: Shows online/offline status based on user activity

## Backend Implementation

### Files Created/Modified:

#### 1. `backend/src/controllers/userController.js` (NEW)
**Purpose**: Handles all user management operations

**Functions**:
- `generateRandomPassword()`: Creates 16-character random passwords
- `createUser()`: Creates new users with validation and security checks
- `getAllUsers()`: Fetches all users with profile information
- `getUserById()`: Retrieves single user details
- `deleteUser()`: Admin-only user deletion with self-deletion prevention

**Key Features**:
- Role validation (only allows Employee, HR Manager, Payroll Officer)
- Admin authorization checks
- Automatic employee code generation
- Password hashing with bcrypt
- Transaction support for user + profile creation

#### 2. `backend/src/routes/userRoutes.js` (UPDATED)
**New Routes**:
```
POST   /api/users/create     - Create new user (Admin only)
GET    /api/users            - Get all users (Admin, HR Manager)
GET    /api/users/:id        - Get user by ID
DELETE /api/users/:id        - Delete user (Admin only)
```

#### 3. `backend/src/models/userModel.js` (UPDATED)
**New Methods**:
- `findAllWithProfiles()`: Joins users, roles, and employee_profiles tables
- `findByIdWithProfile()`: Gets single user with profile data
- `delete()`: Removes user from database

## Frontend Implementation

### Files Created/Modified:

#### 1. `frontend/src/components/CreateUserModal.jsx` (NEW)
**Purpose**: Modal form for creating new users

**Features**:
- Form fields: First Name*, Last Name, Email*, Role*, Phone, Department, Designation, Company Name
- Role dropdown with validation (Employee, HR Manager, Payroll Officer)
- Success message displaying temporary credentials
- Auto-close after 5 seconds on successful creation
- Error handling and validation

**Props**:
- `isOpen`: Boolean to control modal visibility
- `onClose`: Callback when modal closes
- `onUserCreated`: Callback after successful user creation

#### 2. `frontend/src/pages/Dashboard.jsx` (UPDATED)
**Changes**:
- Imported CreateUserModal component
- Added state management for modal and employees
- Implemented `fetchEmployees()` function using axios
- Added `handleUserCreated()` callback to refresh employee list
- Conditional rendering of NEW button (Admin only)
- Updated employee cards to use actual user data
- Added loading and empty state messages

**New Features**:
- Real-time employee data from database
- Automatic refresh after user creation
- Employee code display on cards
- Full name display with fallback to email

#### 3. `frontend/src/styles/App.css` (UPDATED)
**New Styles**:
- `.modal-overlay`: Full-screen overlay with fade-in animation
- `.modal-content`: Centered modal with slide-up animation
- `.modal-header/body/footer`: Modal structure styling
- `.form-row`: Two-column grid layout for form fields
- `.alert-success/error`: Success and error message styling
- `.loading-message/no-data-message`: Empty state styling
- `.employee-code`: Employee code badge styling

## API Endpoints

### Create User
```http
POST http://localhost:5000/api/users/create
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@odoo.in",
  "role_name": "Employee",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Software Developer",
  "company_name": "Odoo India"
}
```

**Response**:
```json
{
  "message": "User created successfully",
  "user": {
    "user_id": 5,
    "email": "john.doe@odoo.in",
    "role_id": 3,
    "employee_code": "OIJODO20250001",
    "temporary_password": "a3f7e9c2b1d4f8e6"
  }
}
```

### Get All Users
```http
GET http://localhost:5000/api/users
Authorization: Bearer <admin_or_hr_token>
```

**Response**:
```json
{
  "users": [
    {
      "user_id": 1,
      "email": "admin@odoo.in",
      "is_active": true,
      "last_login": "2025-01-20T10:30:00.000Z",
      "role_name": "Admin",
      "employee_code": "OIADAD20250001",
      "full_name": "Admin User",
      "phone": "9876543210",
      "department": "Management",
      "designation": "System Administrator",
      "company_name": "Odoo India"
    }
  ]
}
```

## Security Features

1. **Authorization Checks**: 
   - Only Admin users can create/delete users
   - Admin and HR Manager can view all users
   - Regular users can only view their own profile

2. **Password Security**:
   - Random 16-character passwords using crypto.randomBytes
   - Passwords hashed with bcrypt (10 salt rounds)
   - Temporary password returned in response (should be noted/emailed)

3. **Self-Deletion Prevention**:
   - Admin cannot delete their own account
   - Prevents accidental lockout scenarios

4. **Role Validation**:
   - Only specific roles can be assigned (Employee, HR Manager, Payroll Officer)
   - Admin role cannot be created through this endpoint

## Testing the Implementation

### Step 1: Start Backend Server
```bash
cd backend
npm install
npm run dev
```
Server should start on: http://localhost:5000

### Step 2: Start Frontend Server
```bash
cd frontend
npm install
npm run dev
```
Frontend should start on: http://localhost:5173

### Step 3: Login as Admin
- Navigate to http://localhost:5173/login
- Login with admin credentials
- You should see the dashboard with NEW button

### Step 4: Create a User
1. Click the NEW button (visible only to Admin)
2. Fill in the form:
   - First Name: Required
   - Email: Required (must be valid format)
   - Role: Required (dropdown selection)
   - Other fields: Optional
3. Click "Create User"
4. Success message will display with temporary credentials
5. Save the temporary password (email functionality to be implemented)
6. Modal auto-closes after 5 seconds
7. Dashboard refreshes to show new user

### Step 5: Verify User Creation
- New user card should appear in the employee grid
- Card should show full name and employee code
- Status indicator should show (based on is_active field)

## Known Limitations & Future Enhancements

### Current Limitations:
1. **Email Notification**: Skipped as per requirement - temporary password shown in modal only
2. **Status Calculation**: Currently uses is_active field; should integrate with attendance API
3. **Profile Pictures**: Not yet implemented - using SVG placeholders
4. **User Editing**: Edit functionality not yet implemented
5. **Bulk Operations**: No bulk user creation/deletion

### Planned Enhancements:
1. Email integration for sending credentials
2. Password reset functionality
3. User profile editing
4. Bulk user import via CSV
5. Advanced user search and filtering
6. Activity status from attendance system
7. Role-based dashboard customization
8. User deactivation (soft delete) instead of hard delete

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── userController.js      (NEW - User CRUD operations)
│   ├── models/
│   │   └── userModel.js           (UPDATED - New query methods)
│   └── routes/
│       └── userRoutes.js          (UPDATED - New endpoints)

frontend/
├── src/
│   ├── components/
│   │   └── CreateUserModal.jsx   (NEW - User creation modal)
│   ├── pages/
│   │   └── Dashboard.jsx         (UPDATED - API integration)
│   └── styles/
│       └── App.css               (UPDATED - Modal styles)
```

## Troubleshooting

### Modal doesn't open when clicking NEW button
- Check if user is logged in as Admin
- Verify `showCreateUserModal` state is being updated
- Check browser console for errors

### Users not displaying on dashboard
- Check browser Network tab for API call to `/api/users`
- Verify token is being sent in Authorization header
- Check backend console for errors
- Ensure database has users with employee_profiles

### Error creating user
- Check if all required fields are filled
- Verify email format is valid
- Check if role is one of: Employee, HR Manager, Payroll Officer
- View backend console for detailed error messages

### NEW button not visible
- Verify logged-in user has Admin role
- Check `user?.roleName === 'Admin'` condition in Dashboard.jsx

## Database Schema Reference

### users table
```sql
user_id (PK), email, password_hash, role_id (FK), is_active, last_login, created_at, updated_at
```

### employee_profiles table
```sql
profile_id (PK), user_id (FK), employee_code, company_name, first_name, last_name,
phone, department, designation, date_of_joining, date_of_birth, gender, address,
city, state, country, postal_code, emergency_contact_name, emergency_contact_phone,
created_at, updated_at
```

### roles table
```sql
role_id (PK), role_name
```

## Contact & Support

For issues or questions regarding this implementation:
- Check error logs in both backend and frontend consoles
- Review API responses in browser Network tab
- Verify database table structures and data
- Ensure all dependencies are installed
