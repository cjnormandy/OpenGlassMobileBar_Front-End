const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'testopenglass.cvr0psvcqanz.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '#123Password',
  database: 'openglassmobilebar',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to Database Successful!');
});

process.on('exit', () => {
  db.end();
  console.log('Connection to Database closed.');
});

module.exports = db;
