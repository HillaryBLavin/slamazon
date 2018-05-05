// Without cli-table
var makeTable = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("\nWelcome to Slamazon!\n");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " || " + res[i].product_name + " || " + res[i].department_name + " || " + "$" + res[i].price + " || " + res[i].stock_quantity + "\n");
        }
        customerPrompt(res);
    })
}

var customerPrompt = function (res) {
    inquire.prompt([{
        type: 'input',
        name: 'choice',
        message: 'Please type the name of the item you wish to purchase [Quit with Q]'
    }]).then(function (ans) {
        var correct = false;
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == ans.choice) {
                correct = true;
                var product = ans.choice;
                var id = i;
                inquire.prompt({
                    type: 'input',
                    name: 'quantity',
                    message: 'How many would you like to purchase?',
                    validate: function(val) {
                        if (isNaN(val) == false) {
                            return true; 
                        } else {
                            return false;
                        }
                    }
                }).then(function(ans) {
                    if ((res[id].stock_quantity - ans.quantity) > 0) {
                        connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity - ans.quantity) + "' WHERE item_id='" + product + "'", function(err, res2) {
                            console.log("Congratulations on your purchase!");
                            debugger;
                            makeTable();
                        })
                    } else {
                        console.log("Not a valid selection! Please try again.");
                        customerPrompt(res);
                    }
                })
            }
        }
    })
}


// With cli-table
var productTable = function() {
    console.log("\n************************** Welcome to Slamazon! **************************\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        var table = new cliTable({
            head: ['Item #', 'Product', 'Store Department', 'Price', 'In Stock'],
            colWidths: [10, 50, 20, 10, 10],
        });
        for (var i = 0; i < res.length; i++) {
            table.push([
                res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity
            ]);
        };
        console.log(table.toString());
        customerPrompt();
    });
};

var customerPrompt = function(res) {
    inquire.prompt([{
        type: 'input',
        message: 'Please enter the Item # of the product you wish to purchase',
        name: 'chooseItm'
    }]).then(function (userChoice) {
        var correct = false;
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == userChoice.chooseItem) {
                correct = true; 
                var product = userChoice.chooseItem;
                inquire.prompt({
                    type: 'input',
                    message: 'How many would you like to purchase?',
                    name: 'qty',
                    validate: function(val) {
                        if (isNaN(val) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(userOrder) {
                    if ((res[i].stock_quantity - userOrder.qty) > 0) {
                        var updateQty = parseInt(res[i].stock_quantity) - parseInt(userOrder.qty);
                        var orderTotal = parseFloat(res[i].price) * parseFloat(userOrder.qty),
                            orderTotal = orderTotal.toFixed(2);
                        connection.query("UPDATE products SET ? WHERE ?",
                        [{
                            stock_quantity: updateQty
                        }, {
                            item_id: product
                        }], function (error, results) {
                            if (error) throw error;
                            console.log("Congratulations on your order! Your total is: $" + orderTotal + "\n");
                            productTable();
                        });
                    } else {
                        console.log("Not a valid selection! Please try again.");
                        customerPrompt(res);
                    }
                });
            }
        }
    });
}

