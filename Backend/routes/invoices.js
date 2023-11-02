module.exports = ({ app, db }) => {
    app.get('/invoices', (req, res) => {
        const getQuery = `SELECT ivo.invoice_id, ivo.invoice_date, ivo.invoice_price, ivo.supplier_id, s.supplier_name
        FROM Invoices ivo
        INNER JOIN Suppliers s ON ivo.supplier_id = s.supplier_id
        ORDER BY ivo.invoice_id ASC;`;
        db.query(getQuery, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal sever error' });
            }
            const invoices = [];
            results.forEach((row)=> {
                const date = row.invoice_date;
                const trimDate = date.toISOString().split('T')[0];
                invoices[row.invoice_id] = {
                    invoice_id: row.invoice_id,
                    invoice_date: trimDate,
                    invoice_price: row.invoice_price,
                    supplier_id: row.supplier_id,
                    supplier_name: row.supplier_name
                }
            });
            const resultArr = Object.values(invoices);
            return res.status(200).json(resultArr);
        });
    });

    function isValidDateFormat(date) {
        const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        return dateRegex.test(date);
    }

    app.post('/addInvoice', (req, res) => {
        const { date, price, supplierID } = req.body;

        if (!date || !price || !supplierID) {
            return res.status(400).json({ message: 'All fields are required to add an invoice to the database.' });
        }
        if (!isValidDateFormat(date)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD format when entering in an invoice date.' });
        }
        const supplierQuery = 'SELECT * FROM Suppliers WHERE supplier_id = ?';

        db.query(supplierQuery, supplierID, (error, supResults) => {
            if (error) {
                return res.status(500).json({ message: 'Error checking if the supplier exists in the database.' });          
            }
            if (supResults.length === 0) {
                return res.status(404).json({ message: 'The supplier you are trying to connect this invoice to does not exist in the database.' });
            }
            else {
                const addInvoiceQuery = 'INSERT INTO Invoices (invoice_date, invoice_price, supplier_id) VALUES (?, ?, ?)';
                const ivoVal = [date, price, supplierID];
                db.query(addInvoiceQuery, ivoVal, (error) => {
                    if (error) {
                        return res.status(500).json({ message: 'Error adding the invoice to the database.' });
                    }
                    return res.status(201).json({ message: 'Invoice successfully added to the database.' });
                });
            }
        });
    });

    app.put('/updateInvoice/:invoice_id', (req, res) => {
        const { date, price, supplierID } = req.body;
        const invoice_id = req.params.invoice_id;
        let updateInvoiceQuery = 'UPDATE Invoices SET ';
        const queryParams = [];

        if (date) {
            if (!isValidDateFormat(date)) {
                return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD format when entering in an invoice date.' });
            }
            else {
                updateInvoiceQuery += 'invoice_date = ?, ';
                queryParams.push(date);
            }
        }
        if (price) {
            updateInvoiceQuery += 'invoice_price = ?, ';
            queryParams.push(price);
        }
        if (supplierID) {
            const selectQuery = 'SELECT * FROM Suppliers WHERE supplier_id = ?';
            db.query(selectQuery, supplierID, (error, supResults) => {
                if (error) {
                    return res.status(500).json({ message: 'Error checking if the supplier entered exists in the database.' });
                }
                if (supResults.length === 0) {
                    return res.status(404).json({ message: 'The supplier_id given does not exist in the database, please enter a supplier_id that exists.' });
                }
                if (queryParams.length === 0) {
                    updateInvoiceQuery += 'supplier_id = ?, ';
                    queryParams.push(supplierID);

                    updateInvoiceQuery = updateInvoiceQuery.slice(0, -2);
                    updateInvoiceQuery += ' WHERE invoice_id = ?';
                    queryParams.push(invoice_id);
                }
                else {
                    updateInvoiceQuery += 'supplier_id = ?, ';
                    queryParams.push(supplierID);
                    
                    updateInvoiceQuery = updateInvoiceQuery.slice(0, -2);
                    updateInvoiceQuery += ' WHERE invoice_id = ?';
                    queryParams.push(invoice_id);
                }
                
                db.query(updateInvoiceQuery, queryParams, (error, ivoResults) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Error updating the invoice in the database.' });
                    }
                    if (ivoResults.affectedRows === 0) {
                        return res.status(404).json({ message: 'Invoice not found.' });
                    }
                    return res.status(200).json({ message: 'Invoice successfully updated in the database.' });
                });
            });
        }
        else {
            if (queryParams.length === 0) {
                return res.status(400).json({ message: 'No valid fields provided for update.' });
            }

            updateInvoiceQuery = updateInvoiceQuery.slice(0, -2);
            updateInvoiceQuery += ' WHERE invoice_id = ?';
            queryParams.push(invoice_id);
            
            db.query(updateInvoiceQuery, queryParams, (error, ivoResults) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Error updating the invoice in the database.' });
                }
                if (ivoResults.affectedRows === 0) {
                    return res.status(404).json({ message: 'Invoice not found.' });
                }
                return res.status(200).json({ message: 'Invoice successfully updated in the database.' });
            });
        }
    });

    app.delete('/deleteInvoice/:invoice_id', (req, res) => {
        const invoiceID = req.params.invoice_id;

        const checkRelationQuery = 'SELECT * FROM Inventory WHERE invoice_id = ?';
        db.query(checkRelationQuery, [invoiceID], (error, relationResults) => {
            if (error) {
                return res.status(500).json({ message: 'Error checking if this invoice has inventory items connected to it.' });
            }
            if (relationResults.length > 0) {
                return res.status(400).json({ message: 'This invoice has an existing relationship with an inventory item in the database, please delete or update all inventory items with this invoice and try again.' });
            }
            else {
                const deleteQuery = 'DELETE FROM Invoices WHERE invoice_id = ?';
                db.query(deleteQuery, [invoiceID], (error, deleteResults) => {
                    if (error) {
                        return res.status(500).json({ message: 'Error deleting the invoice.' });
                    }
                    if (deleteResults.affectedRows === 0) {
                        return res.status(404).json({ message: 'Invoice not found.' });
                    }
                    return res.status(200).json({ message: 'Invoice successfully deleted in the database.' });
                });
            }
        });
    });
}