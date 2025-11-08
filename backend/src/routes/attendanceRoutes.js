import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Mark attendance
router.post('/mark', protect, async (req, res) => {
  try {
    const { attendance_date, check_in_time, check_out_time, status } = req.body;
    const userId = req.user.userId;

    const [result] = await pool.query(
      `INSERT INTO attendance (user_id, attendance_date, check_in_time, check_out_time, status)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       check_out_time = VALUES(check_out_time),
       status = VALUES(status)`,
      [userId, attendance_date, check_in_time, check_out_time, status || 'Present']
    );

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
});

// Get user attendance logs
router.get('/my-logs', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.userId;

    let query = 'SELECT * FROM attendance WHERE user_id = ?';
    const params = [userId];

    if (month && year) {
      query += ' AND MONTH(attendance_date) = ? AND YEAR(attendance_date) = ?';
      params.push(month, year);
    }

    query += ' ORDER BY attendance_date DESC';

    const [rows] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance logs',
      error: error.message
    });
  }
});

// Get all attendance (Admin/HR only)
router.get('/all', protect, authorize('Admin', 'HR Officer'), async (req, res) => {
  try {
    const { month, year, userId } = req.query;

    let query = `
      SELECT a.*, 
             CONCAT(ep.first_name, ' ', COALESCE(ep.last_name, '')) AS employee_name,
             ep.employee_code, ep.department
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
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records',
      error: error.message
    });
  }
});

// Get monthly summary
router.get('/summary', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.userId;

    const [rows] = await pool.query(
      'SELECT * FROM view_monthly_attendance WHERE user_id = ? AND month = ? AND year = ?',
      [userId, month, year]
    );

    res.status(200).json({
      success: true,
      data: rows[0] || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance summary',
      error: error.message
    });
  }
});

export default router;
