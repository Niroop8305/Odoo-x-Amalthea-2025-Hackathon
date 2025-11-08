import pool from '../config/database.js';

// Mark attendance (Check-in/Check-out)
export const markAttendance = async (req, res) => {
  try {
    const { attendance_date, check_in_time, check_out_time, status } = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!attendance_date) {
      return res.status(400).json({
        success: false,
        message: 'Attendance date is required'
      });
    }

    // Calculate total hours if both check-in and check-out are provided
    let totalHours = null;
    if (check_in_time && check_out_time) {
      const checkIn = new Date(`2000-01-01 ${check_in_time}`);
      const checkOut = new Date(`2000-01-01 ${check_out_time}`);
      const diffMs = checkOut - checkIn;
      totalHours = (diffMs / (1000 * 60 * 60)).toFixed(2);
    }

    const [result] = await pool.query(
      `INSERT INTO attendance (user_id, attendance_date, check_in_time, check_out_time, total_hours, status)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       check_out_time = VALUES(check_out_time),
       total_hours = VALUES(total_hours),
       status = VALUES(status)`,
      [userId, attendance_date, check_in_time, check_out_time, totalHours, status || 'Present']
    );

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      data: {
        userId,
        attendance_date,
        check_in_time,
        check_out_time,
        total_hours: totalHours,
        status: status || 'Present'
      }
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
};

// Get user's own attendance logs
export const getMyAttendance = async (req, res) => {
  try {
    const { month, year, start_date, end_date } = req.query;
    const userId = req.user.userId;

    let query = `
      SELECT 
        a.attendance_id,
        a.attendance_date,
        a.check_in_time,
        a.check_out_time,
        a.total_hours,
        a.status,
        a.remarks,
        DATE_FORMAT(a.attendance_date, '%Y-%m-%d') as date,
        TIME_FORMAT(a.check_in_time, '%H:%i') as checkIn,
        TIME_FORMAT(a.check_out_time, '%H:%i') as checkOut
      FROM attendance a
      WHERE a.user_id = ?
    `;
    const params = [userId];

    if (start_date && end_date) {
      query += ' AND a.attendance_date BETWEEN ? AND ?';
      params.push(start_date, end_date);
    } else if (month && year) {
      query += ' AND MONTH(a.attendance_date) = ? AND YEAR(a.attendance_date) = ?';
      params.push(month, year);
    }

    query += ' ORDER BY a.attendance_date DESC';

    const [rows] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance logs',
      error: error.message
    });
  }
};

// Get attendance for a specific day (Admin/HR only) - shows all employees present
export const getAttendanceByDay = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    const query = `
      SELECT 
        a.attendance_id,
        a.user_id as userId,
        a.attendance_date,
        a.check_in_time,
        a.check_out_time,
        a.total_hours,
        a.status,
        a.remarks,
        CONCAT(ep.first_name, ' ', COALESCE(ep.last_name, '')) AS userName,
        ep.employee_code,
        ep.department,
        ep.designation,
        DATE_FORMAT(a.attendance_date, '%Y-%m-%d') as date,
        TIME_FORMAT(a.check_in_time, '%H:%i') as checkIn,
        TIME_FORMAT(a.check_out_time, '%H:%i') as checkOut
      FROM attendance a
      INNER JOIN users u ON a.user_id = u.user_id
      LEFT JOIN employee_profiles ep ON u.user_id = ep.user_id
      WHERE a.attendance_date = ?
      ORDER BY ep.employee_code, a.check_in_time
    `;

    const [rows] = await pool.query(query, [date]);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching attendance by day:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records',
      error: error.message
    });
  }
};

// Get all attendance records (Admin/HR only)
export const getAllAttendance = async (req, res) => {
  try {
    const { month, year, userId, department, status } = req.query;

    let query = `
      SELECT 
        a.attendance_id,
        a.user_id,
        a.attendance_date,
        a.check_in_time,
        a.check_out_time,
        a.total_hours,
        a.status,
        a.remarks,
        CONCAT(ep.first_name, ' ', COALESCE(ep.last_name, '')) AS employee_name,
        ep.employee_code,
        ep.department,
        ep.designation,
        u.email
      FROM attendance a
      INNER JOIN users u ON a.user_id = u.user_id
      LEFT JOIN employee_profiles ep ON u.user_id = ep.user_id
      WHERE 1=1
    `;
    const params = [];

    if (userId) {
      query += ' AND a.user_id = ?';
      params.push(userId);
    }

    if (department) {
      query += ' AND ep.department = ?';
      params.push(department);
    }

    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }

    if (month && year) {
      query += ' AND MONTH(a.attendance_date) = ? AND YEAR(a.attendance_date) = ?';
      params.push(month, year);
    }

    query += ' ORDER BY a.attendance_date DESC, ep.employee_code';

    const [rows] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records',
      error: error.message
    });
  }
};

