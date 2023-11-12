module.exports = ({ app, db }) => {
    // Get all customers
    app.get('/customers', (req, res) => {
        const getQuery = 'SELECT * FROM Customers';
        db.query(getQuery, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json(results);
        });
    });

    // Create a new customer
    app.post('/Addcustomers', (req, res) => {
        const { first_name, last_name, birthday, phone, email } = req.body;
        const insertQuery = 'INSERT INTO Customers (c_first_name, c_last_name, birthday, phone, email) VALUES (?, ?, ?, ?, ?)';

        db.query(insertQuery, [first_name, last_name, birthday, phone, email], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(201).json({ message: 'Customer added successfully' });
        });
    });

    // Update a customer by ID
    app.put('/Updatecustomers/:id', (req, res) => {
        const id = req.params.id;
        const { first_name, last_name, birthday, phone, email } = req.body;

        const updateFields = {};

        if (first_name) {
            updateFields.first_name = first_name;
        }

        if (last_name) {
            updateFields.last_name = last_name;
        }

        if (birthday) {
            updateFields.birthday = birthday;
        }

        if (phone) {
            updateFields.phone = phone;
        }

        if (email) {
            updateFields.email = email;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const updateQuery = 'UPDATE Customers SET ? WHERE customer_id=?';

        db.query(updateQuery, [updateFields, id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json({ message: 'Customer updated successfully' });
        });
    });

    // Get a customer by ID
    app.get('/customers/:id', (req, res) => {
        const id = req.params.id;
        const getQuery = 'SELECT * FROM Customers WHERE customer_id = ?';

        db.query(getQuery, [id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            return res.status(200).json(results[0]);
        });
    });

    // Get a customer by Phone
    app.get('/customers/by-phone/:phone', (req, res) => {
        const phone = req.params.phone;
        const getQuery = 'SELECT * FROM Customers WHERE phone = ?';

        db.query(getQuery, [phone], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            return res.status(200).json(results[0]);
        });
    });
};
