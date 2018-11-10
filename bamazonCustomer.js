var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table3");
var Validation = require("./helpers/validation");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
})

function startApp() {
    console.log("---------- Welcome to Bamazon CLI Shop ----------");
    displayStock();
}

function displayStock() {
    var query = "SELECT * FROM bamazon.products";
    var table = new Table({
        head: ['Id', 'Product Name', 'Deparment', 'Price', 'Stock'],
        style: {
            head: ["blue"]
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
        //console.log(productData);
        purchaseProduct(productData);
    })
}

function purchaseProduct(productData) {
    inquirer.prompt([{
            type: "list",
            choices: productData,
            message: "Please select the produc you want to buy",
            name: "selectedProduct"
        },
        {
            type: "input",
            message: "How many units of do you want to buy",
            name: "selectedQuantity",
            validate: (value) => {
                var validation = new Validation(value);
                return validation.numberValidate();
            }
        }
    ]).then(function (answer) {
            console.log("You selected: " + answer.selectedProduct + " and units to buy: " + answer.selectedQuantity);

            var query = "SELECT product_name,stock_quantity,price,product_sales FROM products WHERE product_name = ?";
            connection.query(query, answer.selectedProduct, function (err, res) {
                if (res[0].stock_quantity < answer.selectedQuantity) {
                    //Not enough stock
                    console.log("Not enough stock, please try again.... ");
                    purchaseProduct(productData);
                } else {
                    var total = answer.selectedQuantity * res[0].price;
                    console.log("Your total for this order is : $" + total +
                        "\nThank you for your purchase");
                    updateStock(answer, res[0], total);
                }
            })
        

    })
}

function updateStock(product, res, total) {
    //console.log(product);
    var newStock = res.stock_quantity - product.selectedQuantity;
    var productToUpdate = product.selectedProduct;
    var newTotal = parseFloat(res.product_sales) + total;
    //console.log(res.product_sales + ' ' + total);
    //console.log(newTotal);
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
                stock_quantity: newStock,
                product_sales: newTotal
            },
            {
                product_name: productToUpdate
            }

        ],
        function (error) {
            if (error) throw error;
            console.log("Stock updated");
            buyAgain();
        }
    );
}

function buyAgain() {
    inquirer.prompt({
        type: "confirm",
        message: "Would you like to make another purchase?",
        name: "newPurchase"
    }).then(function (response) {
        if (response.newPurchase) {
            startApp();
        } else {
            console.log("We hope to see you again soon!");
            connection.end();
        }
    })
}

startApp();