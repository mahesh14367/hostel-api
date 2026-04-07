import pool from "../config/database";

export async function testConnection() {
   try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        console.log('The solution is:', rows[0].solution);
        console.log('✅ Database connection is working!');
    } catch (err) {
        console.error('❌ Connection failed:', err);
   }
//    finally {
//         // Close the pool when done testing
//         await pool.end();
//     }
}

