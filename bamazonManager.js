var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    inquirer.prompt([{
        type: "list",
        name: "option",
        message: "Select action to perform...",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory"
        ]
    }]).then(function (res) {
        console.log(res);
        switch (res.option) {
            case "View Products for Sale":
                connection.query('SELECT * FROM products', function (error, results, fields) {
                    if (error) throw error;
                    console.log("Displaying available items for sale...\n----------------------------------------------");
                    for (var i = 0; i < results.length; i++) {
                        console.log("ID: " + results[i].item_id + "\nItem Name: " + results[i].product_name + "\nPrice: $" + results[i].price + "\nQuantity: " + results[i].stock_quantity);
                        console.log("----------------------------------------------")
                    }
                });
                break;

            case "View Low Inventory":
                connection.query('SELECT * FROM products WHERE stock_quantity < 50', function (error, results, fields) {
                    if (error) throw error;
                    console.log("Displaying Items with inventory less than 50\n------------------------------------------------:")
                    for (var i = 0; i < results.length; i++) {
                        console.log("ID: " + results[i].item_id + "\nItem Name: " + results[i].product_name + "\nPrice: $" + results[i].price + "\nQuantity: " + results[i].stock_quantity);
                        console.log("----------------------------------------------")
                    }
                });
                break;

            case "Add to Inventory":
                connection.query('SELECT * FROM products', function (error, results, fields) {
                    var itemChoices = [];
                    for (var i = 0; i < results.length; i++) {
                        itemChoices.push(results[i].product_name);
                    }
                    inquirer.prompt([{
                        type: "list",
                        name: "option",
                        message: "Which item would you like to resupply?",
                        choices: itemChoices
                    }]).then(function (res) {
                        inquirer.prompt([{
                            type: "input",
                            name: "quantity",
                            message: "How many " + res.option + "s would you like to restock?"
                        }]).then(function (resu) {
                            var query = "UPDATE products SET stock_quantity = stock_quantity +? WHERE product_name =?"
                            connection.query(query, [resu.quantity, res.option], function (err, res) {
                                if (error) throw error;
                                console.log("Restock Successful");
                            });
                        });
                    });
                });
                break;
        }
    });
});