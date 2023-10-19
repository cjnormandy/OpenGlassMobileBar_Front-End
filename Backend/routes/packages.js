module.exports = ({ app, db }) => {
  app.get('/packages', (req, res) => {
    const getQuery = 'SELECT * FROM Services'
    db.query(getQuery, (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: 'Internal server error' });
        }
        return res.status(200).json(results);
      });
  });
};
