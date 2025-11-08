import pool from '../config/database.js';

export const EmployeeProfile = {
  // Create employee profile
  create: async (profileData) => {
    const {
      user_id, employee_code, company_name, first_name, last_name,
      phone, date_of_birth, gender, address, city, state, country,
      postal_code, emergency_contact_name, emergency_contact_phone,
      date_of_joining, department, designation
    } = profileData;

    const [result] = await pool.query(
      `INSERT INTO employee_profiles (
        user_id, employee_code, company_name, first_name, last_name, phone,
        date_of_birth, gender, address, city, state, country, postal_code,
        emergency_contact_name, emergency_contact_phone, date_of_joining,
        department, designation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id, employee_code, company_name, first_name, last_name, phone,
        date_of_birth, gender, address, city, state, country, postal_code,
        emergency_contact_name, emergency_contact_phone, date_of_joining,
        department, designation
      ]
    );
    return result.insertId;
  },

  // Find profile by user ID
  findByUserId: async (userId) => {
    const [rows] = await pool.query(
      'SELECT * FROM employee_profiles WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  },

  // Update profile
  update: async (userId, profileData) => {
    const fields = Object.keys(profileData)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(profileData), userId];

    await pool.query(
      `UPDATE employee_profiles SET ${fields} WHERE user_id = ?`,
      values
    );
  },

  // Get all profiles
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM employee_profiles');
    return rows;
  }
};

export default EmployeeProfile;
