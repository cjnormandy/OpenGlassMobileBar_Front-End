module.exports = ({ app, db }) => {
    // Get all feedback
    app.get('/feedback', (req, res) => {
        const getQuery = `SELECT f.feedback_id, f.feedback_description, f.feedback_rating, f.customer_id, c.c_first_name,
        c.c_last_name, f.employee_id, e.e_first_name, e.e_last_name
        FROM Feedback f
        INNER JOIN Customers c ON f.customer_id = c.customer_id
        INNER JOIN Employees e ON f.employee_id = e.employee_id
        ORDER BY f.feedback_id ASC;`;
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

    function employeeExists(employeeID, callback) {
        const checkEmployeeQuery = 'SELECT * FROM Employees WHERE employee_id = ?';
      
        db.query(checkEmployeeQuery, [employeeID], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.length > 0);
        });
    }    

    // Create new feedback
    app.post('/Createfeedback', (req, res) => {
        const { feedback_description, feedback_rating, customer_id, employee_id } = req.body;
        if (!feedback_description || !feedback_rating || !customer_id || !employee_id) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (feedback_rating > 5) {
            return res.status(400).json({ message: 'Rating needs to be between 1-5. Please try again.' });
        }

        customerExists(customer_id, (err, customerExists) => {
            if (err) {
                return res.status(500).json({ message: 'Error checking if customer exists' });
            }
            if (!customerExists) {
                return res.status(404).json({ message: 'Customer not found' });
            }

            employeeExists(employee_id, (err, employeeExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if employee exists' });
                }
                if (!employeeExists) {
                    return res.status(404).json({ message: 'Employee not found' });
                }
                const insertQuery = 'INSERT INTO Feedback (feedback_description, feedback_rating, customer_id, employee_id) VALUES (?, ?, ?, ?)';

                db.query(insertQuery, [feedback_description, feedback_rating, customer_id, employee_id], (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                    return res.status(201).json({ message: 'Feedback added successfully' });
                });
            });
        });    
    });

    // Update feedback by ID
    app.put('/Updatefeedback/:id', (req, res) => {
        const id = req.params.id;
        const { feedback_description, feedback_rating, customer_id, employee_id } = req.body;
        const updateQuery = 'UPDATE Feedback SET ? WHERE feedback_id=?';
        const updateFields = {};
        let feedback = false;

        if (!feedback_description && !feedback_rating && !customer_id && !employee_id) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        if (feedback_description) {
            updateFields.feedback_description = feedback_description;
        }

        if (feedback_rating) {
            if (feedback_rating >= 1 && feedback_rating <= 5) {
                feedback = true;
                updateFields.feedback_rating = feedback_rating;
            }
        }

        if (feedback_rating && !customer_id && !employee_id) {
            if (feedback === true) {
                db.query(updateQuery, [updateFields, id], (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                    return res.status(200).json({ message: 'Feedback updated successfully' });
                });
            }
            else {
                return res.status(400).json({ message: 'Rating needs to be between 1-5. Please try again.' });
            }
        }

        if (feedback_rating && customer_id && !employee_id) {
            if (feedback === true) {
                customerExists(customer_id, (err, customerExists) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error checking if customer exists' });
                    }
                    if (!customerExists) {
                        return res.status(404).json({ message: 'Customer not found, no update was completed.' });
                    }
                    else {
                        updateFields.customer_id = customer_id;
    
                        db.query(updateQuery, [updateFields, id], (error, results) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({ message: 'Internal server error' });
                            }
                            return res.status(200).json({ message: 'Feedback updated successfully' });
                        });
                    }
                });
            }
            else {
                return res.status(400).json({ message: 'Rating needs to be between 1-5. Please try again.' });
            }
        }
        if (feedback_rating && employee_id && !customer_id) {
            if (feedback === true) {
                employeeExists(employee_id, (err, employeeExists) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error checking if employee exists' });
                    }
                    if (!employeeExists) {
                        return res.status(404).json({ message: 'Employee not found, no update was completed.' });
                    }
                    else {
                        updateFields.employee_id = employee_id;
                        db.query(updateQuery, [updateFields, id], (error, results) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({ message: 'Internal server error' });
                            }
                            return res.status(200).json({ message: 'Feedback updated successfully' });
                        });
                    }
                });                 
            }
            else {
                return res.status(400).json({ message: 'Rating needs to be between 1-5. Please try again.' });
            }
        }

        if (feedback_rating && customer_id && employee_id) {
            if (feedback === true) {
                customerExists(customer_id, (err, customerExists) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error checking if customer exists' });
                    }
                    if (!customerExists) {
                        return res.status(404).json({ message: 'Customer not found, no update was completed.' });
                    }
                    else {
                        updateFields.customer_id = customer_id;
                        employeeExists(employee_id, (err, employeeExists) => {
                            if (err) {
                                return res.status(500).json({ message: 'Error checking if employee exists' });
                            }
                            if (!employeeExists) {
                                return res.status(404).json({ message: 'Employee not found, no update was completed.' });
                            }
                            else {
                                updateFields.employee_id = employee_id;
                                db.query(updateQuery, [updateFields, id], (error, results) => {
                                    if (error) {
                                        console.log(error);
                                        return res.status(500).json({ message: 'Internal server error' });
                                    }
                                    return res.status(200).json({ message: 'Feedback updated successfully' });
                                });
                            }
                        });
                    }
                });                
            }
            else {
                return res.status(400).json({ message: 'Rating needs to be between 1-5. Please try again.' });
            }
        }

        if (customer_id && !employee_id && !feedback_rating) {
            console.log(feedback);
            customerExists(customer_id, (err, customerExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if customer exists' });
                }
                if (!customerExists) {
                    return res.status(404).json({ message: 'Customer not found, no update was completed.' });
                }
                else {
                    updateFields.customer_id = customer_id;

                    db.query(updateQuery, [updateFields, id], (error, results) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                        return res.status(200).json({ message: 'Feedback updated successfully' });
                    });
                }
            });
        }

        if (employee_id && !customer_id && !feedback_rating) {
            employeeExists(employee_id, (err, employeeExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if employee exists' });
                }
                if (!employeeExists) {
                    return res.status(404).json({ message: 'Employee not found, no update was completed.' });
                }
                else {
                    updateFields.employee_id = employee_id;
                    db.query(updateQuery, [updateFields, id], (error, results) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                        return res.status(200).json({ message: 'Feedback updated successfully' });
                    });
                }
            });        
        }
        if (customer_id && employee_id && !feedback_rating) {
            customerExists(customer_id, (err, customerExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if customer exists' });
                }
                if (!customerExists) {
                    return res.status(404).json({ message: 'Customer not found, no update was completed.' });
                }
                else {
                    updateFields.customer_id = customer_id;
                    employeeExists(employee_id, (err, employeeExists) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error checking if employee exists' });
                        }
                        if (!employeeExists) {
                            return res.status(404).json({ message: 'Employee not found, no update was completed.' });
                        }
                        else {
                            updateFields.employee_id = employee_id;
                            db.query(updateQuery, [updateFields, id], (error, results) => {
                                if (error) {
                                    console.log(error);
                                    return res.status(500).json({ message: 'Internal server error' });
                                }
                                return res.status(200).json({ message: 'Feedback updated successfully' });
                            });
                        }
                    });
                }
            });        
        }
        if (!customer_id && !employee_id && !feedback_rating) {
            db.query(updateQuery, [updateFields, id], (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                return res.status(200).json({ message: 'Feedback updated successfully' });
            });
        }
    });

    // Get feedback by ID
    app.get('/feedback/:id', (req, res) => {
        const id = req.params.id;
        const getQuery = 'SELECT * FROM Feedback WHERE feedback_id = ?';

        db.query(getQuery, [id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Feedback not found' });
            }
            return res.status(200).json(results[0]);
        });
    });

    // Delete feedback by ID
    app.delete('/Deletefeedback/:id', (req, res) => {
        const id = req.params.id;

        const deleteQuery = 'DELETE FROM Feedback WHERE feedback_id=?';

        db.query(deleteQuery, [id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json({ message: 'Feedback deleted successfully' });
        });
    });
};
