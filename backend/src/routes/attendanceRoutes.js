import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  markAttendance,
  getMyAttendance,
  getAttendanceByDay,
  getAllAttendance,
  getMonthlySummary,
  getPayableDays,
  updateAttendance,
  deleteAttendance
} from '../controllers/attendanceController.js';

const router = express.Router();

// Employee routes
router.post('/mark', protect, markAttendance);
router.get('/my-logs', protect, getMyAttendance);
router.get('/summary', protect, getMonthlySummary);

// Admin/HR routes
router.get('/day', protect, authorize('Admin', 'HR Officer', 'Payroll Officer'), getAttendanceByDay);
router.get('/all', protect, authorize('Admin', 'HR Officer'), getAllAttendance);
router.get('/payable-days', protect, authorize('Admin', 'HR Officer', 'Payroll Officer'), getPayableDays);
router.put('/:attendanceId', protect, authorize('Admin', 'HR Officer'), updateAttendance);
router.delete('/:attendanceId', protect, authorize('Admin'), deleteAttendance);

export default router;
