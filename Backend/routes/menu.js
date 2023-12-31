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

    //gets all of the drinks information including the alcohol bases and inventory ingredients and organizes the json response to eliminate repeats of alc or inv and places them into arrays
    app.get('/admin/drinks', (req, res) => {
      const selectQuery = `SELECT d.drink_id, d.drink_name, d.drink_type, d.drink_description, d.drink_status, d.drink_image,
      a.alcohol_name, a.alcohol_type,
      i.inventory_name, i.inventory_type
      FROM Drinks d
      INNER JOIN Alcohol_Drinks ad ON d.drink_id = ad.drink_id
      INNER JOIN Alcohol a ON ad.alcohol_id = a.alcohol_id
      INNER JOIN Inventory_Drinks id ON d.drink_id = id.drink_id
      INNER JOIN Inventory i ON id.inventory_id = i.inventory_id;`;
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
                drink_status: row.drink_status,
                drink_image: row.drink_image,
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


    /*creates a drink in the drinks table and checks to see if the alcohol name and type provided are in the alcohol table then it create a new relationship
    between the drink and alcohol by id in the alcohol_drinks table, if the alcohol name and type is not in the alcohol table it will create a new alcohol entry with the name and type
    provided and then create the relationship between the newly created drink and alcohol. Repeats this process for the inventory table with the ingredients provided*/
    app.post('/addDrink', (req, res) => {
        const { name, type, desc, image, alcohol, ingredients} = req.body;
        const status = 'Active';

        if (!name || !type || !desc || !image || !alcohol || !ingredients) {
            return res.status(400).json({ message: 'All fields are required to add a drink to the menu.' });
        }

        const insertQuery = 'INSERT INTO Drinks (drink_name, drink_type, drink_description, drink_status, drink_image) VALUES (?, ?, ?, ?, ?)';
        const dValues = [name, type, desc, status, image];

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
      });

  
    //update the drinks name, type, description, alcohol bases, or ingredients
    app.put('/updateDrink/:drink_id', (req, res) => {
      const { name, type, desc, image, alcohol, ingredients} = req.body;
      const drink_id = req.params.drink_id;
      let updatedFields = '';

      if (!name && !type && !desc && !image && !alcohol && !ingredients) {
        return res.status(400).json({ message: 'No fields provided for update!' });
      }

      if (name || type || desc || image) {
        if (name) updatedFields += 'drink_name = ?, ';
        if (type) updatedFields += 'drink_type = ?, ';
        if (desc) updatedFields += 'drink_description = ?, ';
        if (image) updatedFields += 'drink_image = ?, ';

        updatedFields = updatedFields.slice(0, -2);

        const updateDrinkQuery = `UPDATE Drinks SET ${updatedFields} WHERE drink_id = ?`;
        const updateDrinkValues = [];

        if (name) updateDrinkValues.push(name);
        if (type) updateDrinkValues.push(type);
        if (desc) updateDrinkValues.push(desc);
        if (image) updateDrinkValues.push(image);

        updateDrinkValues.push(drink_id);

        db.query(updateDrinkQuery, updateDrinkValues, (error, drinkResults) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error updating the drink in the menu.' });
          }
          if (drinkResults.affectedRows === 0) {
            return res.status(400).json({ message: 'Drink not found.' });
          }
          if (alcohol || ingredients) {
            if (alcohol && ingredients) {
              processAlc(alcohol, drink_id, () => {
                processInv(ingredients, drink_id, () => {
                  return res.status(200).json({ message: 'Drink updated successfully in the menu.'});
                });
              });
            }
            if (alcohol && !ingredients) {
              processAlc(alcohol, drink_id, () =>{
                return res.status(200).json({ message: 'Drink updated successfully in the menu.'});
              });
            }
            if (!alcohol && ingredients) {
              processInv(ingredients, drink_id, () =>{
                return res.status(200).json({ message: 'Drink updated successfully in the menu.'});
              });
            }
          }
          else {
            return res.status(200).json({ message: 'Drink updated successfully in the menu.'});
          }
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


   app.put('/reactivateDrink/:drink_id', (req, res) => {
    const drink_id = req.params.drink_id;
    let activeQuery = 'UPDATE Drinks SET drink_status = ?';
    const values = [];

    const inactive_status = 'Active';
    values.push(inactive_status);

    activeQuery += ' WHERE drink_id = ?';
    values.push(drink_id);

    db.query(activeQuery, values, (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error reactivaing the drink in the database.' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Drink was not found in the menu.' });
      }

      return res.status(200).json({ message: 'Drink successfully reactivated in the database..' });
    });
 });

   //user can delete the relationships between a drink and the bases or invgredients one at a time so the alcohol item or inventory item can then be deleted on other pages of app
   app.delete('/deletedrinkrelationship/:drink_id', (req, res)=> {
    const drink_id = req.params.drink_id;
    const alcohol_name = req.body.alcohol_name;
    const inventory_name = req.body.inventory_name;

    if (!alcohol_name && !inventory_name) {
      return res.status(400).json({ message: 'Please provide either the alcohol_name or inventory_name to delete its relationship with the drink.' });
    }

    if (alcohol_name && inventory_name) {
      return res.status(400).json({ message: 'Can only delete one relationship at a time please enter either the alcohol_name or inventory_name to delete its relationship with the drink.' });
    }
    
    const deleteRelationship = (type, type_id, type_name, value, callback) => {
      const searchQuery = `SELECT ${type_id} FROM ${type} WHERE ${type_name} = ?`;

      db.query(searchQuery, [value], (error, results) => {
        if (error) {
          return res.status(500).json({ message: `Error searching for ${type_id} based on ${type_name} given.` });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: `${type} item not found based on ${type_name} given.` });
        }

        let typeID = '';
        if (type_id === 'alcohol_id') {
          typeID = results[0].alcohol_id;
        }
        if (type_id === 'inventory_id') {
          typeID = results[0].inventory_id;
        }

        const deleteRelationshipQuery = `DELETE FROM ${type}_Drinks WHERE drink_id = ? AND ${type_id} = ?`;

        db.query(deleteRelationshipQuery, [drink_id, typeID], (error) => {
          if (error) {
            return res.status(500).json({ message: `Error deleting the relationship in ${type}_drinks` });
          }
          callback();
        });
      });
    };

    if (alcohol_name) {
      deleteRelationship('Alcohol', 'alcohol_id', 'alcohol_name', alcohol_name, () => {
        return res.status(200).json({ message: 'Alcohol relationship successfully deleted in the Alcohol_Drinks relationship table.' });
      });
    }

    if (inventory_name) {
      deleteRelationship('Inventory', 'inventory_id', 'inventory_name', inventory_name, () => {
        return res.status(200).json({ message: 'Inventory relationship successfully deleted in the Inventory_Drinks relationship table.' });
      });
    }

   });
};