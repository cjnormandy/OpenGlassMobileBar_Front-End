module.exports = ({ app, db }) => {
  // Get all services
  app.get('/Services', (req, res) => {
    const getQuery = 'SELECT * FROM Services';
    db.query(getQuery, (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
      return res.status(200).json(results);
    });
  });

  // Update a service by ID
  app.put('/UpdateServices/:id', (req, res) => {
    const id = req.params.id;
    const updateFields = req.body;

    let updateQuery = 'UPDATE Services SET ';
    const values = [];

    for (const key in updateFields) {
      updateQuery += `${key}=?, `;
      values.push(updateFields[key]);
    }

    updateQuery = updateQuery.slice(0, -2);

    updateQuery += ' WHERE service_id=?';
    values.push(id);

    db.query(updateQuery, values, (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
      return res.status(200).json({ message: 'Service updated successfully' });
    });
  });

  // Add a new service
  app.post('/AddServices', (req, res) => {
    const { service_name, service_price, service_description_1, service_description_2, service_description_3, included_services } = req.body;
    const insertQuery = 'INSERT INTO Services (service_name, service_price, service_description_1, service_description_2, service_description_3, included_services) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(insertQuery, [service_name, service_price, service_description_1, service_description_2, service_description_3, JSON.stringify(included_services)], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
      return res.status(201).json({ message: 'Service added successfully' });
    });
  });

  // Delete a service by ID
  app.delete('/DeleteServices/:id', (req, res) => {
    const id = req.params.id;
    const deleteQuery = 'DELETE FROM Services WHERE service_id=?';

    db.query(deleteQuery, [id], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
      return res.status(200).json({ message: 'Service deleted successfully' });
    });
  });

  // Import routes for FAQs
  //servicesRoutes({ app, db });
};
