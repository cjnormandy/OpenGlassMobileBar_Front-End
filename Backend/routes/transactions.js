module.exports = ({ app, db }) => {
    // Get all transactions
    app.get('/transactions', (req, res) => {
        const getQuery = `SELECT t.transaction_id, t.customer_id, c.c_first_name, c.c_last_name, t.service_id, s.service_name, t.payment_type
        FROM Transactions t
        INNER JOIN Customers c ON t.customer_id = c.customer_id
        INNER JOIN Services s ON t.service_id = s.service_id
        ORDER BY t.transaction_id ASC;`;
        db.query(getQuery, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json(results);
        });
    });

    function customerExists(customerID, callback) {
        const checkCustomerQuery = 'SELECT * FROM Customers WHERE customer_id = ?';
      
        db.query(checkCustomerQuery, [customerID], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.length > 0);
        });
    }

    function serviceExists(serviceID, callback) {
        const checkServiceQuery = 'SELECT * FROM Services WHERE service_id = ?';
      
        db.query(checkServiceQuery, [serviceID], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.length > 0);
        });
    }

    // Create a new transaction
    app.post('/createtransaction', (req, res) => {
        const { customer_id, service_id, payment_type } = req.body;
        const insertQuery = 'INSERT INTO Transactions (customer_id, service_id, payment_type) VALUES (?, ?, ?)';

        if (!customer_id || !service_id || !payment_type) {
            return res.status(400).json({ message: 'All field are required.' });
        }

        customerExists(customer_id, (err, customerExists) => {
            if (err) {
                return res.status(500).json({ message: 'Error checking if customer exists' });
            }
            if (!customerExists) {
                return res.status(404).json({ message: 'Customer not found' });
            }

            serviceExists(service_id, (err, serviceExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if service exists' });
                }
                if (!serviceExists) {
                    return res.status(404).json({ message: 'Service not found' });
                }
                
                db.query(insertQuery, [customer_id, service_id, payment_type], (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                    return res.status(201).json({ message: 'Transaction created successfully' });
                });
            });
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
        const updateQuery = 'UPDATE Transactions SET ? WHERE transaction_id=?';
        const updateFields = {};

        if (!customer_id && !service_id && !payment_type) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        if (service_id) {
            updateFields.service_id = service_id;
        }

        if (payment_type) {
            updateFields.payment_type = payment_type;
        }
        if (customer_id && !service_id) {
            customerExists(customer_id, (err, customerExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if customer exists' });
                }
                if (!customerExists) {
                    return res.status(404).json({ message: 'Customer not found' });
                }
                else {
                    updateFields.customer_id = customer_id;

                    db.query(updateQuery, [updateFields, id], (error, results) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                        return res.status(200).json({ message: 'Transaction updated successfully' });
                    });
                }
            });    
        }
        if (service_id && !customer_id) {
            serviceExists(service_id, (err, serviceExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if service exists' });
                }
                if (!serviceExists) {
                    return res.status(404).json({ message: 'Service not found' });
                }
                updateFields.service_id = service_id;

                db.query(updateQuery, [updateFields, id], (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                    return res.status(200).json({ message: 'Transaction updated successfully' });
                });
            });
        }
        if (service_id && customer_id) {
            customerExists(customer_id, (err, customerExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if customer exists' });
                }
                if (!customerExists) {
                    return res.status(404).json({ message: 'Customer not found' });
                }
                updateFields.customer_id = customer_id;
    
                serviceExists(service_id, (err, serviceExists) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error checking if service exists' });
                    }
                    if (!serviceExists) {
                        return res.status(404).json({ message: 'Service not found' });
                    }
                    updateFields.service_id = service_id;

                    db.query(updateQuery, [updateFields, id], (error, results) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                        return res.status(200).json({ message: 'Transaction updated successfully' });
                    });
                });
            });
        }
        if (!customer_id && !service_id) {
            db.query(updateQuery, [updateFields, id], (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                return res.status(200).json({ message: 'Transaction updated successfully' });
            });
        }
    });

    // Delete transaction by ID
    app.delete('/deletetransaction/:id', (req, res) => {
        const id = req.params.id;

        const selectQuery = 'SELECT * FROM Payments WHERE transaction_id = ?';
        db.query(selectQuery, [id], (error, payResults) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (payResults.length > 0) {
                return res.status(400).json({ message: 'This transaction has an existing relationship with a payment. First delete that payment or change the transaction_id of that payment and try again ' });
            }
            else {
                const deleteQuery = 'DELETE FROM Transactions WHERE transaction_id=?';

                db.query(deleteQuery, [id], (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                    return res.status(200).json({ message: 'Transaction deleted successfully' });
                });
            }
        });
    });
};
