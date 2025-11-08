import pool from "../config/database.js";

export const User = {
  // Create a new user
  create: async (userData) => {
    const { role_id, email, password_hash } = userData;
    const [result] = await pool.query(
      "INSERT INTO users (role_id, email, password_hash) VALUES (?, ?, ?)",
      [role_id, email, password_hash]
    );
    return result.insertId;
  },

  // Find user by email
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      `SELECT u.*, r.role_name 
       FROM users u 
       INNER JOIN roles r ON u.role_id = r.role_id 
       WHERE u.email = ?`,
      [email]
    );
    return rows[0];
  },

  // Find user by ID
  findById: async (userId) => {
    const [rows] = await pool.query(
      `SELECT u.*, r.role_name 
       FROM users u 
       INNER JOIN roles r ON u.role_id = r.role_id 
       WHERE u.user_id = ?`,
      [userId]
    );
    return rows[0];
  },

  // Update last login
  updateLastLogin: async (userId) => {
    await pool.query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?",
      [userId]
    );
  },

  // Get all users with profiles
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM view_user_details");
    return rows;
  },

  // Update user status
  updateStatus: async (userId, isActive) => {
    await pool.query("UPDATE users SET is_active = ? WHERE user_id = ?", [
      isActive,
      userId,
    ]);
  },

  // Update user password
  updatePassword: async (userId, newPasswordHash) => {
    await pool.query(
      "UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
      [newPasswordHash, userId]
    );
  },
};

export const Role = {
  // Get all roles
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM roles");
    return rows;
  },

  // Find role by name
  findByName: async (roleName) => {
    const [rows] = await pool.query("SELECT * FROM roles WHERE role_name = ?", [
      roleName,
    ]);
    return rows[0];
  },

  // Find role by ID
  findById: async (roleId) => {
    const [rows] = await pool.query("SELECT * FROM roles WHERE role_id = ?", [
      roleId,
    ]);
    return rows[0];
  },
};

export default { User, Role };
