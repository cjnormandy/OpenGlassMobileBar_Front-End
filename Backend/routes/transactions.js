module.exports = ({ app, db }) => {
    // Create a new transaction
    app.post('/createtransaction', (req, res) => {
        const { customer_id, service_id, payment_type } = req.body;
        const insertQuery = 'INSERT INTO Transactions (customer_id, service_id, payment_type) VALUES (?, ?, ?)';

        db.query(insertQuery, [customer_id, service_id, payment_type], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(201).json({ message: 'Transaction created successfully' });
        });
    });

    // Get all transactions
    app.get('/transactions', (req, res) => {
        const getQuery = 'SELECT * FROM Transactions';
        db.query(getQuery, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json(results);
        });
    });

    // Get transaction by ID
    app.get('/transactions/:id', (req, res) => {
        const id = req.params.id;
        const getQuery = 'SELECT * FROM Transactions WHERE transaction_id = ?';

        db.query(getQuery, [id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Transaction not found' });
            }
            return res.status(200).json(results[0]);
        });
    });

    // Update transaction by ID
    app.put('/updatetransaction/:id', (req, res) => {
        const id = req.params.id;
        const { customer_id, service_id, payment_type } = req.body;

        const updateFields = {};

        if (customer_id) {
            updateFields.customer_id = customer_id;
        }

        if (service_id) {
            updateFields.service_id = service_id;
        }

        if (payment_type) {
            updateFields.payment_type = payment_type;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const updateQuery = 'UPDATE Transactions SET ? WHERE transaction_id=?';

        db.query(updateQuery, [updateFields, id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json({ message: 'Transaction updated successfully' });
        });
    });

    // Delete transaction by ID
    app.delete('/deletetransaction/:id', (req, res) => {
        const id = req.params.id;

        const deleteQuery = 'DELETE FROM Transactions WHERE transaction_id=?';

        db.query(deleteQuery, [id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json({ message: 'Transaction deleted successfully' });
        });
    });
};
