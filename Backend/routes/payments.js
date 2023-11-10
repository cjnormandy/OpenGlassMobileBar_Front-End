module.exports = ({ app, db }) => {
    // Get all payments
    app.get('/payments', (req, res) => {
        const getQuery = 'SELECT * FROM Payments';
        db.query(getQuery, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json(results);
        });
    });

    function transactionExists(transaction_id, callback) {
        const checkTransactionQuery = 'SELECT * FROM Transactions WHERE transaction_id = ?';
      
        db.query(checkTransactionQuery, [transaction_id], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.length > 0);
        });
    }

    // Create new payment
    app.post('/Createpayment', (req, res) => {
        const { transaction_id, payment_type, payment_amount, deposit_amount, deposit_status } = req.body;

        if (!transaction_id || !payment_type || !payment_amount || !deposit_amount || !deposit_status) {
            return res.status(400).json({ message: 'All field are required.' });
        }
        if (deposit_status != "Paid" && deposit_status != "Unpaid") {
            return res.status(400).json({ message: 'Deposit status can only be Paid or Unpaid. Please try again.' });
        }
        transactionExists(transaction_id, (err, transactionExists)=> {
            if (err) {
                return res.status(500).json({ message: 'Error checking if transaction exists' });
            }
            if (!transactionExists) {
                return res.status(404).json({ message: 'Transaction not found, no transaction was created' });
            }
            else {
                const insertQuery = 'INSERT INTO Payments (transaction_id, payment_type, payment_amount, deposit_amount, deposit_status) VALUES (?, ?, ?, ?, ?)';

                db.query(insertQuery, [transaction_id, payment_type, payment_amount, deposit_amount, deposit_status], (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                    return res.status(201).json({ message: 'Payment added successfully' });
                });
            }
        });
    });

    // Update payment by ID
    app.put('/Updatepayment/:id', (req, res) => {
        const id = req.params.id;
        const { transaction_id, payment_type, payment_amount, deposit_amount, deposit_status } = req.body;
        const updateQuery = 'UPDATE Payments SET ? WHERE payment_id=?';
        const updateFields = {};
        let deposit = false;

        if (!transaction_id && !payment_type && !payment_amount && !deposit_amount && !deposit_status) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        if (payment_type) {
            updateFields.payment_type = payment_type;
        }

        if (payment_amount) {
            updateFields.payment_amount = payment_amount;
        }

        if (deposit_amount) {
            updateFields.deposit_amount = deposit_amount;
        }

        if (deposit_status) {
            if (deposit_status === "Paid" || deposit_status === "Unpaid") {
                deposit = true;
                updateFields.deposit_status = deposit_status;
            }
        }

        if (transaction_id && !deposit_status) {
            transactionExists(transaction_id, (err, transactionExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if transaction exists' });
                }
                if (!transactionExists) {
                    return res.status(404).json({ message: 'Transaction not found, no update was completed.' });
                }
                else {
                    updateFields.transaction_id = transaction_id;
                    db.query(updateQuery, [updateFields, id], (error, results) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                        return res.status(200).json({ message: 'Payment updated successfully' });
                    });
                }
            });
        }
        if (deposit_status && !transaction_id) {
            if (deposit === true) {
                db.query(updateQuery, [updateFields, id], (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                    return res.status(200).json({ message: 'Payment updated successfully' });
                });
            }
            else {
                return res.status(400).json({ message: 'Deposit status can only be Paid or Unpaid. Please try again.' });
            }
        }
        if (transaction_id && deposit_status) {
            if (deposit === true) {
                transactionExists(transaction_id, (err, transactionExists) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error checking if transaction exists' });
                    }
                    if (!transactionExists) {
                        return res.status(404).json({ message: 'Transaction not found, no update was completed.' });
                    }
                    else {
                        updateFields.transaction_id = transaction_id;
                        db.query(updateQuery, [updateFields, id], (error, results) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({ message: 'Internal server error' });
                            }
                            return res.status(200).json({ message: 'Payment updated successfully' });
                        });
                    }
                });
            }
            else {
                return res.status(400).json({ message: 'Deposit status can only be Paid or Unpaid. Please try again.' });
            }
        }
        if (!transaction_id && !deposit_status) {
            db.query(updateQuery, [updateFields, id], (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                return res.status(200).json({ message: 'Payment updated successfully' });
            });
        } 
    });

    // Get payment by ID
    app.get('/payments/:id', (req, res) => {
        const id = req.params.id;
        const getQuery = 'SELECT * FROM Payments WHERE payment_id = ?';

        db.query(getQuery, [id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Payment not found' });
            }
            return res.status(200).json(results[0]);
        });
    });

    // Delete payment by ID
    app.delete('/Deletepayment/:id', (req, res) => {
        const id = req.params.id;

        const deleteQuery = 'DELETE FROM Payments WHERE payment_id=?';

        db.query(deleteQuery, [id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json({ message: 'Payment deleted successfully' });
        });
    });
};
