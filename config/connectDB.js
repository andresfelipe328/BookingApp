require('dotenv').config();
const {
   createPool
} = require('mysql2');

const pool = createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PSW,
   database: process.env.DB_NAME,
   port: process.env.DB_PORT,
   connectionLimit: 10
})

exports.pool = pool;