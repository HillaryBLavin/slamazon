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

