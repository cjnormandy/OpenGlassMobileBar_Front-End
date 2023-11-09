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
    const { service_name, service_price, service_description_1, service_description_2, service_description_3, included_services, image, drinkLimit } = req.body;
    const id = req.params.id;
    let updateQuery = 'UPDATE Services SET ';
    const values = [];

    if (service_name) {
      updateQuery += 'service_name = ?, ';
      values.push(service_name);
    }
    if (service_price) {
      updateQuery += 'service_price = ?, ';
      values.push(service_price);
    }
    if (service_description_1) {
      updateQuery += 'service_description_1 = ?, ';
      values.push(service_description_1);
    }
    if (service_description_2) {
      updateQuery += 'service_description_2 = ?, ';
      values.push(service_description_2);
    }
    if (service_description_3) {
      updateQuery += 'service_description_3 = ?, ';
      values.push(service_description_3);
    }
    if (included_services) {
      updateQuery += 'included_services = ?, ';
      const newServices = JSON.stringify(included_services);
      values.push(newServices);
    }
    if (image) {
      updateQuery += 'image = ?, ';
      values.push(image);
    }
    if (drinkLimit) {
      updateQuery += 'drinkLimit = ?, ';
      values.push(drinkLimit);
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
    const { service_name, service_price, service_description_1, service_description_2, service_description_3, included_services, image, drinkLimit } = req.body;
    const insertQuery = 'INSERT INTO Services (service_name, service_price, service_description_1, service_description_2, service_description_3, included_services, image, drinkLimit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(insertQuery, [service_name, service_price, service_description_1, service_description_2, service_description_3, JSON.stringify(included_services), image, drinkLimit], (error, results) => {
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

};
