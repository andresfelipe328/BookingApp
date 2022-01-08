require('dotenv').config();
const bcrypt = require('bcrypt');
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

// Find user in the database by patient_email
let findUserByEmail = (email) => {
   return new Promise(((resolve, reject) => {
      try {
         pool.getConnection(function(err, conn) {
            pool.query("SELECT * FROM doctordb.patientrecord WHERE patient_email = ?", email, function(error, rows) {
               if (error) reject(error)
               else {
                  let user = rows[0];
                  resolve(user);
               }
            });
            conn.release();
         });
      }
      catch (e){
         reject(e)
      }
   }))
}

// Compare given password with the password of user 
let comparePassword = (user, password) => {
   return new Promise( async (resolve, reject) => {
      try {
         let isMatch = await bcrypt.compare(password, user.password)
         if (isMatch) {
            resolve(true);
          } else {
            reject("This password is incorrect")
          }
      }
      catch(e) {
         reject(e)
      }
   })
}

// Find user in the database by patient_id
let findUserById = (id) => {
   return new Promise((resolve, reject) => {
       try{
         pool.getConnection(function(err, conn) {
           pool.query("SELECT * FROM doctordb.patientrecord WHERE patient_id = ?", id, function(error, rows) {
               if(error) reject(error);
               let user = rows[0];
               resolve(user);
           });
           conn.release();
         });
       }
       catch (e) {
         reject(e);
       }
   })
};

// Exports
module.exports = {
   findUserByEmail: findUserByEmail,
   findUserById: findUserById,
   comparePassword: comparePassword
}