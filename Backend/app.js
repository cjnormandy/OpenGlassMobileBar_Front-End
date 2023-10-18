const express = require('express');
const mysql = require('mysql');

const app = express();

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

app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});