// Get monthly attendance summary
export const getMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.userId;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Month and year are required'
      });
    }

    const [rows] = await pool.query(
      `SELECT 
        user_id,
        ? as year,
        ? as month,
        COUNT(*) as total_days,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_days,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent_days,
        SUM(CASE WHEN status = 'Half-Day' THEN 0.5 ELSE 0 END) as half_days,
        SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as late_days,
        SUM(CASE WHEN status = 'On Leave' THEN 1 ELSE 0 END) as leave_days,
        SUM(total_hours) as total_hours_worked
       FROM attendance 
       WHERE user_id = ? AND MONTH(attendance_date) = ? AND YEAR(attendance_date) = ?`,
      [year, month, userId, month, year]
    );

    res.status(200).json({
      success: true,
      data: rows[0] || {
        user_id: userId,
        year,
        month,
        total_days: 0,
        present_days: 0,
        absent_days: 0,
        half_days: 0,
        late_days: 0,
        leave_days: 0,
        total_hours_worked: 0
      }
    });
  } catch (error) {
    console.error('Error fetching monthly summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance summary',
      error: error.message
    });
  }
};

// Get payable days for payroll calculation
export const getPayableDays = async (req, res) => {
  try {
    const { userId, month, year } = req.query;

    if (!userId || !month || !year) {
      return res.status(400).json({
        success: false,
        message: 'userId, month, and year are required'
      });
    }

    // Get working days in the month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Get present days including half days
    const [attendanceRows] = await pool.query(
      `SELECT 
        SUM(CASE 
          WHEN status = 'Present' THEN 1 
          WHEN status = 'Half-Day' THEN 0.5 
          WHEN status = 'Late' THEN 1
          ELSE 0 
        END) as present_days
       FROM attendance 
       WHERE user_id = ? AND MONTH(attendance_date) = ? AND YEAR(attendance_date) = ?`,
      [userId, month, year]
    );

    // Get paid leave days
    const [leaveRows] = await pool.query(
      `SELECT SUM(la.total_days) as paid_leave_days
       FROM leave_applications la
       INNER JOIN leave_types lt ON la.leave_type_id = lt.leave_type_id
       WHERE la.user_id = ? 
       AND la.status = 'Approved'
       AND lt.is_paid = TRUE
       AND MONTH(la.start_date) = ? 
       AND YEAR(la.start_date) = ?`,
      [userId, month, year]
    );

    const presentDays = parseFloat(attendanceRows[0]?.present_days || 0);
    const paidLeaveDays = parseFloat(leaveRows[0]?.paid_leave_days || 0);
    const payableDays = presentDays + paidLeaveDays;

    res.status(200).json({
      success: true,
      data: {
        userId,
        month,
        year,
        working_days: daysInMonth,
        present_days: presentDays,
        paid_leave_days: paidLeaveDays,
        payable_days: payableDays,
        unpaid_days: Math.max(0, daysInMonth - payableDays)
      }
    });
  } catch (error) {
    console.error('Error calculating payable days:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating payable days',
      error: error.message
    });
  }
};

// Update attendance record (Admin/HR only)
export const updateAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { check_in_time, check_out_time, status, remarks } = req.body;

    // Calculate total hours if both times are provided
    let totalHours = null;
    if (check_in_time && check_out_time) {
      const checkIn = new Date(`2000-01-01 ${check_in_time}`);
      const checkOut = new Date(`2000-01-01 ${check_out_time}`);
      const diffMs = checkOut - checkIn;
      totalHours = (diffMs / (1000 * 60 * 60)).toFixed(2);
    }

    const [result] = await pool.query(
      `UPDATE attendance 
       SET check_in_time = ?, check_out_time = ?, total_hours = ?, status = ?, remarks = ?
       WHERE attendance_id = ?`,
      [check_in_time, check_out_time, totalHours, status, remarks, attendanceId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully'
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating attendance',
      error: error.message
    });
  }
};

// Delete attendance record (Admin only)
export const deleteAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;

    const [result] = await pool.query(
      'DELETE FROM attendance WHERE attendance_id = ?',
      [attendanceId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting attendance',
      error: error.message
    });
  }
};
