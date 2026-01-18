const { Client } = require('pg');

const connectionString = 'postgresql://applytrack_db_user:vA1ZgKfvc81eRuAe1ZPuwUO2ZLMkNvXw@dpg-d5iqpt2dbo4c73ebhodg-a.virginia-postgres.render.com/applytrack_db';

async function runMigration() {
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Add isAdmin column
    console.log('Adding isAdmin column...');
    await client.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT false');
    console.log('✅ isAdmin column added');
    
    // Create admin account
    console.log('Creating admin account...');
    const result = await client.query(`
      INSERT INTO "users" (id, email, password, name, role, company, "isAdmin", "isActive", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        'medomoust@gmail.com',
        '$2b$10$bVnQwvvb10DkcBl5i/PlOODS/RUrSeRLPy7QwTHNJLCQzpYi7MA.u',
        'Admin User',
        'recruiter',
        'GOOGLE',
        true,
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO UPDATE SET "isAdmin" = true
      RETURNING id, email, "isAdmin"
    `);
    
    console.log('✅ Admin account created/updated:', result.rows[0]);
    console.log('\n🎉 Migration complete! You can now login with:');
    console.log('   Email: medomoust@gmail.com');
    console.log('   Password: Medo1234$');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

runMigration().catch(console.error);
