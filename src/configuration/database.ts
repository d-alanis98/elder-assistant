require('dotenv').config();
/**
 * Database configuration
 */


export default { 
    url: process.env['DATABASE_URL'] || '',
    host: process.env['DATABASE_HOST'] || 'localhost',
    port: process.env['DATABASE_PORT'] || 3306,
    user: process.env['DATABASE_USER'] || '',
    secret: process.env['DATABASE_SECRET'] || '',
    database: process.env['DATABASE_NAME'] || '', 
}