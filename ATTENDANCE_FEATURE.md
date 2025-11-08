# Attendance Feature Documentation

## Overview
The attendance feature is a comprehensive system for tracking employee attendance, managing work hours, and calculating payable days for payroll computation.

## Features

### For Employees
- **Month View (Default)**: View day-wise attendance for the ongoing month
- **Day View**: View attendance for a specific day
- **Work Hours Tracking**: See check-in, check-out times and total work hours
- **Status Indicators**: Visual badges for Present, Absent, Late, Half-Day, On Leave
- **Responsive Design**: Clean, modern UI that works on all devices

### For Admin/HR/Payroll Officers
- **Day View (Default)**: See all employees present on the current day
- **Employee Overview**: Department-wise attendance tracking
- **Payroll Integration**: Automatic calculation of payable days
- **Report Generation**: Monthly attendance summaries

## API Endpoints

### Employee Endpoints

#### Mark Attendance
```http
POST /api/attendance/mark
Authorization: Bearer <token>

Request Body:
{
  "attendance_date": "2025-11-08",
  "check_in_time": "09:00:00",
  "check_out_time": "18:00:00",
  "status": "Present"
}
```

#### Get My Attendance
```http
GET /api/attendance/my-logs?month=11&year=2025
Authorization: Bearer <token>
```

#### Get Monthly Summary
```http
GET /api/attendance/summary?month=11&year=2025
Authorization: Bearer <token>
```

### Admin/HR Endpoints

#### Get Attendance by Day
```http
GET /api/attendance/day?date=2025-11-08
Authorization: Bearer <token>
Roles: Admin, HR Officer, Payroll Officer
```

#### Get All Attendance
```http
GET /api/attendance/all?month=11&year=2025&department=IT
Authorization: Bearer <token>
Roles: Admin, HR Officer
```

#### Get Payable Days
```http
GET /api/attendance/payable-days?userId=1&month=11&year=2025
Authorization: Bearer <token>
Roles: Admin, HR Officer, Payroll Officer
```

#### Update Attendance
```http
PUT /api/attendance/:attendanceId
Authorization: Bearer <token>
Roles: Admin, HR Officer

Request Body:
{
  "check_in_time": "09:00:00",
  "check_out_time": "18:00:00",
  "status": "Present",
  "remarks": "Adjusted timing"
}
```

## Payroll Integration

### How It Works

1. **Attendance Tracking**: System records check-in/check-out times daily
2. **Status Classification**:
   - **Present**: Full day attendance (1 day)
   - **Half-Day**: Partial attendance (0.5 days)
   - **Late**: Late but present (1 day)
   - **Absent**: No attendance (0 days)
   - **On Leave**: Leave applied (handled by leave system)

3. **Payable Days Calculation**:
   ```
   Payable Days = Present Days + Half Days + Late Days + Paid Leave Days
   ```

4. **Salary Calculation**:
   ```
   Salary Factor = Payable Days / Working Days in Month
   Net Salary = Gross Salary × Salary Factor - Deductions
   ```

### Example
```
Working Days: 30
Present Days: 25
Half Days: 2 (counted as 1)
Paid Leave: 3
Absent Days: 0

Payable Days = 25 + 1 + 3 = 29 days
Salary Factor = 29/30 = 0.9667
Net Salary = ₹50,000 × 0.9667 - Deductions
```

## Database Schema

### Attendance Table
```sql
CREATE TABLE attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    total_hours DECIMAL(4,2),
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    assigned_hours DECIMAL(4,2) DEFAULT 8.00,
    status ENUM('Present', 'Absent', 'Half-Day', 'Late', 'On Leave'),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_date (user_id, attendance_date)
);
```

### Work Schedules Table
```sql
CREATE TABLE work_schedules (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    day_of_week ENUM('Monday',...'Sunday'),
    work_start_time TIME NOT NULL,
    work_end_time TIME NOT NULL,
    assigned_hours DECIMAL(4,2) DEFAULT 8.00,
    is_working_day BOOLEAN DEFAULT TRUE
);
```

## UI Components

### Colors (Odoo Brand)
- **Primary Purple**: `#714B67`
- **Purple Light**: `#8B5F83`
- **Purple Dark**: `#5A3C52`
- **Gray**: `#878787`
- **Background Dark**: `#0F0F0F`
- **Card Background**: `#1E1E1E`

### Status Colors
- **Present**: Green `#4CAF50`
- **Absent**: Red `#F44336`
- **On Leave**: Blue `#2196F3`
- **Half-Day**: Orange `#FF9800`
- **Late**: Yellow `#FFC107`

## Usage Examples

### Employee: View Monthly Attendance
1. Navigate to `/attendance`
2. Default view shows current month attendance
3. Use date picker to select different months
4. Toggle between Day and Month views

### Admin: Check Daily Attendance
1. Navigate to `/attendance`
2. Default view shows today's attendance for all employees
3. Use navigation arrows to check previous/next days
4. View department-wise breakdowns

### Payroll Officer: Generate Payslip
1. Navigate to Payroll section
2. Select employee and month
3. Click "Generate Payroll"
4. System automatically:
   - Fetches attendance data
   - Calculates payable days
   - Pro-rates salary based on attendance
   - Generates payslip with breakdown

## Business Rules

1. **Unpaid Leave**: Automatically reduces payable days
2. **Half-Day**: Counted as 0.5 days
3. **Late Attendance**: Counted as full day (1.0) but marked as "Late"
4. **Weekend**: Not counted unless specifically marked
5. **Absent Without Leave**: Reduces payable days (0 days)

## Responsive Design

The attendance UI is fully responsive:
- **Desktop (>1024px)**: Full table view with all columns
- **Tablet (768px-1024px)**: Optimized layout with key columns
- **Mobile (<768px)**: Stacked view with essential information
- **Print**: Optimized for printing payslips and reports

## Security

- **Authentication Required**: All endpoints require valid JWT token
- **Role-Based Access**: Privileged operations restricted to Admin/HR/Payroll
- **Data Privacy**: Employees can only view their own attendance
- **Audit Trail**: All attendance modifications are logged

## Testing

### Manual Testing Steps
1. **Mark Attendance**: Use POST /api/attendance/mark
2. **View Records**: Navigate to /attendance page
3. **Generate Payroll**: Create payslip and verify payable days
4. **Check Integration**: Ensure leave data is included in payable days

### Test Scenarios
- ✅ Full month present attendance
- ✅ Mix of present, absent, and leave days
- ✅ Half-day scenarios
- ✅ Late attendance marking
- ✅ Weekend handling
- ✅ Payroll generation with attendance data

## Future Enhancements

1. **Break Tracking**: Add support for lunch/tea breaks
2. **GPS Check-in**: Location-based attendance marking
3. **Shift Management**: Multiple shift support
4. **Overtime Calculation**: Automatic overtime tracking
5. **Mobile App**: Dedicated mobile application
6. **Biometric Integration**: Fingerprint/face recognition
7. **Real-time Dashboard**: Live attendance monitoring
8. **Export Reports**: PDF/Excel export functionality

## Support

For issues or questions:
- Email: support@workzen.com
- Documentation: /docs/attendance
- API Reference: /api-docs
