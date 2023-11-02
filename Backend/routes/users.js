const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = ({ app, db }) => {
  app.post('/users/login', async (req, res) => {
    const { username, password } = req.body;
    
    db.query(
      'SELECT * FROM Employee_Login WHERE employee_username = ?',
      [username],
      
      async (error, results) => {
        if (error) {
          console.log(error);  
          return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: 'Authentication failed' });
        }
        console.log(username);
        console.log(password);

        const user = results[0];
        //console.log(user.employee_password);
        try {
          const passwordMatch = await bcrypt.compare(password, user.employee_password);
          console.log(passwordMatch);
          if (passwordMatch) {
            const secretKey = 'test';
            const token = jwt.sign({ username }, secretKey, { expiresIn: '7d' });
            console.log('Employee Login Successful!')
            return res.status(200).json({ token });
          } else {
            return res.status(401).json({ message: 'Authentication failed' });
          }
        } catch (error) {
          console.log(error);         
          return res.status(500).json({ message: 'Internal server error' });
        }
      }
    );
  });

  app.post('/users/signup', async (req, res) => {
    const { firstName, lastName, phone, email, status, role, username, password } = req.body;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Start a transaction since you're performing multiple queries
      db.beginTransaction(async (err) => {
        if (err) throw err;

        // Insert into the Employees table
        db.query(
          'INSERT INTO Employees (first_name, last_name, phone, email, employee_status, employee_role) VALUES (?, ?, ?, ?, ?, ?)',
          [firstName, lastName, phone, email, status, role],
          (error, results) => {
            if (error) {
              // If an error occurs, rollback the transaction
              return db.rollback(() => {
                throw error;
              });
            }

            const employeeId = results.insertId;

            // Insert into the Employee_Login table
            db.query(
              'INSERT INTO Employee_Login (employee_username, employee_password, employee_id) VALUES (?, ?, ?)',
              [username, hashedPassword, employeeId],
              (error) => {
                if (error) {
                  // If an error occurs, rollback the transaction
                  return db.rollback(() => {
                    throw error;
                  });
                }

                // If successful, commit the transaction
                db.commit((err) => {
                  if (err) {
                    // If an error occurs, rollback the transaction
                    return db.rollback(() => {
                      throw err;
                    });
                  }

                  res.status(201).json({ message: 'User created successfully', employeeId });
                });
              }
            );
          }
        );
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};