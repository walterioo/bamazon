var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table3");
var colors = require("colors");
var Validation = require("./helpers/validation");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
})

function startApp() {
    console.log("---------- Welcome to Bamazon CLI Manager Edition ----------");
    managerDisplay();
}

function managerDisplay() {
    inquirer.prompt({
        type: "list",
        message: "Select an option from the menu",
        name: "choice",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
    }).then(answer => {
        switch (answer.choice) {
            case "View Products for Sale":
                displayStock();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                getProductList();
                break;
            case "Add New Product":
                newProduct();
                break;
            case "Quit":
                console.log("Thanks for using Bamazon Manager Edition".magenta);
                connection.end();
                break;
        }
    })
}

function displayStock() {
    var query = "SELECT * FROM bamazon.products";
    var table = new Table({
        head: ['Id', 'Product Name', 'Deparment', 'Price', 'Stock'],
        style: {
            head: ["white"]
        },
        colWidths: [4, 40, 25, 10, 10]
    });

    connection.query(query, function (err, res) {
        var productData = [];
        for (var i = 0; i < res.length; i++) {
            productData.push(res[i].product_name);
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name,
                    res[i].price, res[i].stock_quantity
                ]);
        }
        console.log(table.toString());
        managerDisplay();
    })
}

function lowInventory() {
    var table = new Table({
        head: [],
        colWidths: [4, 40, 25, 10, 10]
    })
    table.push([{
            colSpan: 5,
            hAlign: "center",
            content: "Low Inventory Products".bgRed.white
        }],
        ['Id'.cyan, 'Product Name'.cyan, 'Deparment'.cyan, 'Price'.cyan, 'Stock'.cyan])
    connection.query(
        "SELECT * FROM bamazon.products WHERE stock_quantity BETWEEN 0 and 15",
        function (err, res) {
            for (var i = 0; i < res.length; i++) {
                table.push([
                    res[i].item_id, res[i].product_name, res[i].department_name,
                    res[i].price, colors.red(res[i].stock_quantity)
                ]);
            }
            console.log(table.toString());
            managerDisplay();
        })
}

function getProductList() {
    var productList = [];
    connection.query(
        "SELECT * FROM bamazon.products",
        function (err, res) {
            for (let i = 0; i < res.length; i++) {
                productList.push(res[i].product_name);
            }
            addInventory(productList);
        }
    )
}

function addInventory(productList) {
    inquirer.prompt([{
            type: "list",
            message: "Select the product to add inventory to",
            name: "product",
            choices: productList
        },
        {
            type: "input",
            message: "How many new items will be added to inventory?",
            name: "inventory",
            validate: (value) => {
                var validation = new Validation(value);
                return validation.numberValidate();
            }
        }
    ]).then(answer => {
        var currentStock = 0;
        var newStock = 0;
        connection.query(
            "SELECT stock_quantity FROM products where product_name = ?", answer.product,
            function (err, res) {
                currentStock = res[0].stock_quantity;
                newStock = parseInt(currentStock) + parseInt(answer.inventory);
                //calls this functon to update the stock
                updateStock(newStock, answer);
            })
    })
}

function updateStock(newStock, answer) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: newStock
        }, {
            product_name: answer.product
        }],
        function (error) {
            if (error) throw error;
            console.log(
                ('Added: ' + answer.inventory + " new items to " + answer.product +
                    ", New stock is: " + newStock).yellow);
            managerDisplay();
        }
    )
}

function newProduct() {
    inquirer.prompt([{
            type: "input",
            message: "Enter the new product name",
            name: "newProduct",
            validate: (value) => {
                var validation = new Validation(value);
                return validation.textValidate();
            }
        },
        {
            type: "input",
            message: "Enter the new product department",
            name: "newDept",
            validate: (value) => {
                var validation = new Validation(value);
                return validation.textValidate();
            }
        },
        {
            type: "input",
            message: "Enter the new product price",
            name: "newPrice",
            validate: (value) => {
                var validation = new Validation(value);
                return validation.numberValidate();
            }
        },
        {
            type: "input",
            message: "Enter the new product initial stock",
            name: "newStock",
            validate: (value) => {
                var validation = new Validation(value);
                return validation.numberValidate();
            }
        }
    ]).then(function (answer) {
        connection.query(
            "INSERT INTO products  SET ?", {
                product_name: answer.newProduct,
                department_name: answer.newDept,
                price: answer.newPrice,
                stock_quantity: answer.newStock
            },
            function (err) {
                if (err) console.log(err);
                console.log("New Product successfully created");
                managerDisplay();
            }
        )
    })
}
startApp();