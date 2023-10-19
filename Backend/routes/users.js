const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = ({ app, db }) => {
  app.post('/users/login', (req, res) => {
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
        //console.log(username);
        //console.log(password);

        const user = results[0];
        //console.log(user.employee_password);
        try {
          const passwordMatch = await bcrypt.compare(password, user.employee_password);
          //console.log(passwordMatch);
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
};
