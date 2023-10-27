module.exports = ({ app, db }) => {
    //returns all drinks with an active status to be displayed on the menu
    app.get('/drinks', (req, res) => {
      const active_status = 'Active';
      const getQuery = 'SELECT * FROM Drinks WHERE drink_status = ?';
      db.query(getQuery, [active_status], (error, results) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
          }
          return res.status(200).json(results);
        });
    });

    app.get('/admin/drinks', (req, res) => {
      const selectQuery = `SELECT d.drink_id, d.drink_name, d.drink_type, d.drink_description,
      a.alcohol_name, a.alcohol_type,
      i.inventory_name, i.inventory_type
      FROM Drinks d
      INNER JOIN Alcohol_Drinks ad ON d.drink_id = ad.drink_id
      INNER JOIN Alcohol a ON ad.alcohol_id = a.alcohol_id
      INNER JOIN Inventory_Drinks id ON d.drink_id = id.drink_id
      INNER JOIN Inventory i ON id.inventory_id = i.inventory_id
      WHERE d.drink_status = 'Active';`
      db.query(selectQuery, (error, results) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
          }
          const drinks = [];
          results.forEach((row)=> {
            if (!drinks[row.drink_id]) {
              drinks[row.drink_id] = {
                drink_id: row.drink_id,
                drink_name: row.drink_name,
                drink_type: row.drink_type,
                drink_description: row.drink_description,
                alcohol: [],
                inventory: []
              };
            }
            if (row.alcohol_name && !drinks[row.drink_id].alcohol.some((a) => a.alcohol_name === row.alcohol_name)) {
              drinks[row.drink_id].alcohol.push({
                alcohol_name: row.alcohol_name,
                alcohol_type: row.alcohol_type
              });
            }
            if (row.inventory_name && !drinks[row.drink_id].inventory.some((i) => i.inventory_name === row.inventory_name)) {
              drinks[row.drink_id].inventory.push({
                inventory_name: row.inventory_name,
                inventory_type: row.inventory_type
              });
            }
          });
          const resultArr = Object.values(drinks);
          return res.status(200).json(resultArr);
        });
    });


    /*creates a drink in the drinks table and checks to see if the alcohol name and type provided are in the alcohol table then it create a new relationship
    between the drink and alcohol by id in the alcohol_drinks table, if the alcohol name and type is not in the alcohol table it will create a new alcohol entry with the name and type
    provided and then create the relationship between the newly created drink and alcohol. Repeats this process for the inventory table with the ingredients provided*/
    app.post('/addDrink', (req, res) => {
        const { name, type, desc, alcohol, ingredients} = req.body;
        const status = 'Active';

        if (!name || !type || !desc || !alcohol || !ingredients) {
            return res.status(400).json({ message: 'All fields are required to add a drink to the menu.' });
        }

        const insertQuery = 'INSERT INTO Drinks (drink_name, drink_type, drink_description, drink_status) VALUES (?, ?, ?, ?)';
        const dValues = [name, type, desc, status];

        db.query(insertQuery, dValues, (error, dResults) => {
            if (error) {
              console.log(error);
              return res.status(500).json({ message: 'Error adding drink to the menu.' });
            }
            const drinkID = dResults.insertId;
            //console.log(drinkID);
            processAlc(alcohol, drinkID, () => {
              processInv(ingredients, drinkID, () => {
                return res.status(201).json({ message: 'Drink added to the menu successfully.'});
              });
            });            
        });

        function processAlc(alcoholList, drinkID, callback) {
          //console.log(drinkID);
          function processAlcItem(index) {
            if (index >= alcoholList.length) {
              callback();
            }
            else {
              const alcData = alcoholList[index];
              const getAlcQuery = 'SELECT * FROM Alcohol WHERE alcohol_name = ? AND alcohol_type = ?';

              db.query(getAlcQuery, [alcData.name, alcData.type], (error, existAlc) => {
                if (error) {
                  return res.status(500).json({ message: 'Error checking if the alcohol used in the drink exists in the database.'});
                }

                if (existAlc.length > 0) {
                  const alcID = existAlc[0].alcohol_id;
                  //console.log(alcID);
                  updateAlcRelationship(drinkID, alcID, () => {
                    processAlcItem(index + 1);
                  });
                }
                else {
                  const addAlcQuery = 'INSERT INTO Alcohol (alcohol_name, alcohol_type) VALUES (?, ?)';
                  db.query(addAlcQuery, [alcData.name, alcData.type], (error, newAlc) => {
                    if (error) {
                      return res.status(500).json({ message: 'Error adding a new alcohol to the database.'});
                    }
                    const alcID = newAlc.insertId;
                    //console.log(alcID);
                    updateAlcRelationship(drinkID, alcID, () => {
                      processAlcItem(index + 1);
                    });
                  });
                }
              });
            }
          }

          processAlcItem(0);
        }

        function processInv(invList, drinkID, callback) {
          //console.log(drinkID);
          function processInvItem(index) {
            if (index >= invList.length) {
              callback();
            }
            else {
              const invData = invList[index];
              const getInvQuery = 'SELECT * FROM Inventory WHERE inventory_name = ? AND inventory_type = ?';

              db.query(getInvQuery, [invData.name, invData.type], (error, existInv) => {
                if (error) {
                  return res.status(500).json({ message: 'Error checking if the ingredient used in the drink exists in the database.'});
                }

                if (existInv.length > 0) {
                  const invID = existInv[0].inventory_id;
                  updateInvRelationship(drinkID, invID, () => {
                    processInvItem(index + 1);
                  });
                }
                else {
                  const addInvQuery = 'INSERT INTO Inventory (inventory_name, inventory_type, inventory_quantity) VALUES (?, ?, ?)';
                  const zero = 0;
                  db.query(addInvQuery, [invData.name, invData.type, zero], (error, newInv) => {
                    if (error) {
                      return res.status(500).json({ message: 'Error adding a new ingredient to the database.'});
                    }
                    const invID = newInv.insertId;
                    updateInvRelationship(drinkID, invID, () => {
                      processInvItem(index + 1);
                    });
                  });
                }
              });
            }
          }

          processInvItem(0);
        }

        function updateAlcRelationship(drinkID, alcID, callback) {
          const updateAlcRelationQuery = 'INSERT INTO Alcohol_Drinks (drink_id, alcohol_id) VALUES (?, ?)';
          db.query(updateAlcRelationQuery, [drinkID, alcID], (error)=> {
            if (error) {
              console.log(error);
              return res.status(500).json({ message: 'Error updating the relationship between drink and alcohol.'});
            }
            callback();
          });
        }

        function updateInvRelationship(drinkID, invID, callback) {
          const updateInvRelationQuery = 'INSERT INTO Inventory_Drinks (drink_id, inventory_id) VALUES (?, ?)';
          db.query(updateInvRelationQuery, [drinkID, invID], (error) => {
            if (error) {
              console.log(error);
              return res.status(500).json({ message: 'Error updating the relationship between drink and ingredient.'});
            }
            callback();
          });
        }
      });

  
      //update the drinks name, type, or description
    app.put('/updateDrink/:drink_id', (req, res) => {
      const { name, type, desc, alcohol, ingredients} = req.body;
      const drink_id = req.params.drink_id;
      let updatedFields = '';

      if (!name && !type && !desc && !alcohol && !ingredients) {
        return res.status(400).json({ message: 'No fields provided for update!' })
      }

      if (name || type || desc) {
        if (name) updatedFields += 'drink_name = ?, ';
        if (type) updatedFields += 'drink_type = ?, ';
        if (desc) updatedFields += 'drink_description = ?, ';

        updatedFields = updatedFields.slice(0, -2);

        const updateDrinkQuery = `UPDATE Drinks SET ${updatedFields} WHERE drink_id = ?`;
        const updateDrinkValues = [];

        if (name) updateDrinkValues.push(name);
        if (type) updateDrinkValues.push(type);
        if (desc) updateDrinkValues.push(desc);

        updateDrinkValues.push(drink_id);

        db.query(updateDrinkQuery, updateDrinkValues, (error) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error updating the drink in the menu.' });
          }
        });
      }

      if (alcohol || ingredients) {
        if (alcohol && ingredients) {
          processUpAlc(alcohol, drink_id, () => {
            processUpInv(ingredients, drink_id, () => {
              return res.status(200).json({ message: 'Drink updated successfully in the menu.'});
            });
          });
        }
        if (alcohol && !ingredients) {
          processUpAlc(alcohol, drink_id, () =>{
            return res.status(200).json({ message: 'Drink updated successfully in the menu.'});
          });
        }
        if (!alcohol && ingredients) {
          processUpInv(ingredients, drink_id, () =>{
            return res.status(200).json({ message: 'Drink updated successfully in the menu.'});
          });
        }
      }
      else {
        return res.status(200).json({ message: 'Drink updated successfully in the menu.'});
      }

      

      function processUpAlc(alcoholList, drinkID, callback) {
        //console.log(drinkID);
        function processUpAItem(index) {
          if (index >= alcoholList.length) {
            callback();
          }
          else {
            const alcData = alcoholList[index];
            const getAlcQuery = 'SELECT * FROM Alcohol WHERE alcohol_name = ? AND alcohol_type = ?';

            db.query(getAlcQuery, [alcData.name, alcData.type], (error, existAlc) => {
              if (error) {
                return res.status(500).json({ message: 'Error checking if the alcohol used in the drink exists in the database.'});
              }

              if (existAlc.length > 0) {
                const alcID = existAlc[0].alcohol_id;
                //console.log(alcID);
                upAlcRelationship(drinkID, alcID, () => {
                  processUpAItem(index + 1);
                });
              }
              else {
                const addAlcQuery = 'INSERT INTO Alcohol (alcohol_name, alcohol_type) VALUES (?, ?)';
                db.query(addAlcQuery, [alcData.name, alcData.type], (error, newAlc) => {
                  if (error) {
                    return res.status(500).json({ message: 'Error adding a new alcohol to the database.'});
                  }
                  const alcID = newAlc.insertId;
                  //console.log(alcID);
                  upAlcRelationship(drinkID, alcID, () => {
                    processUpAItem(index + 1);
                  });
                });
              }
            });
          }
        }

        processUpAItem(0);
      }

      function processUpInv(invList, drinkID, callback) {
        //console.log(drinkID);
        function processUpInItem(index) {
          if (index >= invList.length) {
            callback();
          }
          else {
            const invData = invList[index];
            const getInvQuery = 'SELECT * FROM Inventory WHERE inventory_name = ? AND inventory_type = ?';

            db.query(getInvQuery, [invData.name, invData.type], (error, existInv) => {
              if (error) {
                return res.status(500).json({ message: 'Error checking if the ingredient used in the drink exists in the database.'});
              }

              if (existInv.length > 0) {
                const invID = existInv[0].inventory_id;
                upInvRelationship(drinkID, invID, () => {
                  processUpInItem(index + 1);
                });
              }
              else {
                const addInvQuery = 'INSERT INTO Inventory (inventory_name, inventory_type, inventory_quantity) VALUES (?, ?, ?)';
                const zero = 0;
                db.query(addInvQuery, [invData.name, invData.type, zero], (error, newInv) => {
                  if (error) {
                    return res.status(500).json({ message: 'Error adding a new ingredient to the database.'});
                  }
                  const invID = newInv.insertId;
                  upInvRelationship(drinkID, invID, () => {
                    processUpInItem(index + 1);
                  });
                });
              }
            });
          }
        }

        processUpInItem(0);
      }

      function upAlcRelationship(drinkID, alcID, callback) {
        const selAlcRelationQuery = 'SELECT * FROM Alcohol_Drinks WHERE drink_id = ? AND alcohol_id = ?';
        db.query(selAlcRelationQuery, [drinkID, alcID], (error, existAlcRel)=> {
          if (error) {
            return res.status(500).json({ message: 'Error checking drink-alcohol relationship existence' });
          }
          //console.log(existAlcRel.length);

          if (existAlcRel.length === 0) {
            const updateAlcRelationQuery = 'INSERT INTO Alcohol_Drinks (drink_id, alcohol_id) VALUES (?, ?)';
            db.query(updateAlcRelationQuery, [drinkID, alcID], (error)=> {
              if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error updating the relationship between drink and alcohol.'});
              }
            });
          }
          callback();
        });
      }

      function upInvRelationship(drinkID, invID, callback) {
        const selInvRelationQuery = 'SELECT * FROM Inventory_Drinks WHERE drink_id = ? AND inventory_id = ?';
        db.query(selInvRelationQuery, [drinkID, invID], (error, existInvRel)=> {
          if(error) {
            return res.status(500).json({ message: 'Error checking drink-ingredient relationship existence' });
          }
          //console.log(existInvRel.length);

          if(existInvRel.length === 0) {
            const updateInvRelationQuery = 'INSERT INTO Inventory_Drinks (drink_id, inventory_id) VALUES (?, ?)';
            db.query(updateInvRelationQuery, [drinkID, invID], (error) => {
              if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error updating the relationship between drink and ingredient.'});
              }
            });
          }
          callback();
        });
      }
    });


    //instead of deleting the drink this sets it's status to inactive and it will no longer be displayed on the drink menu
    app.put('/deleteDrink/:drink_id', (req, res) => {
      const drink_id = req.params.drink_id;
      let deleteQuery = 'UPDATE Drinks SET drink_status = ?';
      const values = [];

      const inactive_status = 'Inactive';
      values.push(inactive_status);

      deleteQuery += ' WHERE drink_id = ?';
      values.push(drink_id);

      db.query(deleteQuery, values, (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: 'Error deleting drink from the menu.' });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Drink was not found in the menu.' });
        }

        return res.status(200).json({ message: 'Drink deleted from the menu successfully.' });
      });
   });
};