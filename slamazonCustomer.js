var mysql = require("mysql"),
    inquire = require("inquirer");

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
    makeTable();
    connection.end();
});

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
        message: 'Please select an item for purchase [Quit with Q]'
    }]).then(function (ans) {
        var correct = false;
        for (var i = 0; i < res.length; i++) {
            if (res[i].product_name == ans.choice) {
                correct = true;
                var product = ans.choice;
                var id = i;
            }
        }
    })
}