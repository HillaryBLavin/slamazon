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
    console.log("\n************************** Welcome to Slamazon! **************************\n");
    productTable();
});

var productTable = function() {
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

var customerPrompt = function() {
    inquire.prompt([
        {
            type: 'input',
            message: 'Please enter the Item # of the product you wish to purchase.',
            name: 'choice'
        },
        {
            type: 'input',
            message: "How many would you like to purchase?",
            name: 'qty'
        }
    ]).then(function(order) {
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            var i = order.choice - 1; 
            if(res[i].stock_quantity >= order.qty) {
                var updateQty = parseInt(res[i].stock_quantity) - parseInt(order.qty);
                var total = parseFloat(res[i].price) * parseFloat(order.qty);
                    total = total.toFixed(2);
                connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity: updateQty}, {item_id: order.choice}], function(error, results) {
                    if (error) throw error; 
                    console.log("Congratulations on your purchase! Your total comes to $ " + total + "\n");
                    continueShopping();
                });
            } else {
                console.log("We apologize for the inconvenience, but we do not have enough stock to fulfill your order. Please make another selection.");
                productTable();
            }
        });
    });
}

function continueShopping() {
    inquire.prompt([
        {
            type: 'confirm',
            message: 'Would you like to continue shopping?',
            name: 'continue'
        }
    ]).then(function (shopping) {
        if (shopping.continue) {
            productTable();
        } else {
            exitSlamazon();
        }
    });
}

function exitSlamazon() {
    connection.end();
    console.log("\n**************************Thanks for shopping! See you soon! **************************\n");
}