module.exports = ({ app, db }) => {
    app.get('/inventory', (req, res) => {
        const getQuery = `SELECT i.inventory_id, i.inventory_name, i.inventory_type, i.inventory_size, i.inventory_price, i.inventory_quantity,
        ivo.invoice_id, ivo.invoice_date, s.supplier_id, s.supplier_name
        FROM Inventory i
        INNER JOIN Invoices ivo ON i.invoice_id = ivo.invoice_id
        INNER JOIN Suppliers s ON ivo.supplier_id = s.supplier_id
        ORDER BY i.inventory_id ASC;`;
        db.query(getQuery, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            const inventory = [];
            results.forEach((row)=> {
                const date = row.invoice_date;
                const trimDate = date.toISOString().split('T')[0];
                inventory[row.inventory_id] = {
                    inventory_id: row.inventory_id,
                    inventory_name: row.inventory_name,
                    inventory_type: row.inventory_type,
                    inventory_size: row.inventory_size,
                    inventory_price: row.inventory_price,
                    inventory_quantity: row.inventory_quantity,
                    invoice_id: row.invoice_id,
                    invoice_date: trimDate,
                    supplier_id: row.supplier_id,
                    supplier_name: row.supplier_name
                }
            });
            const resultArr = Object.values(inventory);
            return res.status(200).json(resultArr);
        });
    });

    app.post('/addInvItem', (req, res) => {
        const { name, type, size, price, quantity, invoiceID} = req.body;

        if (!name || !type || !size || !price || !quantity || !invoiceID) {
            return res.status(400).json({ message: 'All fields are required to add an inventory item.' });
        }
        const invoiceQuery = 'SELECT * FROM Invoices WHERE invoice_id = ?';
        
        db.query(invoiceQuery, invoiceID, (error, ivoResults) => {
            if (error) {
                return res.status(500).json({ message: 'Error checking if the invoice exists in the database.'});
            }
            if (ivoResults.length === 0) {
                return res.status(404).json({ message: 'The invoice you are trying to connect the new inventory item to does not exist.' });
            }
            else {
                const insertQuery = 'INSERT INTO Inventory (inventory_name, inventory_type, inventory_size, inventory_price, inventory_quantity, invoice_id) VALUES (?, ?, ?, ?, ?, ?)';
                const invVal = [name, type, size, price, quantity, invoiceID];
                db.query(insertQuery, invVal, (error, invResults) => {
                    if (error) {
                        return res.status(500).json({ message: 'Error adding inventory item to the database.' });
                    }
                    return res.status(201).json({ message: 'Inventory item added to the database successfully.'});
                });
            }
        });
    });



}