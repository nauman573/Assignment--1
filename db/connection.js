const mysql = require('mysql');

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '12345',
    port: '3306',
    database:'erp-system'
  });

db.connect((err)=>{
    if(err){
        console.log(err.message)
    }
    else {
        console.log("Database is Conncted");
    }
   
});

module.exports = db;
