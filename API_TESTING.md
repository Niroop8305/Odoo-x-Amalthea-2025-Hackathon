# 🧪 WorkZen HRMS - API Testing Guide

Complete guide for testing all API endpoints using cURL and examples.

---

## Base URL

```
http://localhost:5000/api
```

---

## 1. Health Check

### Check if server is running

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "WorkZen HRMS Backend is running",
  "timestamp": "2025-11-08T10:30:00.000Z"
}
```

---

## 2. Authentication Endpoints

### 2.1 Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"admin@workzen.com\",
    \"password\": \"Admin@123\",
    \"role_name\": \"Admin\",
    \"company_name\": \"TechCorp Solutions\",
    \"first_name\": \"John\",
    \"last_name\": \"Doe\",
    \"phone\": \"+91-9876543210\"
  }"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": 1,
    "email": "admin@workzen.com",
    "role": "Admin",
    "employee_code": "EMP00001",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2.2 Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"admin@workzen.com\",
    \"password\": \"Admin@123\"
  }"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": 1,
    "email": "admin@workzen.com",
    "role": "Admin",
    "profile": {
      "employee_code": "EMP00001",
      "company_name": "TechCorp Solutions",
      "full_name": "John Doe",
      "phone": "+91-9876543210",
      "department": null,
      "designation": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2.3 Get Current User

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "email": "admin@workzen.com",
    "role": "Admin",
    "is_active": true,
    "last_login": "2025-11-08T10:30:00.000Z",
    "profile": {
      "employee_code": "EMP00001",
      "company_name": "TechCorp Solutions",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+91-9876543210"
    }
  }
}
```

### 2.4 Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 3. User Management

### 3.1 Get All Users (Admin/HR only)

```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3.2 Get User Profile

```bash
curl -X GET http://localhost:5000/api/users/profile/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3.3 Update User Profile

```bash
curl -X PUT http://localhost:5000/api/users/profile/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"phone\": \"+91-9876543211\",
    \"department\": \"IT\",
    \"designation\": \"System Administrator\",
    \"city\": \"Mumbai\",
    \"state\": \"Maharashtra\"
  }"
```

### 3.4 Update User Status (Admin only)

```bash
curl -X PUT http://localhost:5000/api/users/1/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"is_active\": false
  }"
```

---

## 4. Attendance Management

### 4.1 Mark Attendance (Check-in)

```bash
curl -X POST http://localhost:5000/api/attendance/mark \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"attendance_date\": \"2025-11-08\",
    \"check_in_time\": \"09:00:00\",
    \"status\": \"Present\"
  }"
```

### 4.2 Mark Attendance (Check-out)

```bash
curl -X POST http://localhost:5000/api/attendance/mark \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"attendance_date\": \"2025-11-08\",
    \"check_out_time\": \"18:00:00\"
  }"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully"
}
```

### 4.3 Get My Attendance Logs

```bash
# All logs
curl -X GET http://localhost:5000/api/attendance/my-logs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by month and year
curl -X GET "http://localhost:5000/api/attendance/my-logs?month=11&year=2025" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "attendance_id": 1,
      "user_id": 1,
      "attendance_date": "2025-11-08",
      "check_in_time": "09:00:00",
      "check_out_time": "18:00:00",
      "total_hours": 9.0,
      "status": "Present",
      "remarks": null
    }
  ]
}
```

### 4.4 Get All Attendance (Admin/HR only)

