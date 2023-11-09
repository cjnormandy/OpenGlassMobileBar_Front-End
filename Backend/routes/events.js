module.exports = ({ app, db }) => {
    app.get('/events', (req, res) => {
        const getQuery = `SELECT ce.event_id, ce.event_name, ce.event_description, ce.event_start_time, ce.event_end_time, ce.event_date,
		a.street, a.city, s.state_abbreviation, a.zipcode, a.county, ce.employee_id, e.e_first_name, e.e_last_name,
        ce.customer_id, c.c_first_name, c.c_last_name, ce.order_details_id, o.order_description, ce.payment_id,
        p.payment_amount, ce.payment_status, p.deposit_amount, p.deposit_status, p.payment_type

        FROM Customer_Events ce
        INNER JOIN Address a ON ce.address_id = a.address_id
        INNER JOIN States s ON a.state_id = s.state_id
        INNER JOIN Employees e ON ce.employee_id = e.employee_id
        INNER JOIN Customers c ON ce.customer_id = c.customer_id
        INNER JOIN Order_Details o ON ce.order_details_id = o.order_details_id
        INNER JOIN Payments p ON ce.payment_id = p.payment_id
        ORDER BY ce.event_date ASC;`;
        db.query(getQuery, (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Internal server error' });                
            }
            const events = [];
            results.forEach((row)=> {
                const date = row.event_date;
                const trimDate = date.toISOString().split('T')[0];
                events[row.event_id] = {
                    event_id: row.event_id,
                    event_name: row.event_name,
                    event_start_time: row.event_start_time,
                    event_end_time: row.event_end_time,
                    event_date: trimDate,
                    street: row.street,
                    city: row.city,
                    state: row.state_abbreviation,
                    zipcode: row.zipcode,
                    county: row.county,
                    employee_id: row.employee_id,
                    emp_first_name: row.e_first_name,
                    emp_last_name: row.e_last_name,
                    customer_id: row.customer_id,
                    cust_first_name: row.c_first_name,
                    cust_last_name: row.c_last_name,
                    order_details_id: row.order_details_id,
                    order_description: row.order_description,
                    payment_id: row.payment_id,
                    payment_amount: row.payment_amount,
                    payment_status: row.payment_status,
                    deposit_amount: row.deposit_amount,
                    deposit_status: row.deposit_status,
                    payment_type: row.payment_type
                }
            });
            const resultArr = Object.values(events);
            return res.status(200).json(resultArr);
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
    
    function orderExists(orderID, callback) {
        const checkOrderQuery = 'SELECT * FROM Order_Details WHERE order_details_id = ?';
      
        db.query(checkOrderQuery, [orderID], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.length > 0);
        });
    }

    function paymentExists(paymentID, callback) {
        const checkPaymentQuery = 'SELECT * FROM Payments WHERE payment_id = ?';
      
        db.query(checkPaymentQuery, [paymentID], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.length > 0);
        });
    }

    function addressExists(street, city, state, zipcode, county, customerID, callback) {
        stateExists(state, (err, exists, state_id) => {
            if (err) {
                console.log('Error checking the states existence.');
                return callback(err, null);
            }
            if (exists) {
                const stateID = state_id;
                const checkAddressQuery = 'SELECT * FROM Address WHERE street = ? AND city = ? AND state_id = ? AND zipcode = ? AND county = ? AND customer_id = ?';

                db.query(checkAddressQuery, [street, city, stateID, zipcode, county, customerID], (err, result) => {
                    if (err) {
                        return callback(err, null);
                    }
                    let addressID = null;
                    if (result.length > 0) {
                        addressID = result[0].address_id;
                    }
                    return callback(null, result.length > 0, addressID);
                });
            }
            else {
                let addressID = null;
                return callback(null, false, addressID);
            }
            
        });

    }

    function stateExists(state, callback) {
        const checkStateQuery = 'SELECT * FROM States WHERE state_abbreviation = ?';
      
        db.query(checkStateQuery, [state], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            let state_id = null;
            if (result.length > 0) {
                state_id = result[0].state_id;
            }
            return callback(null, result.length > 0, state_id);
        });
    }

    function createAddy(street, city, state_name, state, zipcode, county, customerID, callback) {
        stateExists(state, (err, exists, state_id) => {
            if (err) {
                console.log('Error checking the states existence.');
                return callback(err, null);
            }
            if (exists) {
                const stateID = state_id;
                const createAddressQuery = 'INSERT INTO Address (street, city, state_id, zipcode, county, customer_id) VALUES (?, ?, ?, ?, ?, ?)';
                
                db.query(createAddressQuery, [street, city, stateID, zipcode, county, customerID], (err, result) => {
                    if (err) {
                        console.log('Error checking the states existence.');
                        return callback(err, null);
                    }
                    const addressID = result.insertId;
                    console.log(result.insertId);
                    return callback(null, addressID);
                });
            }
            else {
                createState(state_name, state, (err, newStateID) => {
                    if (err) {
                        console.log('Error creating new state in the database.');
                    }
                    const new_state_id = newStateID;
                    console.log(new_state_id);
                    const createAddressQuery = 'INSERT INTO Address (street, city, state_id, zipcode, county, customer_id) VALUES (?, ?, ?, ?, ?, ?)';
                
                    db.query(createAddressQuery, [street, city, new_state_id, zipcode, county, customerID], (err, result) => {
                        if (err) {
                            console.log('Error checking the states existence.');
                            return callback(err, null);
                        }
                        const addressID = result.insertId;
                        return callback(null, addressID);
                    });                    
                });
            }
            
        });
    }

    function createState(state_name, state, callback) {
        const createStateQuery = 'INSERT INTO States (state_name, state_abbreviation) VALUES (?, ?)';

        db.query(createStateQuery, [state_name, state], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            const newStateID = result.insertId;
            return callback(null, newStateID);
        });
    }

    function isValidDateFormat(date) {
        const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        return dateRegex.test(date);
    }


    app.post('/createEvent', (req, res) => {
        const { name, desc, street, city, state_name, state, zipcode, county, employeeID, start, end, date, customerID, orderID, paymentID, payment_status } = req.body;
        const createParams = [];

        if (!name || !desc || !street || !city || !state_name || !state || !zipcode || !county || !employeeID || !start || !end || !date || !customerID || !orderID || !paymentID || !payment_status) {
            return res.status(400).json({ message: 'All fields are required to add an order to the database.' });
        }
        if (!isValidDateFormat(date)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD format when entering in an event date.' });
        }
        if (payment_status != "Paid" && payment_status != "Unpaid") {
            return res.status(400).json({ message: `The payment status can only be Paid or Unpaid. Please enter in a correct payment status and try again.`});
        }
        
        customerExists(customerID, (err, customerExists) => {
            if (err) {
                return res.status(500).json({ message: 'Error checking if customer exists' });
            }
            if (!customerExists) {
                return res.status(404).json({ message: 'Customer not found' });
            }

            employeeExists(employeeID, (err, employeeExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if employee exists' });
                }
                if (!employeeExists) {
                    return res.status(404).json({ message: 'Employee not found' });
                }
                
                orderExists(orderID, (err, orderExists) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error checking if order exists' });
                    }
                    if (!orderExists) {
                        return res.status(404).json({ message: 'Order not found' });
                    }
                    
                    paymentExists(paymentID, (err, payExists) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error checking if payment exists' });
                        }
                        if (!payExists) {
                            return res.status(404).json({ message: 'Payment not found' });
                        }
                        let address_id = null;
                        addressExists(street, city, state, zipcode, county, customerID, (err, addyExists, addressID) => {
                            if (err) {
                                return res.status(500).json({ message: 'Error checking if address exists' });
                            }
                            if (addyExists) {
                                address_id = addressID;
                                const createEventQuery = `INSERT INTO Customer_Events (event_name, event_description, address_id, employee_id, event_start_time, event_end_time, event_date, 
                                    customer_id, order_details_id, payment_id, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                                createParams.push(name);
                                createParams.push(desc);
                                createParams.push(address_id);
                                createParams.push(employeeID);
                                createParams.push(start);
                                createParams.push(end);
                                createParams.push(date);
                                createParams.push(customerID);
                                createParams.push(orderID);
                                createParams.push(paymentID);
                                createParams.push(payment_status);
    
                                db.query(createEventQuery, createParams, (error, createResults) => {
                                    if (error) {
                                        return res.status(500).json({ message: 'Error creating event' });                                    
                                    }
                                    return res.status(201).json({ message: 'Event created succesfully.' }); 
                                });
                            }
                            else {
                                createAddy(street, city, state_name, state, zipcode, county, customerID, (err, newAddressID) => {
                                    if (err) {
                                        return res.status(500).json({ message: 'Error checking if address exists' });
                                    }
                                    address_id = newAddressID;
                                    console.log(newAddressID);
                                    const createEventQuery = `INSERT INTO Customer_Events (event_name, event_description, address_id, employee_id, event_start_time, event_end_time, event_date, 
                                        customer_id, order_details_id, payment_id, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                                    createParams.push(name);
                                    createParams.push(desc);
                                    createParams.push(address_id);
                                    createParams.push(employeeID);
                                    createParams.push(start);
                                    createParams.push(end);
                                    createParams.push(date);
                                    createParams.push(customerID);
                                    createParams.push(orderID);
                                    createParams.push(paymentID);
                                    createParams.push(payment_status);
        
                                    db.query(createEventQuery, createParams, (error, createResults) => {
                                        if (error) {
                                            return res.status(500).json({ message: 'Error creating event' });                                    
                                        }
                                        return res.status(201).json({ message: 'Event created succesfully.' }); 
                                    });
                                });
                            } 
                        });
                    });
                });
            });
        });
    });



}