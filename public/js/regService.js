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


// Create a user record in the database
exports.addUser = addUser = (id, name, email, psw) => {
   var values = [
      [id,name,email,psw]
   ];

   return new Promise ( async (resolve, reject) => {
      try {
         pool.getConnection(function(err, conn) {
            pool.query('SELECT patient_email FROM doctordb.patientrecord WHERE patient_email = ?', email, (err, result, fields) => {
               if (result.length > 0)
                  resolve(true);
               else {
                  pool.query('INSERT INTO patientrecord (patient_id, patient_name, patient_email, password) Values ?', [values], (err, result, fields) => {
                  console.log("Number of records inserted: " + result.affectedRows);
                  resolve(false);
                  })
               }
         });
            conn.release();
         });
      }
      catch(e) {
         reject(e)
      }
   })
}


// Find the latest patient ID
exports.getLatestID = async function getLatestID() {
   var p = new Promise(function(resolve, reject) {
      pool.query('SELECT patient_id FROM doctordb.patientrecord ORDER BY patient_id DESC LIMIT 1', (err, result, fields) => {
         if (err)
            reject(err);
         else {
            var nextID;
            if (result.length) {
               nextID = 1 + result[0].patient_id;
            }
            else {
               nextID = 1;
            }
            resolve(nextID);
         }
      })
   })
   return p;
}