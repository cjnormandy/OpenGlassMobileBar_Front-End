module.exports = ({ app, db }) => {
    app.get('/suppliers', (req, res) => {
        const getQuery = 'SELECT * FROM Suppliers';
        db.query(getQuery, (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json(results);
        });
    });

    app.post('/addSupplier', (req, res) => {
        const { name, type, phone, email } = req.body;

        if (!name || !type || !phone || !email) {
            return res.status(400).json({ message: 'All fields are required to add a supplier to the database.' });
        }
        const suppQuery = 'INSERT INTO Suppliers (supplier_name, supplier_type, phone, email) VALUES (?, ?, ?, ?)';
        const suppVal = [name, type, phone, email];

        db.query(suppQuery, suppVal, (error) => {
            if (error) {
                return res.status(500).json({ message: 'Error adding supplier to the database.' });
            }
            return res.status(201).json({ message: 'Supplier added to the database successfully.'});
        });
    });

    app.put('/updateSupplier/:supplier_id', (req, res) => {
        const { name, type, phone, email } = req.body;
        const supplier_id = req.params.supplier_id;
        let updateSuppQuery = 'UPDATE Suppliers SET ';
        const queryParams = [];

        if (name) {
            updateSuppQuery += 'supplier_name = ?, ';
            queryParams.push(name);
        }
        if (type) {
            updateSuppQuery += 'supplier_type = ?, ';
            queryParams.push(type);
        }
        if (phone) {
            updateSuppQuery += 'phone = ?, ';
            queryParams.push(phone);
        }
        if (email) {
            updateSuppQuery += 'email = ?, ';
            queryParams.push(email);
        }

        if (queryParams.length === 0) {
            return res.status(400).json({ message: 'No valid fields provided for update.' });
        }

        updateSuppQuery = updateSuppQuery.slice(0, -2);
        updateSuppQuery += ' WHERE supplier_id = ?';
        queryParams.push(supplier_id);
        
        db.query(updateSuppQuery, queryParams, (error, suppResults) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error updating the supplier in the database.' });
            }
            if (suppResults.affectedRows === 0) {
                return res.status(404).json({ message: 'Supplier not found.' });
            }
            return res.status(200).json({ message: 'Supplier successfully updated in the database.' });
        });
    });

    app.delete('/deleteSupplier/:supplier_id', (req, res) => {
        const supplier_id = req.params.supplier_id;

        const checkQuery = 'SELECT * FROM Invoices WHERE supplier_id = ?';
        db.query(checkQuery, [supplier_id], (error, checkResults) => {
            if (error) {
                return res.status(500).json({ message: 'Error checking if this supplier has invoices connected to it.' });
            }
            if (checkResults.length > 0) {
                return res.status(400).json({ message: 'This supplier has an existing relationship with at least one invoice in the database, please delete or update all invoices with this supplier and try again.' });
            }
            else {
                const deleteQuery = 'DELETE FROM Suppliers WHERE supplier_id = ?';
                db.query(deleteQuery, [supplier_id], (error, deleteResults) => {
                    if (error) {
                        return res.status(500).json({ message: 'Error deleting the supplier.' });
                    }
                    if (deleteResults.affectedRows === 0) {
                        return res.status(404).json({ message: 'Supplier not found.' });
                    }
                    return res.status(200).json({ message: 'Supplier successfully deleted in the database.' });
                });
            }
        });
    });
}