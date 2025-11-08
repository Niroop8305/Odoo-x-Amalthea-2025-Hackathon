import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Apply for leave
router.post('/apply', protect, async (req, res) => {
  try {
    const { leave_type_id, start_date, end_date, total_days, reason } = req.body;
    const userId = req.user.userId;

    const [result] = await pool.query(
      `INSERT INTO leave_applications 
       (user_id, leave_type_id, start_date, end_date, total_days, reason, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [userId, leave_type_id, start_date, end_date, total_days, reason]
    );

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: { leave_id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error applying for leave',
      error: error.message
    });
  }
});

// Get my leave applications
router.get('/my-leaves', protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    let query = `
      SELECT la.*, lt.leave_type_name, lt.is_paid
      FROM leave_applications la
      INNER JOIN leave_types lt ON la.leave_type_id = lt.leave_type_id
      WHERE la.user_id = ?
    `;
    const params = [userId];

    if (status) {
      query += ' AND la.status = ?';
      params.push(status);
    }

    query += ' ORDER BY la.applied_date DESC';

    const [rows] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave applications',
      error: error.message
    });
  }
});

// Get all leave applications (Admin/HR only)
router.get('/all', protect, authorize('Admin', 'HR Officer'), async (req, res) => {
  try {
    const { status, userId } = req.query;

    let query = `
      SELECT la.*, 
             lt.leave_type_name, lt.is_paid,
             CONCAT(ep.first_name, ' ', COALESCE(ep.last_name, '')) AS employee_name,
             ep.employee_code, ep.department
      FROM leave_applications la
      INNER JOIN leave_types lt ON la.leave_type_id = lt.leave_type_id
      INNER JOIN users u ON la.user_id = u.user_id
      LEFT JOIN employee_profiles ep ON u.user_id = ep.user_id
      WHERE 1=1
    `;
    const params = [];

    if (userId) {
      query += ' AND la.user_id = ?';
      params.push(userId);
    }

    if (status) {
      query += ' AND la.status = ?';
      params.push(status);
    }

    query += ' ORDER BY la.applied_date DESC';

    const [rows] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave applications',
      error: error.message
    });
  }
});

// Approve/Reject leave (Admin/HR only)
router.put('/:leaveId/status', protect, authorize('Admin', 'HR Officer'), async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status, rejection_reason } = req.body;
    const approvedBy = req.user.userId;

    await pool.query(
      `UPDATE leave_applications 
       SET status = ?, approved_by = ?, approved_date = CURRENT_TIMESTAMP, rejection_reason = ?
       WHERE leave_id = ?`,
      [status, approvedBy, rejection_reason || null, leaveId]
    );

    res.status(200).json({
      success: true,
      message: `Leave ${status.toLowerCase()} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating leave status',
      error: error.message
    });
  }
});

// Get leave balance
router.get('/balance', protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const year = new Date().getFullYear();

    const [rows] = await pool.query(
      `SELECT lb.*, lt.leave_type_name, lt.is_paid
       FROM leave_balance lb
       INNER JOIN leave_types lt ON lb.leave_type_id = lt.leave_type_id
       WHERE lb.user_id = ? AND lb.year = ?`,
      [userId, year]
    );

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave balance',
      error: error.message
    });
  }
});

// Get leave types
router.get('/types', protect, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM leave_types WHERE is_active = TRUE');

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave types',
      error: error.message
    });
  }
});

export default router;
