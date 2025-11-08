import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeDatabase() {
  let connection;
  
  try {
    // Connect without database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      multipleStatements: true
    });

    console.log('📡 Connected to MySQL Server');

    // 1. Execute main schema (tables, views, default data)
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📝 Step 1: Creating database, tables, and views...');
    await connection.query(schema);

    console.log('✅ Tables and views created successfully!');
    console.log('📋 Tables created:');
    console.log('   - roles');
    console.log('   - users');
    console.log('   - employee_profiles');
    console.log('   - attendance');
    console.log('   - leave_types');
    console.log('   - leave_balance');
    console.log('   - leave_applications');
    console.log('   - salary_components');
    console.log('   - employee_salary_structure');
    console.log('   - payroll');
    console.log('   - payroll_details');
    console.log('   - audit_logs');

    // 2. Execute stored procedures
    try {
      const proceduresPath = join(__dirname, 'procedures.sql');
      if (fs.existsSync(proceduresPath)) {
        console.log('\n📝 Step 2: Creating stored procedures...');
        const procedures = fs.readFileSync(proceduresPath, 'utf8');
        await connection.query(procedures);
        console.log('✅ Stored procedures created successfully!');
      }
    } catch (error) {
      console.log('⚠️  Note: Stored procedures creation skipped (optional feature)');
      console.log('   Error:', error.message);
    }

    // 3. Execute triggers
    try {
      const triggersPath = join(__dirname, 'triggers.sql');
      if (fs.existsSync(triggersPath)) {
        console.log('\n📝 Step 3: Creating triggers...');
        const triggers = fs.readFileSync(triggersPath, 'utf8');
        await connection.query(triggers);
        console.log('✅ Triggers created successfully!');
      }
    } catch (error) {
      console.log('⚠️  Note: Triggers creation skipped (optional feature)');
      console.log('   Error:', error.message);
    }

    console.log('\n🎉 WorkZen HRMS Database is ready!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run initialization
initializeDatabase();
