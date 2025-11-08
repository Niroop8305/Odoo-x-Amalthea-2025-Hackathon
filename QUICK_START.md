# Quick Start Guide - Attendance Feature

## Prerequisites
- MySQL database running
- Node.js installed
- Backend and frontend servers set up

## Step-by-Step Setup

### 1. Database Setup

Run the attendance enhancements SQL file:

```bash
# Windows (PowerShell)
Get-Content backend\src\database\attendance_enhancements.sql | mysql -u root -p workzen_hrms

# Or using MySQL command line
mysql -u root -p workzen_hrms
source backend/src/database/attendance_enhancements.sql
```

### 2. Install Dependencies (if not already done)

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Start the Servers

**Backend** (Terminal 1):
```bash
cd backend
npm start
```
Server will run on: http://localhost:5000

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```
App will run on: http://localhost:5173

### 4. Test the Attendance Feature

1. **Login** to the application
   - Navigate to: http://localhost:5173
   - Use your credentials

2. **Access Attendance Page**
   - Click on the menu or navigate to: http://localhost:5173/attendance
   
3. **For Employees**:
   - You'll see your monthly attendance by default
   - Toggle to "Day View" to see specific days
   - Use date picker to navigate months

4. **For Admin/HR/Payroll Officers**:
   - You'll see all employees' attendance for today by default
   - Toggle to "Month View" to see specific employee's monthly data
   - Use filters to find specific employees or departments

## Features to Test

### ✅ Basic Attendance Viewing
- [ ] View monthly attendance (employees)
- [ ] View daily attendance (admin)
- [ ] Navigate between dates
- [ ] Toggle between day and month views

### ✅ Data Display
- [ ] Check-in and check-out times displayed
- [ ] Work hours calculated correctly
- [ ] Status badges showing correct colors
- [ ] Employee information visible (for admin)

### ✅ Responsive Design
- [ ] Resize browser window
- [ ] Check mobile view (< 768px)
- [ ] Check tablet view (768px - 1024px)
- [ ] Check desktop view (> 1024px)

### ✅ API Integration
- [ ] Data loads from backend
- [ ] Loading spinner appears during fetch
- [ ] Error messages display if API fails
- [ ] Real-time data updates

## Sample API Calls for Testing

### Mark Attendance (Use Postman or curl)

```bash
# Mark attendance for today
curl -X POST http://localhost:5000/api/attendance/mark \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "attendance_date": "2025-11-08",
    "check_in_time": "09:00:00",
    "check_out_time": "18:00:00",
    "status": "Present"
  }'
```

### Get My Attendance

```bash
curl -X GET "http://localhost:5000/api/attendance/my-logs?month=11&year=2025" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Daily Attendance (Admin)

```bash
curl -X GET "http://localhost:5000/api/attendance/day?date=2025-11-08" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### Issue: "Page Not Found" (404)
**Solution**: Clear browser cache and refresh. The route `/attendance` is now registered.

### Issue: "Cannot read properties of undefined"
**Solution**: Ensure user is logged in and JWT token is valid.

### Issue: "No attendance records"
**Solution**: Mark some attendance first using the API or create test data in the database.

### Issue: Styles not loading
**Solution**: 
1. Check that `Attendance.css` exists in `frontend/src/styles/`
2. Restart the frontend dev server
3. Clear browser cache

### Issue: API errors
**Solution**:
1. Check backend is running on port 5000
2. Verify database connection
3. Check browser console for specific error messages
4. Verify JWT token is being sent in headers

## Creating Test Data

### Add Sample Attendance Records

```sql
-- Login to MySQL
mysql -u root -p workzen_hrms

-- Insert sample attendance
INSERT INTO attendance (user_id, attendance_date, check_in_time, check_out_time, total_hours, status)
VALUES
  (1, '2025-11-01', '09:00:00', '18:00:00', 8.5, 'Present'),
  (1, '2025-11-02', '09:15:00', '18:00:00', 8.25, 'Late'),
  (1, '2025-11-03', '09:00:00', '14:00:00', 4.5, 'Half-Day'),
  (1, '2025-11-04', '09:00:00', '18:00:00', 8.5, 'Present'),
  (1, '2025-11-05', '09:00:00', '18:00:00', 8.5, 'Present'),
  (1, '2025-11-08', '09:00:00', '18:00:00', 8.5, 'Present');

-- Verify
SELECT * FROM attendance WHERE user_id = 1 ORDER BY attendance_date DESC;
```

## Expected Behavior

### Employee View (Month)
- Calendar-like view showing all days of the month
- Days with attendance show check-in/check-out times
- Days without attendance show as "Absent" or "Weekend"
- Color-coded status badges
- Summary showing present/absent/leave counts

### Admin View (Day)
- Table showing all employees present today
- Columns: Employee Name, Department, Check-in, Check-out, Work Hours, Status
- Can navigate to different days
- Can filter by department (if implemented)

## Next Steps

1. **Mark Attendance**: Create attendance records for testing
2. **Generate Payroll**: Test payroll generation with attendance data
3. **Customize**: Adjust colors or layout as needed
4. **Add Features**: Implement break tracking or GPS check-in
5. **Deploy**: Move to production environment

## Support

If you encounter any issues:
1. Check the `IMPLEMENTATION_SUMMARY.md` for detailed information
2. Review `ATTENDANCE_FEATURE.md` for API documentation
3. Check browser console for JavaScript errors
4. Review backend logs for API errors
5. Verify database schema is up to date

## Success Indicators

✅ Attendance page loads without errors
✅ Data displays correctly for your role
✅ Navigation works (date picker, view toggle)
✅ Responsive design works on mobile
✅ API calls return data successfully
✅ Status badges show correct colors
✅ Loading states appear during data fetch

---

**Ready to go!** 🚀 Your attendance feature is now fully functional with a clean, responsive UI using Odoo brand colors!
