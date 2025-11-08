-- =====================================================
-- Attendance Enhancements
-- Add breaks tracking and work schedule
-- =====================================================

USE workzen_hrms;

-- Create breaks table to track break times
CREATE TABLE IF NOT EXISTS attendance_breaks (
    break_id INT PRIMARY KEY AUTO_INCREMENT,
    attendance_id INT NOT NULL,
    break_start TIME NOT NULL,
    break_end TIME,
    break_duration INT, -- in minutes
    break_type ENUM('Lunch', 'Tea', 'Other') DEFAULT 'Other',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (attendance_id) REFERENCES attendance(attendance_id) ON DELETE CASCADE,
    INDEX idx_attendance_id (attendance_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create work schedule table to define assigned work hours
CREATE TABLE IF NOT EXISTS work_schedules (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    work_start_time TIME NOT NULL,
    work_end_time TIME NOT NULL,
    assigned_hours DECIMAL(4,2) DEFAULT 8.00,
    is_working_day BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_day (user_id, day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add overtime tracking
ALTER TABLE attendance 
ADD COLUMN IF NOT EXISTS overtime_hours DECIMAL(4,2) DEFAULT 0 AFTER total_hours,
ADD COLUMN IF NOT EXISTS assigned_hours DECIMAL(4,2) DEFAULT 8.00 AFTER overtime_hours;

-- Update view for monthly attendance to include overtime
DROP VIEW IF EXISTS view_monthly_attendance;
CREATE VIEW view_monthly_attendance AS
SELECT 
    user_id,
    YEAR(attendance_date) AS year,
    MONTH(attendance_date) AS month,
    COUNT(*) AS total_days,
    SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) AS present_days,
    SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) AS absent_days,
    SUM(CASE WHEN status = 'Half-Day' THEN 0.5 ELSE 0 END) AS half_days,
    SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) AS late_days,
    SUM(CASE WHEN status = 'On Leave' THEN 1 ELSE 0 END) AS leave_days,
    SUM(total_hours) AS total_hours_worked,
    SUM(overtime_hours) AS total_overtime_hours
FROM attendance
GROUP BY user_id, YEAR(attendance_date), MONTH(attendance_date);

-- Create stored procedure to calculate payable days
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_calculate_payable_days$$

CREATE PROCEDURE sp_calculate_payable_days(
    IN p_user_id INT,
    IN p_month INT,
    IN p_year INT,
    OUT p_payable_days DECIMAL(5,2)
)
BEGIN
    DECLARE v_present_days DECIMAL(5,2);
    DECLARE v_paid_leave_days DECIMAL(5,2);
    
    -- Calculate present days (including half days and late attendance)
    SELECT 
        COALESCE(SUM(CASE 
            WHEN status = 'Present' THEN 1 
            WHEN status = 'Half-Day' THEN 0.5 
            WHEN status = 'Late' THEN 1
            ELSE 0 
        END), 0)
    INTO v_present_days
    FROM attendance 
    WHERE user_id = p_user_id 
    AND MONTH(attendance_date) = p_month 
    AND YEAR(attendance_date) = p_year;
    
    -- Calculate paid leave days
    SELECT COALESCE(SUM(la.total_days), 0)
    INTO v_paid_leave_days
    FROM leave_applications la
    INNER JOIN leave_types lt ON la.leave_type_id = lt.leave_type_id
    WHERE la.user_id = p_user_id 
    AND la.status = 'Approved'
    AND lt.is_paid = TRUE
    AND ((MONTH(la.start_date) = p_month AND YEAR(la.start_date) = p_year)
         OR (MONTH(la.end_date) = p_month AND YEAR(la.end_date) = p_year));
    
    -- Calculate total payable days
    SET p_payable_days = v_present_days + v_paid_leave_days;
END$$

DELIMITER ;

-- Create view for attendance with employee details
DROP VIEW IF EXISTS view_attendance_details;
CREATE VIEW view_attendance_details AS
SELECT 
    a.attendance_id,
    a.user_id,
    a.attendance_date,
    a.check_in_time,
    a.check_out_time,
    a.total_hours,
    a.overtime_hours,
    a.assigned_hours,
    a.status,
    a.remarks,
    CONCAT(ep.first_name, ' ', COALESCE(ep.last_name, '')) AS employee_name,
    ep.employee_code,
    ep.department,
    ep.designation,
    u.email,
    r.role_name
FROM attendance a
INNER JOIN users u ON a.user_id = u.user_id
INNER JOIN roles r ON u.role_id = r.role_id
LEFT JOIN employee_profiles ep ON u.user_id = ep.user_id;

-- =====================================================
-- END OF ATTENDANCE ENHANCEMENTS
-- =====================================================
