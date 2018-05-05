var mysql = require("mysql"),
    inquire = require("inquirer"),
    cliTable = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "backend1279!",
    database: "slamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    productTable();
    connection.end();
});

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

var customerPrompt = function (res) {
    inquire.prompt([{
        type: 'input',
        name: 'choice',
        message: 'Please type the name of the item you wish to purchase [Quit with Q]'
    }]).then(function (answer) {
        var correct = false;
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == answer.choice) {
                correct = true;
                var product = answer.choice;
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
                }).then(function(answer) {
                    if ((res[id].stock_quantity - answer.quantity) > 0) {
                        connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity - answer.quantity) + "' WHERE item_id='" + product + "'", function(err, res2) {
                            console.log("Congratulations on your purchase!");
                            debugger;
                            productTable();
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