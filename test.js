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
                        connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity - ans.quantity) + "' WHERE product_name='" + product + "'", function(err, res2) {
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