import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Get my payroll
router.get('/my-payroll', protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month, year } = req.query;

    let query = `SELECT * FROM payroll WHERE user_id = ?`;
    const params = [userId];

    if (month && year) {
      query += ' AND month = ? AND year = ?';
      params.push(month, year);
    }

    query += ' ORDER BY year DESC, month DESC';

    const [rows] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payroll',
      error: error.message
    });
  }
});

// Get payslip details
router.get('/payslip/:payrollId', protect, async (req, res) => {
  try {
    const { payrollId } = req.params;

    // Get payroll summary
    const [payroll] = await pool.query(
      `SELECT p.*, 
              CONCAT(ep.first_name, ' ', COALESCE(ep.last_name, '')) AS employee_name,
              ep.employee_code, ep.department, ep.designation
       FROM payroll p
       INNER JOIN users u ON p.user_id = u.user_id
       LEFT JOIN employee_profiles ep ON u.user_id = ep.user_id
       WHERE p.payroll_id = ?`,
      [payrollId]
    );

    if (payroll.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payslip not found'
      });
    }

    // Check authorization
    if (req.user.userId !== payroll[0].user_id && 
        !['Admin', 'Payroll Officer'].includes(req.user.roleName)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payslip'
      });
    }

    // Get payroll details (breakdown)
    const [details] = await pool.query(
      `SELECT pd.*, sc.component_name, sc.component_type, sc.is_taxable
       FROM payroll_details pd
       INNER JOIN salary_components sc ON pd.component_id = sc.component_id
       WHERE pd.payroll_id = ?
       ORDER BY sc.component_type DESC, pd.amount DESC`,
      [payrollId]
    );

    res.status(200).json({
      success: true,
      data: {
        payroll: payroll[0],
        details
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payslip',
      error: error.message
    });
  }
});

// Get all payroll (Admin/Payroll Officer only)
router.get('/all', protect, authorize('Admin', 'Payroll Officer'), async (req, res) => {
  try {
    const { month, year, userId, status } = req.query;

    let query = `
      SELECT p.*, 
             CONCAT(ep.first_name, ' ', COALESCE(ep.last_name, '')) AS employee_name,
             ep.employee_code, ep.department
      FROM payroll p
      INNER JOIN users u ON p.user_id = u.user_id
      LEFT JOIN employee_profiles ep ON u.user_id = ep.user_id
      WHERE 1=1
    `;
    const params = [];

    if (userId) {
      query += ' AND p.user_id = ?';
      params.push(userId);
    }

    if (month && year) {
      query += ' AND p.month = ? AND p.year = ?';
      params.push(month, year);
    }

    if (status) {
      query += ' AND p.payment_status = ?';
      params.push(status);
    }

    query += ' ORDER BY p.year DESC, p.month DESC, ep.employee_code';

    const [rows] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payroll records',
      error: error.message
    });
  }
});

// Generate payroll (Admin/Payroll Officer only)
router.post('/generate', protect, authorize('Admin', 'Payroll Officer'), async (req, res) => {
  try {
    const {
      user_id, month, year, working_days, present_days,
      leave_days, gross_salary, total_deductions, net_salary,
      payment_status, payment_method, remarks, components
    } = req.body;

    const generatedBy = req.user.userId;

    // Insert payroll
    const [result] = await pool.query(
      `INSERT INTO payroll 
       (user_id, month, year, working_days, present_days, leave_days,
        gross_salary, total_deductions, net_salary, payment_status,
        payment_method, remarks, generated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, month, year, working_days, present_days, leave_days || 0,
       gross_salary, total_deductions, net_salary, payment_status,
       payment_method, remarks || null, generatedBy]
    );

    const payrollId = result.insertId;

    // Insert payroll details (components)
    if (components && components.length > 0) {
      const detailsValues = components.map(c => [payrollId, c.component_id, c.amount]);
      await pool.query(
        'INSERT INTO payroll_details (payroll_id, component_id, amount) VALUES ?',
        [detailsValues]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Payroll generated successfully',
      data: { payroll_id: payrollId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating payroll',
      error: error.message
    });
  }
});

// Update payroll status (Admin/Payroll Officer only)
router.put('/:payrollId/status', protect, authorize('Admin', 'Payroll Officer'), async (req, res) => {
  try {
    const { payrollId } = req.params;
    const { payment_status, payment_date } = req.body;

    await pool.query(
      'UPDATE payroll SET payment_status = ?, payment_date = ? WHERE payroll_id = ?',
      [payment_status, payment_date || null, payrollId]
    );

    res.status(200).json({
      success: true,
      message: 'Payroll status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payroll status',
      error: error.message
    });
  }
});

// Get salary components
router.get('/components', protect, authorize('Admin', 'Payroll Officer'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM salary_components WHERE is_active = TRUE ORDER BY component_type DESC, component_name'
    );

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching salary components',
      error: error.message
    });
  }
});

export default router;
