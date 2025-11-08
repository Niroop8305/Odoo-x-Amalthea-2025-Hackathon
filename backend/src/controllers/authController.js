import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models/userModel.js';
import { EmployeeProfile } from '../models/profileModel.js';

// Generate JWT Token
const generateToken = (userId, roleId, roleName) => {
  return jwt.sign(
    { userId, roleId, roleName },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// @desc    Register new user (Admin/HR can create)
// @route   POST /api/auth/register
// @access  Public (for initial admin) / Private (for other roles)
export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      role_name,
      company_name,
      first_name,
      last_name,
      phone
    } = req.body;

    // Validate input
    if (!email || !password || !role_name || !first_name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Get role ID
    const role = await Role.findByName(role_name);
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const userId = await User.create({
      role_id: role.role_id,
      email,
      password_hash
    });

    // Generate employee code
    const employee_code = `EMP${String(userId).padStart(5, '0')}`;

    // Create employee profile
    await EmployeeProfile.create({
      user_id: userId,
      employee_code,
      company_name: company_name || null,
      first_name,
      last_name: last_name || null,
      phone: phone || null,
      date_of_joining: new Date()
    });

    // Generate token
    const token = generateToken(userId, role.role_id, role.role_name);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId,
        email,
        role: role.role_name,
        employee_code,
        token
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await User.updateLastLogin(user.user_id);

    // Get employee profile
    const profile = await EmployeeProfile.findByUserId(user.user_id);

    // Generate token
    const token = generateToken(user.user_id, user.role_id, user.role_name);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user.user_id,
        email: user.email,
        role: user.role_name,
        profile: profile ? {
          employee_code: profile.employee_code,
          company_name: profile.company_name,
          full_name: `${profile.first_name} ${profile.last_name || ''}`.trim(),
          phone: profile.phone,
          department: profile.department,
          designation: profile.designation
        } : null,
        token
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const profile = await EmployeeProfile.findByUserId(user.user_id);

    res.status(200).json({
      success: true,
      data: {
        userId: user.user_id,
        email: user.email,
        role: user.role_name,
        is_active: user.is_active,
        last_login: user.last_login,
        profile: profile || null
      }
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};