```bash
curl -X GET "http://localhost:5000/api/attendance/all?month=11&year=2025" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4.5 Get Monthly Summary

```bash
curl -X GET "http://localhost:5000/api/attendance/summary?month=11&year=2025" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "year": 2025,
    "month": 11,
    "total_days": 20,
    "present_days": 18,
    "absent_days": 1,
    "half_days": 0.5,
    "late_days": 2,
    "leave_days": 1,
    "total_hours_worked": 162.0
  }
}
```

---

## 5. Leave Management

### 5.1 Get Leave Types

```bash
curl -X GET http://localhost:5000/api/leave/types \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "leave_type_id": 1,
      "leave_type_name": "Casual Leave",
      "description": "Short-term personal leave",
      "default_days_per_year": 12,
      "is_paid": true,
      "requires_approval": true
    },
    {
      "leave_type_id": 2,
      "leave_type_name": "Sick Leave",
      "description": "Medical or health-related leave",
      "default_days_per_year": 10,
      "is_paid": true,
      "requires_approval": true
    }
  ]
}
```

### 5.2 Apply for Leave

```bash
curl -X POST http://localhost:5000/api/leave/apply \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"leave_type_id\": 1,
    \"start_date\": \"2025-11-15\",
    \"end_date\": \"2025-11-16\",
    \"total_days\": 2,
    \"reason\": \"Personal work - family event\"
  }"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Leave application submitted successfully",
  "data": {
    "leave_id": 1
  }
}
```

### 5.3 Get My Leave Applications

```bash
# All leaves
curl -X GET http://localhost:5000/api/leave/my-leaves \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by status
curl -X GET "http://localhost:5000/api/leave/my-leaves?status=Pending" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "leave_id": 1,
      "user_id": 1,
      "leave_type_id": 1,
      "leave_type_name": "Casual Leave",
      "is_paid": true,
      "start_date": "2025-11-15",
      "end_date": "2025-11-16",
      "total_days": 2,
      "reason": "Personal work - family event",
      "status": "Pending",
      "applied_date": "2025-11-08T10:30:00.000Z"
    }
  ]
}
```

### 5.4 Get All Leave Applications (Admin/HR only)

```bash
curl -X GET "http://localhost:5000/api/leave/all?status=Pending" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5.5 Approve Leave (Admin/HR only)

```bash
curl -X PUT http://localhost:5000/api/leave/1/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"status\": \"Approved\"
  }"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Leave approved successfully"
}
```

### 5.6 Reject Leave (Admin/HR only)

```bash
curl -X PUT http://localhost:5000/api/leave/1/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"status\": \"Rejected\",
    \"rejection_reason\": \"Insufficient staff during requested period\"
  }"
```

### 5.7 Get Leave Balance

```bash
curl -X GET http://localhost:5000/api/leave/balance \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "balance_id": 1,
      "user_id": 1,
      "leave_type_id": 1,
      "leave_type_name": "Casual Leave",
      "is_paid": true,
      "year": 2025,
      "total_allocated": 12,
      "used_days": 2,
      "remaining_days": 10
    }
  ]
}
```

---

## 6. Payroll Management

### 6.1 Get Salary Components (Admin/Payroll Officer)

```bash
curl -X GET http://localhost:5000/api/payroll/components \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "component_id": 1,
      "component_name": "Basic Salary",
      "component_type": "Earning",
      "description": "Base salary component",
      "is_taxable": true,
      "is_active": true
    },
    {
      "component_id": 6,
      "component_name": "Provident Fund",
      "component_type": "Deduction",
      "description": "PF deduction",
      "is_taxable": false,
      "is_active": true
    }
  ]
}
```

### 6.2 Generate Payroll (Admin/Payroll Officer)

```bash
curl -X POST http://localhost:5000/api/payroll/generate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": 1,
    \"month\": 11,
    \"year\": 2025,
    \"working_days\": 22,
    \"present_days\": 20,
    \"leave_days\": 2,
    \"gross_salary\": 80000,
    \"total_deductions\": 8000,
    \"net_salary\": 72000,
    \"payment_status\": \"Pending\",
    \"payment_method\": \"Bank Transfer\",
    \"remarks\": \"November 2025 salary\",
    \"components\": [
      {\"component_id\": 1, \"amount\": 50000},
      {\"component_id\": 2, \"amount\": 20000},
      {\"component_id\": 3, \"amount\": 10000},
      {\"component_id\": 6, \"amount\": 5000},
      {\"component_id\": 8, \"amount\": 3000}
    ]
  }"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Payroll generated successfully",
  "data": {
    "payroll_id": 1
  }
}
```

### 6.3 Get My Payroll

```bash
# All payroll records
curl -X GET http://localhost:5000/api/payroll/my-payroll \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by month and year
curl -X GET "http://localhost:5000/api/payroll/my-payroll?month=11&year=2025" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "payroll_id": 1,
      "user_id": 1,
      "month": 11,
      "year": 2025,
      "working_days": 22,
      "present_days": 20,
      "leave_days": 2,
      "gross_salary": 80000,
      "total_deductions": 8000,
      "net_salary": 72000,
      "payment_date": null,
      "payment_status": "Pending",
      "payment_method": "Bank Transfer",
      "remarks": "November 2025 salary"
    }
  ]
}
```

### 6.4 Get Payslip Details

