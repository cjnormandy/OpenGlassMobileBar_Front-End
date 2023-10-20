module.exports = ({ app, db }) => {
    app.get('/drinks', (req, res) => {
      const active_status = 'Active';
      const getQuery = 'SELECT * FROM Drinks WHERE drink_status = ?';
      db.query(getQuery, [active_status], (error, results) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
          }
          return res.status(200).json(results);
        });
    });

    app.post('/addDrink', (req, res) => {
        const { name, type, desc, } = req.body;
        const status = 'Active';

        if (!name || !type || !desc) {
            return res.status(400).json({ message: 'All fields are required to add a drink to the menu.' });
        }

        const insertQuery = 'INSERT INTO Drinks (drink_name, drink_type, drink_description, drink_status) VALUES (?, ?, ?, ?)';
        const values = [name, type, desc, status];

        db.query(insertQuery, values, (error, results) => {
            if (error) {
              console.log(error);
              return res.status(500).json({ message: 'Error adding drink to the menu.' });
            }
            return res.status(201).json({ message: 'Drink added to the menu successfully.' });
          });
      });

      app.put('/updateDrink/:drink_id', (req, res) => {
        const { name, type, desc, } = req.body;
        const drink_id = req.params.drink_id;

        if (!name && !type && !desc) {
            return res.status(400).json({ message: 'At least one of the fields are required to update a drink in the menu.' });
        }

        let updateQuery = 'UPDATE Drinks SET ';
        const values = [];

        if (name) {
            updateQuery += 'drink_name = ?, ';
            values.push(name);
        }

        if (type) {
            updateQuery += 'drink_type = ?, ';
            values.push(type);
        }

        if (desc) {
            updateQuery += 'drink_description = ?, ';
            values.push(desc);
        }

        updateQuery = updateQuery.slice(0, -2);

        updateQuery += ' WHERE drink_id = ?';
        values.push(drink_id);

        db.query(updateQuery, values, (error, results) => {
            if (error) {
              console.log(error);
              return res.status(500).json({ message: 'Error updating drink in the menu.' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Drink was not found in the menu.' });
            }

            return res.status(200).json({ message: 'Drink updated in the menu successfully.' });
          });
      });

      app.put('/deleteDrink/:drink_id', (req, res) => {
        const drink_id = req.params.drink_id;
        let deleteQuery = 'UPDATE Drinks SET drink_status = ?';
        const values = [];

        const inactive_status = 'Inactive';
        values.push(inactive_status);

        deleteQuery += ' WHERE drink_id = ?';
        values.push(drink_id);

        db.query(deleteQuery, values, (error, results) => {
            if (error) {
              console.log(error);
              return res.status(500).json({ message: 'Error deleting drink from the menu.' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Drink was not found in the menu.' });
            }

            return res.status(200).json({ message: 'Drink deleted from the menu successfully.' });
          });
      });
  };