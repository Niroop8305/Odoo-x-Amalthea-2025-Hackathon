# Testing Checklist - Attendance Feature

## Pre-Testing Setup
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] Database migrations applied (`attendance_enhancements.sql`)
- [ ] At least one user account created (employee role)
- [ ] At least one admin/HR account created
- [ ] Sample attendance data inserted

## 1. Authentication & Access

### Employee Login
- [ ] Can login with employee credentials
- [ ] Redirected to appropriate dashboard
- [ ] Can navigate to `/attendance` page
- [ ] No console errors on page load

### Admin/HR Login
- [ ] Can login with admin/HR credentials
- [ ] Can access `/attendance` page
- [ ] Can see all employees' data
- [ ] Proper role permissions working

## 2. UI/UX Testing

### Visual Design
- [ ] Page uses Odoo purple color (#714B67)
- [ ] Dark theme applied correctly
- [ ] Status badges show correct colors:
  - [ ] Present: Green
  - [ ] Absent: Red
  - [ ] On Leave: Blue
  - [ ] Half-Day: Orange
  - [ ] Late: Yellow
- [ ] Headers and titles properly styled
- [ ] Cards have proper shadows and borders
- [ ] Buttons have hover effects

### Layout & Components
- [ ] Page header displays correctly
- [ ] User info shows in top right
- [ ] Date navigation buttons work
- [ ] Date picker displays and functions
- [ ] View toggle buttons (Day/Month) work
- [ ] Active view button highlighted
- [ ] Tables display properly
- [ ] Table headers are sticky on scroll

## 3. Functionality Testing

### Employee View - Month View
- [ ] Default view shows current month
- [ ] Calendar displays all days of month
- [ ] Attendance records populate correctly
- [ ] Days with attendance show:
  - [ ] Check-in time
  - [ ] Check-out time
  - [ ] Work hours
  - [ ] Status badge
- [ ] Days without attendance show as absent/weekend
- [ ] Weekend rows have different background
- [ ] Monthly summary shows correct counts:
  - [ ] Present days
  - [ ] Absent days
  - [ ] Leave days
- [ ] Info note visible at bottom

### Employee View - Day View
- [ ] Can switch to day view
- [ ] Shows attendance for selected day
- [ ] Own attendance record displays
- [ ] Check-in/check-out times correct
- [ ] Work hours calculated correctly
- [ ] Status badge shows correct status

### Admin View - Day View
- [ ] Default view shows current day
- [ ] All employees' attendance visible
- [ ] Table shows:
  - [ ] Employee name
  - [ ] Department
  - [ ] Check-in time
  - [ ] Check-out time
  - [ ] Work hours
  - [ ] Status
- [ ] Can navigate to different days
- [ ] Empty state message for no records

### Admin View - Month View
- [ ] Can switch to month view
- [ ] Shows all employees or filtered employee
- [ ] Monthly calendar displays
- [ ] Summary statistics visible

### Navigation
- [ ] Previous button (←) goes to previous day/month
- [ ] Next button (→) goes to next day/month
- [ ] Date picker allows selecting any date
- [ ] Selected date updates correctly
- [ ] View persists when changing dates

## 4. Data & API Testing

### Data Loading
- [ ] Loading spinner appears while fetching
- [ ] Data loads successfully
- [ ] Error message displays on API failure
- [ ] Empty state message when no data
- [ ] Real-time updates reflect in UI

### API Endpoints
- [ ] `/api/attendance/my-logs` returns employee data
- [ ] `/api/attendance/day` returns daily data (admin)
- [ ] Query parameters work (month, year, date)
- [ ] Authentication headers sent correctly
- [ ] 401 error if not authenticated
- [ ] 403 error if insufficient permissions

### Mark Attendance
- [ ] Can mark attendance via API
- [ ] Check-in time recorded
- [ ] Check-out time recorded
- [ ] Total hours calculated automatically
- [ ] Status set correctly
- [ ] Duplicate entry updates existing record

## 5. Responsive Design Testing

### Desktop (>1024px)
- [ ] Full layout displays
- [ ] All columns visible
- [ ] Navigation controls on same row
- [ ] Proper spacing and margins
- [ ] Summary cards display horizontally

### Tablet (768px-1024px)
- [ ] Layout adjusts appropriately
- [ ] Controls may wrap to multiple rows
- [ ] Table remains readable
- [ ] Summary cards may stack
- [ ] Font sizes appropriate

### Mobile (< 768px)
- [ ] Single column layout
- [ ] Controls stack vertically
- [ ] Table is horizontally scrollable
- [ ] Day column may be hidden
- [ ] Status badges remain visible
- [ ] Font sizes reduced but readable
- [ ] Touch targets large enough

### Extra Small (<480px)
- [ ] Compact view works
- [ ] Essential info visible
- [ ] Navigation still functional
- [ ] No horizontal overflow

## 6. Cross-Browser Testing

### Chrome
- [ ] Page loads correctly
- [ ] All features work
- [ ] Styles applied properly
- [ ] Date picker functions

### Firefox
- [ ] Page loads correctly
- [ ] All features work
- [ ] Styles applied properly
- [ ] Date picker functions

### Edge
- [ ] Page loads correctly
- [ ] All features work
- [ ] Styles applied properly
- [ ] Date picker functions

### Safari (if available)
- [ ] Page loads correctly
- [ ] All features work
- [ ] Styles applied properly
- [ ] Date picker functions

## 7. Performance Testing

### Load Time
- [ ] Page loads in < 2 seconds
- [ ] Initial render is fast
- [ ] No layout shift during load
- [ ] Images/assets load efficiently

### Data Operations
- [ ] Data fetching is fast (< 1 second)
- [ ] No lag when switching views
- [ ] Date navigation is smooth
- [ ] Table scrolling is smooth

### Memory
- [ ] No memory leaks on prolonged use
- [ ] Browser doesn't slow down
- [ ] Can navigate multiple times without issues

## 8. Integration Testing

### With Payroll System
- [ ] Attendance data available to payroll
- [ ] Payable days calculated correctly
- [ ] Present days counted properly
- [ ] Half-days counted as 0.5
- [ ] Late days counted as full day
- [ ] Absent days reduce payable days

### With Leave System
- [ ] Approved paid leaves counted in payable days
- [ ] Unpaid leaves reduce payable days
- [ ] Leave status shows in attendance
- [ ] Leave days don't show as absent

### With User Management
- [ ] Role-based access enforced
- [ ] User permissions respected
- [ ] Department filtering works (if implemented)
- [ ] Employee data linked correctly

## 9. Edge Cases & Error Handling

### Data Scenarios
- [ ] Empty attendance records handled
- [ ] Future dates handled appropriately
- [ ] Past dates accessible
- [ ] Month with no attendance shows correctly
- [ ] Partial attendance data displays

### Error Scenarios
- [ ] Network error handled gracefully
- [ ] Invalid token redirects to login
- [ ] Missing data shows friendly message
- [ ] API timeout handled
- [ ] Server error (500) shows error message

### Special Cases
- [ ] Leap year February handled
- [ ] Month-end dates work correctly
- [ ] Timezone considerations
- [ ] Daylight saving time dates

## 10. Security Testing

### Authentication
- [ ] Cannot access without login
- [ ] JWT token required for API calls
- [ ] Token expiry handled
- [ ] Logout works properly

### Authorization
- [ ] Employees can't see others' data
- [ ] Admin can see all employees
- [ ] Role checks enforced on backend
- [ ] No unauthorized API access

### Data Security
- [ ] No sensitive data in URL
- [ ] No SQL injection possible
- [ ] XSS protection in place
- [ ] CSRF tokens if applicable

## 11. Accessibility Testing

### Screen Reader
- [ ] Page structure semantic
- [ ] ARIA labels present where needed
- [ ] Focus order logical
- [ ] Alt text for icons (if any)

### Keyboard Navigation
- [ ] Can tab through all controls
- [ ] Enter key works on buttons
- [ ] Date picker keyboard accessible
- [ ] Focus visible on interactive elements

### Color Contrast
- [ ] Text readable against backgrounds
- [ ] Status badges have sufficient contrast
- [ ] Links distinguishable
- [ ] Focus indicators visible

## 12. Print Testing
- [ ] Print stylesheet applied
- [ ] Controls hidden in print
- [ ] Tables formatted for printing
- [ ] Page breaks appropriate
- [ ] Headers/footers correct

## Post-Testing

### Documentation
- [ ] README updated with attendance info
- [ ] API documentation complete
- [ ] User guide created
- [ ] Technical docs updated

### Code Quality
- [ ] No console errors
- [ ] No console warnings
- [ ] Code properly formatted
- [ ] Comments added where needed
- [ ] No unused imports
- [ ] No dead code

### Deployment Readiness
- [ ] Environment variables configured
- [ ] Database migrations documented
- [ ] Dependencies listed correctly
- [ ] Build process works
- [ ] Production config ready

## Bug Tracking

### Critical Issues Found
1. _____________________________________
2. _____________________________________
3. _____________________________________

### Minor Issues Found
1. _____________________________________
2. _____________________________________
3. _____________________________________

### Enhancement Suggestions
1. _____________________________________
2. _____________________________________
3. _____________________________________

---

## Sign-off

**Tested By**: _____________________
**Date**: _____________________
**Environment**: Development / Staging / Production
**Status**: ⭕ Pass / ❌ Fail / ⚠️ Conditional Pass

**Notes**:
_________________________________________
_________________________________________
_________________________________________

---

**Overall Status**: 
- [ ] All critical tests passed
- [ ] All major features working
- [ ] No blocking issues
- [ ] Ready for next phase
