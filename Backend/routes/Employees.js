module.exports = (app, db) => {
    // Get all employees
    app.get('/employees', (req, res) => {
        const getQuery = 'SELECT * FROM Employees WHERE employee_status != "Inactive"';
        db.query(getQuery, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json(results);
        });
    });

    // Create a new employee
    app.post('/Addemployees', (req, res) => {
        const { first_name, last_name, phone, email, employee_role } = req.body;
        const insertQuery = 'INSERT INTO Employees (e_first_name, e_last_name, phone, email, employee_role, employee_status) VALUES (?, ?, ?, ?, ?, ?)';

        db.query(insertQuery, [first_name, last_name, phone, email, employee_role, 'Active'], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(201).json({ message: 'Employee added successfully' });
        });
    });

    // Update an employee by ID
    app.put('/Updateemployees/:id', (req, res) => {
        const id = req.params.id;
        const { first_name, last_name, phone, email, employee_role } = req.body;

        // Create an object to hold the fields to update
        const updateFields = {};

        if (first_name) {
            updateFields.first_name = first_name;
        }

        if (last_name) {
            updateFields.last_name = last_name;
        }

        if (phone) {
            updateFields.phone = phone;
        }

        if (email) {
            updateFields.email = email;
        }

        if (employee_role) {
            updateFields.employee_role = employee_role;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const updateQuery = 'UPDATE Employees SET ? WHERE employee_id=?';

        db.query(updateQuery, [updateFields, id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json({ message: 'Employee updated successfully' });
        });
    });

    // Soft Delete (Deactivate) an employee by ID
    app.delete('/employees/:id', (req, res) => {
        const id = req.params.id;

        const updateQuery = 'UPDATE Employees SET employee_status=? WHERE employee_id=?';
        const values = ['Inactive', id];

        db.query(updateQuery, values, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json({ message: 'Employee deactivated successfully' });
        });
    });

    // Activate an inactive employee by ID
    app.put('/employees/:id/activate', (req, res) => {
        const id = req.params.id;

        const updateQuery = 'UPDATE Employees SET employee_status=? WHERE employee_id=?';
        const values = ['Active', id];

        db.query(updateQuery, values, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json({ message: 'Employee activated successfully' });
        });
    });


    // Get an employee by ID
    app.get('/employees/:id', (req, res) => {
        const id = req.params.id;
        const getQuery = 'SELECT * FROM Employees WHERE employee_id = ?';

        db.query(getQuery, [id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            return res.status(200).json(results[0]);
        });
    });
};
