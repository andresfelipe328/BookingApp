require('dotenv').config();
const res = require('express/lib/response');
const {
   createPool
} = require('mysql2');
const { getLatestID } = require('./regService');
const pool = createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PSW,
   database: process.env.DB_NAME,
   port: process.env.DB_PORT,
   connectionLimit: 10
})


// Find the latest ID number
exports.findDocList = async function findDocList() {
   var p = new Promise(function(resolve, reject) {
      pool.query('SELECT doctor_name, speciality  FROM doctorrecord', (err, result, fields) => {
         if (err)
            reject(err);
         else {
            resolve(result);
         }
      })
   })
   return p;
}

exports.elements = elements = [];
// Find hours of selected doctor
exports.makeAppt = makeAppt = async (patient_id, docName, dateTime) => {
   pool.getConnection(function(err) {
      if (err) 
         throw err;
         var apptID = getLatestApptID()
         apptID.then(function(result) {
            const apptID = result
            pool.query('SELECT doctor_id FROM doctordb.doctorrecord WHERE doctor_name = ?', docName, (err, result, fields) => {
            var values = [
               [apptID, result[0].doctor_id, patient_id, dateTime]
            ];
            elements = values
            var sql = "INSERT INTO appts (appt_id, doctor_id, patient_id, date_time) VALUES ?";
            pool.query(sql, [values], function (err, result) {
               if (err) 
                  throw err;
               console.log("1 record inserted");
            })
         });
      });
   });
}


// Finds the most recent appt id
getLatestApptID = async () => {
   var p = new Promise(function(resolve, reject) {
      pool.query('SELECT appt_id FROM doctordb.appts ORDER BY appt_id DESC LIMIT 1', (err, result, fields) => {
         if (err)
            reject(err);
         else {
            var nextID;
            if (result.length) {
               nextID = 1 + result[0].appt_id;
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