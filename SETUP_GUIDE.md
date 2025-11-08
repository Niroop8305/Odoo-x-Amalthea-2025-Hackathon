# 🚀 Quick Setup Guide - WorkZen HRMS

Follow these steps to get WorkZen up and running on your local machine.

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Backend Dependencies

```powershell
cd backend
npm install
```

### Step 2: Configure Database

1. Open `.env` file in the `backend` folder
2. Update MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=workzen_hrms
```

### Step 3: Initialize Database

```powershell
npm run init-db
```

You should see:
```
✅ Database initialized successfully!
📊 Database: workzen_hrms
📋 Tables created: roles, users, employee_profiles, attendance, leave_types...
```

### Step 4: Start Backend Server

```powershell
npm run dev
```

Backend should now be running on `http://localhost:5000`

### Step 5: Install Frontend Dependencies

Open a **new terminal** window:

```powershell
cd frontend
npm install
```

### Step 6: Start Frontend Server

```powershell
npm run dev
```

Frontend should now be running on `http://localhost:5173`

### Step 7: Access the Application

Open your browser and go to: **http://localhost:5173**

---

## 🎯 First Time Usage

### 1. Create Admin Account

- Click on **"Sign Up"**
- Fill in the form:
  - Company Name: (optional)
  - Name: Your Name
  - Email: admin@company.com
  - Phone: (optional)
  - Password: (minimum 6 characters)
  - Confirm Password: (same as above)
- Click **"SIGN UP"**

### 2. Access Dashboard

After successful registration, you'll be redirected to the dashboard where you can see:
- Your role (Admin)
- Employee code
- User information
- Quick stats

### 3. Test Login/Logout

- Click **"Logout"** button
- You'll be redirected to the login page
- Enter your email and password
- Click **"SIGN IN"**

---

## 🧪 Testing the API

### Test Backend Health

```powershell
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "WorkZen HRMS Backend is running",
  "timestamp": "2025-11-08T..."
}
```

### Test Registration API

```powershell
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"role_name\":\"Employee\",\"first_name\":\"Test User\"}"
```

### Test Login API

```powershell
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

---

## 📊 Database Verification

### Check if database was created:

```sql
SHOW DATABASES;
USE workzen_hrms;
SHOW TABLES;
```

### View default roles:

```sql
SELECT * FROM roles;
```

Should show:
- Admin
- HR Officer
- Payroll Officer
- Employee

### View default leave types:

```sql
SELECT * FROM leave_types;
```

Should show:
- Casual Leave
- Sick Leave
- Earned Leave
- Maternity Leave
- Paternity Leave
- Unpaid Leave

---

## 🔧 Troubleshooting

### Backend won't start

**Issue:** Database connection failed

**Solution:**
1. Make sure MySQL is running
2. Check credentials in `.env` file
3. Ensure MySQL user has proper permissions

```sql
GRANT ALL PRIVILEGES ON workzen_hrms.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Frontend shows blank page

**Issue:** API connection error

**Solution:**
1. Ensure backend is running on port 5000
2. Check browser console for errors
3. Clear browser cache and reload

### Cannot install dependencies

**Issue:** npm install fails

**Solution:**
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

### Port already in use

**Backend (5000):**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Frontend (5173):**
```powershell
# Find process using port 5173
netstat -ano | findstr :5173

# Kill the process
taskkill /PID <PID> /F
```

---

## 📝 Default Users

After running the setup, you can create users with different roles:

### Admin User (Full Access)
- Create via signup page
- Role: Admin
- Can manage all modules

### HR Officer
```sql
-- Create via signup with role_name='HR Officer'
```

### Payroll Officer
```sql
-- Create via signup with role_name='Payroll Officer'
```

### Employee
```sql
-- Create via signup with role_name='Employee'
```

---

## 🎨 UI Preview

### Sign In Page
- Dark theme with purple accents
- Email and password fields
- Password visibility toggle
- Link to sign up page

### Sign Up Page
- Company name (optional)
- Name, email, phone
- Password with confirmation
- Form validation
- Link to sign in page

### Dashboard
- Welcome message
- Role information
- Employee code
- User details table
- Logout button

---

## 🚀 Next Steps

1. ✅ Setup complete! 
2. 📱 Explore the authentication flow
3. 🔍 Check the database schema
4. 📊 Review the API endpoints
5. 🛠️ Start implementing additional modules:
   - Attendance Management
   - Leave Management
   - Payroll Processing
   - Admin Dashboard with Charts

---

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Review backend/README.md for API details
- Review frontend/README.md for UI component details
- Check browser console for frontend errors
- Check terminal output for backend errors

---

**🎉 You're all set! Start building your HRMS!**
