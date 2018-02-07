var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors")

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function (err) {

  if (err) throw err;

});

function displayInventory() {

     connection.query('SELECT * FROM products', function(err, inventory) {

      if (err) throw err;
               console.log("Welcome to Bamazon! \nPlease have a look at our current inventory:".magenta.bold);

               for(var i = 0; i < inventory.length; i++) {

                  console.log("-----------------------------------------")
                  console.log("Item ID: ".bold + inventory[i].item_id + "\nProduct: ".bold+ inventory[i].product_name + "\nDepartment: ".bold+ inventory[i].department_name + "\nPrice: ".bold+  inventory[i].price + "\nQuantity: ".bold+ inventory[i].stock_quantity);
          }

          inquirer.prompt([

            {
              type: "input",
              message: "What is the id of the item you would like to buy?",
              name: "item_id"
            },

               {
              type: "input",
              message: "How many would you like to buy?",
              name: "quantity"
            }

         
          ]).then(function(order) {

                    var quantity = order.quantity;
                    var itemId = order.item_id;
                    connection.query('SELECT * FROM products WHERE item_id=' + itemId, function(err, selectedItem) {
                      if (err) throw err;
                         if (selectedItem[0].stock_quantity - quantity >= 0) {
        
                              console.log("Quantity in Stock: ".green + selectedItem[0].stock_quantity + "\nOrder Quantity: ".green + quantity);
                              console.log("You will be charged ".green + (order.quantity * selectedItem[0].price) +  " dollars.  Thank you for shopping at Bamazon!".green);
                           
                              connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [selectedItem[0].stock_quantity - quantity, itemId],
                              function(err, inventory) {
                                if (err) throw err;
                          
                              });  

                         }

                         else {
                              console.log("Insufficient quantity!  Please order less of that item, as Bamazon only has ".red + selectedItem[0].stock_quantity + " " + selectedItem[0].product_name.red + " in stock at this moment.".red);
                              displayInventory();
                         }
                    });
          });
     });
}

displayInventory();