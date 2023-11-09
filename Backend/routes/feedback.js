module.exports = ({ app, db }) => {
    // Get all feedback
    app.get('/feedback', (req, res) => {
        const getQuery = 'SELECT * FROM Feedback';
        db.query(getQuery, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json(results);
        });
    });

    // Create new feedback
    app.post('/Createfeedback', (req, res) => {
        const { feedback_description, feedback_rating, customer_id, employee_id } = req.body;
        const insertQuery = 'INSERT INTO Feedback (feedback_description, feedback_rating, customer_id, employee_id) VALUES (?, ?, ?, ?)';

        db.query(insertQuery, [feedback_description, feedback_rating, customer_id, employee_id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(201).json({ message: 'Feedback added successfully' });
        });
    });

    // Update feedback by ID
    app.put('/Updatefeedback/:id', (req, res) => {
        const id = req.params.id;
        const { feedback_description, feedback_rating, customer_id, employee_id } = req.body;

        const updateFields = {};

        if (feedback_description) {
            updateFields.feedback_description = feedback_description;
        }

        if (feedback_rating) {
            updateFields.feedback_rating = feedback_rating;
        }

        if (customer_id) {
            updateFields.customer_id = customer_id;
        }

        if (employee_id) {
            updateFields.employee_id = employee_id;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const updateQuery = 'UPDATE Feedback SET ? WHERE feedback_id=?';

        db.query(updateQuery, [updateFields, id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.status(200).json({ message: 'Feedback updated successfully' });
        });
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
