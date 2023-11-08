module.exports = ({ app, db }) => {
    app.get('/orders', (req, res) => {
        const selectQuery = `SELECT o.order_details_id, o.order_description, o.customer_id, c.first_name, c.last_name, c.phone, c.email,
		o.service_id, se.service_name, d.drink_name, d.drink_type
        FROM Order_Details o
        INNER JOIN Customers c ON o.customer_id = c.customer_id
        INNER JOIN Services se ON o.service_id = se.service_id
        INNER JOIN Order_Drinks od ON o.order_details_id = od.order_id
        INNER JOIN Drinks d ON od.drink_id = d.drink_id
        ORDER BY o.order_details_id ASC;`
        db.query(selectQuery, (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
            const orders = [];
            results.forEach((row)=> {
                if (!orders[row.order_details_id]) {
                    orders[row.order_details_id] = {
                        order_details_id: row.order_details_id,
                        order_description: row.order_description,
                        customer_id: row.customer_id,
                        first_name: row.first_name,
                        last_name: row.last_name,
                        phone: row.phone,
                        email: row.email,
                        service_id: row.service_id,
                        service_name: row.service_name,
                        drinks: []
                    };
                }
                if (row.drink_name && !orders[row.order_details_id].drinks.some((d) => d.drink_name === row.drink_name)) {
                    orders[row.order_details_id].drinks.push({
                        drink_name: row.drink_name,
                        drink_type: row.drink_type                
                    });
                }
            });
            const resultArr = Object.values(orders);
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
    
    function serviceExists(serviceID, callback) {
        const checkServiceQuery = 'SELECT * FROM Services WHERE service_id = ?';
      
        db.query(checkServiceQuery, [serviceID], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result.length > 0);
        });
    }

    function drinkExists(drinkName, callback) {
        const checkDrinkQuery = 'SELECT * FROM Drinks WHERE drink_name = ?';
      
        db.query(checkDrinkQuery, [drinkName], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            let drinkID = null;
            if (result.length > 0) {
                drinkID = result[0].drink_id;
            }
            
            return callback(null, result.length > 0, drinkID);
        });
    }

    function isArrayContainsNull(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === null) {
            return true;
          }
        }
        return false;
    }

    app.post('/createOrder', (req, res) => {
        const { customerID, serviceID, desc, drinks } = req.body;
        
        if (!customerID || !serviceID || !desc || !drinks) {
            return res.status(400).json({ message: 'All fields are required to add an order to the database.' });
        }

        customerExists(customerID, (err, customerExists) => {
            if (err) {
                return res.status(500).json({ message: 'Error checking if customer exists' });
            }
            if (!customerExists) {
                return res.status(404).json({ message: 'Customer not found' });
            }

            serviceExists(serviceID, (err, serviceExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if service exists.' });
                }
                if (!serviceExists) {
                    return res.status(404).json({ message: 'Service not found' });
                }
                const validDrinks = [];
                const invalidDrinks = [];
                const drinkIDArr = [];
                let queryCount = 0;

                for (const drink_name of drinks) {
                    drinkExists(drink_name, (err, drinkExists, drinkID) => {
                        queryCount++;

                        if (err) {
                            return res.status(500).json({ message: 'Error checking if service exists.' });
                        }
                        if (drinkExists) {
                            validDrinks.push(drink_name);
                            drinkIDArr.push(drinkID);
                        }
                        else {
                            invalidDrinks.push(drink_name);
                            drinkIDArr.push(drinkID);
                        }
                    })
                }
                
                const createOrderQuery = 'INSERT INTO Order_Details (customer_id, service_id, order_description) VALUES (?, ?, ?)';
                db.query(createOrderQuery, [customerID, serviceID, desc], (error, ordResults) => {
                    if (error) {
                        return res.status(500).json({ message: 'Error creating order' });
                    }
                    
                    if (!isArrayContainsNull(drinkIDArr)) {
                        const orderID = ordResults.insertId;
    
                        const insertRelationQuery = 'INSERT INTO Order_Drinks (order_id, drink_id) VALUES (?, ?)';
                        const drinkVal = [];
                        for (const drink of drinkIDArr) {
                            if (drinkVal.length === 0) {
                                drinkVal.push(drink);
                            }
                            else {
                                drinkVal.splice(0, drinkVal.length);
                                drinkVal.push(drink);
                            }
    
                            db.query(insertRelationQuery, [orderID, drinkVal], (error, relationResults) => {
                                if (error) {
                                    console.log(error);
                                    return res.status(500).json({ message: 'Error creating order_drink relationships.' });
                                }
                            }); 
                        }
                        return res.status(201).json({ message: 'Order created successfully.'});  
                    }
                    return res.status(201).json({ message: 'Order created successfully, but one or more of the drinks you entered does not exist. You will need to manually update the drinks on the order.'});
                });
            });
        });
    });
    
    app.put('/updateOrder/:order_details_id', (req, res) => {
        const { customerID, serviceID, desc, drinkName } = req.body;
        const order_detailsID = req.params.order_details_id;
        let updateOrderQuery = 'UPDATE Order_Details SET ';
        const queryParams = [];

        if (!customerID && !serviceID && !desc && !drinkName) {
            return res.status(400).json({ message: 'At least one field is required to update an order in the database.' });
        }

        if (customerID && !serviceID && !desc && !drinkName) {
            customerExists(customerID, (err, customerExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if customer exists' });
                }
                if (!customerExists) {
                    return res.status(404).json({ message: 'Customer not found, no update was completed.' });
                }
                else {
                    updateOrderQuery += 'customer_id = ?, ';
                    queryParams.push(customerID);

                    updateOrderQuery = updateOrderQuery.slice(0, -2);
                    updateOrderQuery += ' WHERE order_details_id = ?';
                    queryParams.push(order_detailsID);
            
                    db.query(updateOrderQuery, queryParams, (error, orderResults) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: 'Error updating the order in the database.' });
                        }
                        if (orderResults.affectedRows === 0) {
                            return res.status(404).json({ message: 'Order not found, no update was completed.' });
                        }
                        return res.status(200).json({ message: 'Order updated successfully'});
                    });
                }    
            });
            
        }
        if (serviceID && !customerID && !desc && !drinkName) {
            serviceExists(serviceID, (err, serviceExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if service exists.' });
                }
                if (!serviceExists) {
                    return res.status(404).json({ message: 'Service not found, no update was completed.' });
                }
                else {
                    updateOrderQuery += 'service_id = ?, ';
                    queryParams.push(serviceID);

                    updateOrderQuery = updateOrderQuery.slice(0, -2);
                    updateOrderQuery += ' WHERE order_details_id = ?';
                    queryParams.push(order_detailsID);
            
                    db.query(updateOrderQuery, queryParams, (error, orderResults) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: 'Error updating the order in the database.' });
                        }
                        if (orderResults.affectedRows === 0) {
                            return res.status(404).json({ message: 'Order not found, no update was completed.' });
                        }
                        return res.status(200).json({ message: 'Order updated successfully'});
                    });
                }
            });         
        }
        if (desc && !customerID && !serviceID && !drinkName) {
            updateOrderQuery += 'order_description = ?, ';
            queryParams.push(desc);

            updateOrderQuery = updateOrderQuery.slice(0, -2);
            updateOrderQuery += ' WHERE order_details_id = ?';
            queryParams.push(order_detailsID);
    
            db.query(updateOrderQuery, queryParams, (error, orderResults) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Error updating the order in the database.' });
                }
                if (orderResults.affectedRows === 0) {
                    return res.status(404).json({ message: 'Order not found, no update was completed.' });
                }
                return res.status(200).json({ message: 'Order updated successfully'});
            });
        }
        if (drinkName && !customerID && !serviceID && !desc) {
            drinkExists(drinkName, (err, drinkExists, drinkID) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if the drink exists.' });
                }
                if (!drinkExists) {
                    return res.status(404).json({ message: 'Drink not found, no drink to order relationship was created.' });
                }
                else {
                    const insertRelationQuery = 'INSERT INTO Order_Drinks (order_id, drink_id) VALUES (?, ?)';
                    db.query(insertRelationQuery, [order_detailsID, drinkID], (error) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: 'Error creating the drink to order relationship in the database.' });
                        }
                        return res.status(200).json({ message: 'Drink to order realtionship successfully created in the database.'});
                    });
                }              
            });
        }
        if (customerID && serviceID && !desc && !drinkName) {
            customerExists(customerID, (err, customerExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if customer exists' });
                }
                if (!customerExists) {
                    return res.status(404).json({ message: 'Customer not found, no update was completed.' });
                }
                else {
                    updateOrderQuery += 'customer_id = ?, ';
                    queryParams.push(customerID);

                    serviceExists(serviceID, (err, serviceExists) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error checking if service exists.' });
                        }
                        if (!serviceExists) {
                            return res.status(404).json({ message: 'Service not found, no update was completed.' });
                        }
                        else {
                            updateOrderQuery += 'service_id = ?, ';
                            queryParams.push(serviceID); 

                            updateOrderQuery = updateOrderQuery.slice(0, -2);
                            updateOrderQuery += ' WHERE order_details_id = ?';
                            queryParams.push(order_detailsID);
                    
                            db.query(updateOrderQuery, queryParams, (error, orderResults) => {
                                if (error) {
                                    console.log(error);
                                    return res.status(500).json({ message: 'Error updating the order in the database.' });
                                }
                                if (orderResults.affectedRows === 0) {
                                    return res.status(404).json({ message: 'Order not found, no update was completed.' });
                                }
                                return res.status(200).json({ message: 'Order updated successfully'});
                            });
                        }
                    });
                }    
            });            
        }
        if (customerID && desc && !serviceID && !drinkName) {
            customerExists(customerID, (err, customerExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if customer exists' });
                }
                if (!customerExists) {
                    return res.status(404).json({ message: 'Customer not found, no update was completed.' });
                }
                else {
                    updateOrderQuery += 'customer_id = ?, ';
                    queryParams.push(customerID);
                    updateOrderQuery += 'order_description = ?, ';
                    queryParams.push(desc);

                    updateOrderQuery = updateOrderQuery.slice(0, -2);
                    updateOrderQuery += ' WHERE order_details_id = ?';
                    queryParams.push(order_detailsID);
            
                    db.query(updateOrderQuery, queryParams, (error, orderResults) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: 'Error updating the order in the database.' });
                        }
                        if (orderResults.affectedRows === 0) {
                            return res.status(404).json({ message: 'Order not found, no update was completed.' });
                        }
                        return res.status(200).json({ message: 'Order updated successfully'});
                    });
                }    
            });            
        }
        if (customerID && drinkName && !serviceID && !desc) {
            customerExists(customerID, (err, customerExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if customer exists' });
                }
                if (!customerExists) {
                    return res.status(404).json({ message: 'Customer not found, no update was completed.' });
                }
                else {
                    updateOrderQuery += 'customer_id = ?, ';
                    queryParams.push(customerID);

                    updateOrderQuery = updateOrderQuery.slice(0, -2);
                    updateOrderQuery += ' WHERE order_details_id = ?';
                    queryParams.push(order_detailsID);
            
                    db.query(updateOrderQuery, queryParams, (error, orderResults) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: 'Error updating the order in the database.' });
                        }
                        if (orderResults.affectedRows === 0) {
                            return res.status(404).json({ message: 'Order not found, no update was completed.' });
                        }
                        else {
                            drinkExists(drinkName, (err, drinkExists, drinkID) => {
                                if (err) {
                                    return res.status(500).json({ message: 'Error checking if the drink exists.' });
                                }
                                if (!drinkExists) {
                                    return res.status(404).json({ message: 'All fields except the drink provided were successfully updated due to the drink entered not existing in the database, please enter an existing drink and try again.' });
                                }
                                else {
                                    const insertRelationQuery = 'INSERT INTO Order_Drinks (order_id, drink_id) VALUES (?, ?)';
                                    db.query(insertRelationQuery, [order_detailsID, drinkID], (error) => {
                                        if (error) {
                                            console.log(error);
                                            return res.status(500).json({ message: 'Error creating the drink to order relationship in the database.' });
                                        }
                                        return res.status(200).json({ message: 'Order updated successfully and drink to order realtionship successfully created in the database.'});
                                    });
                                }              
                            });
                        }
                    });
                }    
            });             
        }
        if (serviceID && desc && !customerID && !drinkName) {
            serviceExists(serviceID, (err, serviceExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if service exists.' });
                }
                if (!serviceExists) {
                    return res.status(404).json({ message: 'Service not found, no update was completed.' });
                }
                else {
                    updateOrderQuery += 'service_id = ?, ';
                    queryParams.push(serviceID);

                    updateOrderQuery += 'order_description = ?, ';
                    queryParams.push(desc);

                    updateOrderQuery = updateOrderQuery.slice(0, -2);
                    updateOrderQuery += ' WHERE order_details_id = ?';
                    queryParams.push(order_detailsID);
            
                    db.query(updateOrderQuery, queryParams, (error, orderResults) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: 'Error updating the order in the database.' });
                        }
                        if (orderResults.affectedRows === 0) {
                            return res.status(404).json({ message: 'Order not found, no update was completed.' });
                        }
                        return res.status(200).json({ message: 'Order updated successfully'});
                    });
                }
            });            
        }
        if (serviceID && drinkName && !customerID && !desc) {
            serviceExists(serviceID, (err, serviceExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if service exists.' });
                }
                if (!serviceExists) {
                    return res.status(404).json({ message: 'Service not found, no update was completed.' });
                }
                else {
                    updateOrderQuery += 'service_id = ?, ';
                    queryParams.push(serviceID); 

                    updateOrderQuery = updateOrderQuery.slice(0, -2);
                    updateOrderQuery += ' WHERE order_details_id = ?';
                    queryParams.push(order_detailsID);
            
                    db.query(updateOrderQuery, queryParams, (error, orderResults) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: 'Error updating the order in the database.' });
                        }
                        if (orderResults.affectedRows === 0) {
                            return res.status(404).json({ message: 'Order not found, no update was completed.' });
                        }
                        else {
                            drinkExists(drinkName, (err, drinkExists, drinkID) => {
                                if (err) {
                                    return res.status(500).json({ message: 'Error checking if the drink exists.' });
                                }
                                if (!drinkExists) {
                                    return res.status(404).json({ message: 'All fields except the drink provided were successfully updated due to the drink entered not existing in the database, please enter an existing drink and try again.' });
                                }
                                else {
                                    const insertRelationQuery = 'INSERT INTO Order_Drinks (order_id, drink_id) VALUES (?, ?)';
                                    db.query(insertRelationQuery, [order_detailsID, drinkID], (error) => {
                                        if (error) {
                                            console.log(error);
                                            return res.status(500).json({ message: 'Error creating the drink to order relationship in the database.' });
                                        }
                                        return res.status(200).json({ message: 'Order updated successfully and drink to order realtionship successfully created in the database.'});
                                    });
                                }              
                            });
                        }
                    });
                }
            });                        
        }
        if (desc && drinkName && !customerID && !serviceID) {
            updateOrderQuery += 'order_description = ?, ';
            queryParams.push(desc);

            updateOrderQuery = updateOrderQuery.slice(0, -2);
            updateOrderQuery += ' WHERE order_details_id = ?';
            queryParams.push(order_detailsID);
    
            db.query(updateOrderQuery, queryParams, (error, orderResults) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Error updating the order in the database.' });
                }
                if (orderResults.affectedRows === 0) {
                    return res.status(404).json({ message: 'Order not found, no update was completed.' });
                }
                else {
                    drinkExists(drinkName, (err, drinkExists, drinkID) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error checking if the drink exists.' });
                        }
                        if (!drinkExists) {
                            return res.status(404).json({ message: 'All fields except the drink provided were successfully updated due to the drink entered not existing in the database, please enter an existing drink and try again.' });
                        }
                        else {
                            const insertRelationQuery = 'INSERT INTO Order_Drinks (order_id, drink_id) VALUES (?, ?)';
                            db.query(insertRelationQuery, [order_detailsID, drinkID], (error) => {
                                if (error) {
                                    console.log(error);
                                    return res.status(500).json({ message: 'Error creating the drink to order relationship in the database.' });
                                }
                                return res.status(200).json({ message: 'Order updated successfully and drink to order realtionship successfully created in the database.'});
                            });
                        }              
                    });
                }
            });            
        }
        if (customerID && serviceID && desc && drinkName) {
            customerExists(customerID, (err, customerExists) => {
                if (err) {
                    return res.status(500).json({ message: 'Error checking if customer exists' });
                }
                if (!customerExists) {
                    return res.status(404).json({ message: 'Customer not found, no update was completed.' });
                }
                else {
                    updateOrderQuery += 'customer_id = ?, ';
                    queryParams.push(customerID);

                    serviceExists(serviceID, (err, serviceExists) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error checking if service exists.' });
                        }
                        if (!serviceExists) {
                            return res.status(404).json({ message: 'Service not found, no update was completed.' });
                        }
                        else {
                            updateOrderQuery += 'service_id = ?, ';
                            queryParams.push(serviceID); 
                            
                            updateOrderQuery += 'order_description = ?, ';
                            queryParams.push(desc);

                            updateOrderQuery = updateOrderQuery.slice(0, -2);
                            updateOrderQuery += ' WHERE order_details_id = ?';
                            queryParams.push(order_detailsID);
                    
                            db.query(updateOrderQuery, queryParams, (error, orderResults) => {
                                if (error) {
                                    console.log(error);
                                    return res.status(500).json({ message: 'Error updating the order in the database.' });
                                }
                                if (orderResults.affectedRows === 0) {
                                    return res.status(404).json({ message: 'Order not found, no update was completed.' });
                                }
                                else {
                                    drinkExists(drinkName, (err, drinkExists, drinkID) => {
                                        if (err) {
                                            return res.status(500).json({ message: 'Error checking if the drink exists.' });
                                        }
                                        if (!drinkExists) {
                                            return res.status(404).json({ message: 'All fields except the drink provided were successfully updated due to the drink entered not existing in the database, please enter an existing drink and try again.' });
                                        }
                                        else {
                                            const insertRelationQuery = 'INSERT INTO Order_Drinks (order_id, drink_id) VALUES (?, ?)';
                                            db.query(insertRelationQuery, [order_detailsID, drinkID], (error) => {
                                                if (error) {
                                                    console.log(error);
                                                    return res.status(500).json({ message: 'Error creating the drink to order relationship in the database.' });
                                                }
                                                return res.status(200).json({ message: 'Order updated successfully and drink to order realtionship successfully created in the database.'});
                                            });
                                        }              
                                    });
                                }
                            });                              
                        }                      
                    });
                }    
            }); 
        }
    });

    app.delete('/deleteOrder/:order_details_id', (req, res) => {
        const orderID = req.params.order_details_id;

        const checkRelationQuery = 'SELECT * FROM Order_Drinks WHERE order_id = ?';
        db.query(checkRelationQuery, [orderID], (error, relationResults) => {
            if (error) {
                return res.status(500).json({ message: 'Error checking if any drink to order relationships exist in the database.' });                
            }
            if (relationResults.length > 0) {
                return res.status(400).json({ message: 'This order has one or more existing relationships with a drink in the menu, please delete all the relationships with this order and try again.' });                
            }
            else {
                const deleteQuery = 'DELETE FROM Order_Details WHERE order_details_id = ?';
                db.query(deleteQuery, [orderID], (error, deleteResults) =>{
                    if (error) {
                        return res.status(500).json({ message: 'Error deleting the order in the database.' });                
                    }    
                    if (deleteResults.affectedRows === 0) {
                        return res.status(404).json({ message: 'Order not found.' });
                    }
                    return res.status(200).json({ message: 'Order successfully deleted in the database.' });
                });
            }

        });
    });

    app.delete('/deleteAllOrderRelationships/:order_details_id', (req, res) => {
        const orderID = req.params.order_details_id;

        const checkRelationQuery = 'SELECT * FROM Order_Drinks WHERE order_id = ?';
        db.query(checkRelationQuery, [orderID], (error, relationResults) => {
            if (error) {
                return res.status(500).json({ message: 'Error checking order_drinks relationship existence' });
            }
            if (relationResults.length === 0) {
                return res.status(400).json({ message: 'This order has no existing relationships with any drinks in the menu.' });
            }
            else {
                const deleteRelationQuery = 'DELETE FROM Order_Drinks WHERE order_id = ?';
                db.query(deleteRelationQuery, [orderID], (error, deleteResults) => {
                    if (error) {
                        return res.status(500).json({ message: 'Error deleting the order_drinks relationship(s).' });
                    }
                    if (deleteResults.affectedRows === 0) {
                        return res.status(404).json({ message: 'Order relationships not found.' });
                    }
                    return res.status(200).json({ message: 'Order_Drinks relationship(s) successfully deleted in the database.' });
                });
            }
        });
    });

    app.delete('/deleteOrderRelationshipByDrink/:order_details_id', (req, res) => {
        const { drinkName } = req.body;
        const orderID = req.params.order_details_id;

        drinkExists(drinkName, (err, drinkExists, drinkID) => {
            if (err) {
                return res.status(500).json({ message: 'Error checking if the drink exists.' });
            }
            if (!drinkExists) {
                return res.status(404).json({ message: 'Drink not found' });
            }
            else {
                const checkRelationQuery = 'SELECT * FROM Order_Drinks WHERE order_id = ? AND drink_id = ?';
                db.query(checkRelationQuery, [orderID, drinkID], (error, relationResults) => {
                    if (error) {
                        return res.status(500).json({ message: 'Error checking order_drinks relationship existence' });
                    }
                    if (relationResults.length === 0) {
                        return res.status(400).json({ message: 'This specific order to drink relationship does not exist.' });
                    }
                    else {
                        const deleteRelationQuery = 'DELETE FROM Order_Drinks WHERE order_id = ? AND drink_id = ?';
                        db.query(deleteRelationQuery, [orderID, drinkID], (error, deleteResults) => {
                            if (error) {
                                return res.status(500).json({ message: 'Error deleting the order_drinks relationship.' });
                            }
                            if (deleteResults.affectedRows === 0) {
                                return res.status(404).json({ message: 'Order relationships not found.' });
                            }
                            return res.status(200).json({ message: 'Order_Drinks relationship successfully deleted in the database.' });
                        });
                    }
                });
            }              
        });
    });
}