```bash
curl -X GET http://localhost:5000/api/payroll/payslip/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "payroll": {
      "payroll_id": 1,
      "user_id": 1,
      "employee_name": "John Doe",
      "employee_code": "EMP00001",
      "department": "IT",
      "designation": "System Administrator",
      "month": 11,
      "year": 2025,
      "gross_salary": 80000,
      "total_deductions": 8000,
      "net_salary": 72000,
      "payment_status": "Pending"
    },
    "details": [
      {
        "detail_id": 1,
        "component_id": 1,
        "component_name": "Basic Salary",
        "component_type": "Earning",
        "is_taxable": true,
        "amount": 50000
      },
      {
        "detail_id": 2,
        "component_id": 2,
        "component_name": "House Rent Allowance",
        "component_type": "Earning",
        "is_taxable": true,
        "amount": 20000
      },
      {
        "detail_id": 5,
        "component_id": 6,
        "component_name": "Provident Fund",
        "component_type": "Deduction",
        "is_taxable": false,
        "amount": 5000
      }
    ]
  }
}
```

### 6.5 Get All Payroll (Admin/Payroll Officer)

```bash
curl -X GET "http://localhost:5000/api/payroll/all?month=11&year=2025" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6.6 Update Payroll Status (Admin/Payroll Officer)

```bash
curl -X PUT http://localhost:5000/api/payroll/1/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{
    \"payment_status\": \"Paid\",
    \"payment_date\": \"2025-11-30\"
  }"
```

---

## 7. Dashboard & Analytics

### 7.1 Get Admin Dashboard Stats (Admin/HR only)

```bash
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_employees": 25,
      "total_departments": 5,
      "today_present": 23,
      "pending_leaves": 3
    },
    "monthly_attendance": {
      "total_employees": 25,
      "total_present": 450,
      "total_absent": 10,
      "total_on_leave": 40
    },
    "department_stats": [
      {"department": "IT", "count": 8},
      {"department": "HR", "count": 3},
      {"department": "Finance", "count": 5}
    ],
    "recent_leaves": [
      {
        "leave_id": 1,
        "employee_name": "John Doe",
        "employee_code": "EMP00001",
        "leave_type_name": "Casual Leave",
        "start_date": "2025-11-15",
        "end_date": "2025-11-16",
        "status": "Pending"
      }
    ]
  }
}
```

### 7.2 Get Employee Dashboard Stats

```bash
curl -X GET http://localhost:5000/api/dashboard/my-stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "attendance_summary": {
      "user_id": 1,
      "year": 2025,
      "month": 11,
      "total_days": 20,
      "present_days": 18,
      "absent_days": 1,
      "leave_days": 1,
      "total_hours_worked": 162.0
    },
    "leave_balance": [
      {
        "leave_type_name": "Casual Leave",
        "total_allocated": 12,
        "used_days": 2,
        "remaining_days": 10
      }
    ],
    "pending_leaves": [
      {
        "leave_id": 1,
        "leave_type_name": "Casual Leave",
        "start_date": "2025-11-15",
        "end_date": "2025-11-16",
        "status": "Pending"
      }
    ],
    "recent_payroll": [
      {
        "payroll_id": 1,
        "month": 10,
        "year": 2025,
        "net_salary": 72000,
        "payment_status": "Paid"
      }
    ]
  }
}
```

---

## Testing with Postman

### Import Collection

Create a new Postman collection and add these environment variables:

```json
{
  "base_url": "http://localhost:5000/api",
  "token": "YOUR_JWT_TOKEN"
}
```

### Authorization Setup

For protected routes, add to Headers:
```
Authorization: Bearer {{token}}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized. Please login."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Role 'Employee' is not authorized to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error during login",
  "error": "Database connection failed"
}
```

---

## Testing Workflow

### Complete Test Scenario

```bash
# 1. Register Admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123","role_name":"Admin","first_name":"Admin"}'

# Save the token from response
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Mark attendance
curl -X POST http://localhost:5000/api/attendance/mark \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"attendance_date":"2025-11-08","check_in_time":"09:00:00","status":"Present"}'

# 3. Apply for leave
curl -X POST http://localhost:5000/api/leave/apply \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"leave_type_id":1,"start_date":"2025-11-15","end_date":"2025-11-16","total_days":2,"reason":"Personal"}'

# 4. Get dashboard stats
curl -X GET http://localhost:5000/api/dashboard/my-stats \
  -H "Authorization: Bearer $TOKEN"
```

---

**🎉 Complete API testing guide for WorkZen HRMS!**
