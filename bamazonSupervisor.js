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
    console.log("---------- Welcome to Bamazon CLI Manager Edition ----------".blue);
    //clearTable();
    supervisorDisplay();
}

function supervisorDisplay() {
    inquirer.prompt({
        type: "list",
        message: "Select an option from the menu",
        choices: ["View Product Sales by Department", "Create New Department", "Quit"],
        name: "option"
    }).then(function (answer) {
        switch (answer.option) {
            case "View Product Sales by Department":
                viewSales()
                break;
            case "Create New Department":
                createDepartment()
                break;
            case "Quit":
                console.log("Thanks for using Bamazon Supervisor Edition".green.italic);
                connection.end();
        }
    })
}

function viewSales() {
    var table = new Table({
        head: [],
        colWidths: [15, 25, 20, 20, 15]
    })
    table.push(
        [{
            colSpan: 5,
            hAlign: "center",
            content: "Product Sales by Department".bgGreen.white
        }],
        ["Department ID".blue, "Department Name".blue, "Overhead Costs".blue, "Products Sales".blue, "Total Profit".blue]
    )
    connection.query("SELECT d.department_id, d.department_name, over_head_costs, SUM(product_sales) AS sales , (SUM(p.product_sales) - over_head_costs)  AS total_profit FROM products AS p RIGHT JOIN departments AS d ON p.department_name = d.department_name GROUP BY d.department_id"
    , function (error, res) {
        //console.log(res);
        for (let i = 0; i < res.length; i++) {
            table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].sales, res[i].total_profit]);
        }
        console.log(table.toString());
        supervisorDisplay();
    })
}

function createDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the new department name",
            name: "newDept",
            validate: (value) => {
                var validation = new Validation(value);
                return validation.textValidate();
            }
        },
        {
            type: "input",
            message: "Enter the overhead cost",
            name: "overhead",
            validate: (value) => {
                var validation = new Validation(value);
                return validation.numberValidate();
            }
        }
    ]).then(function (response) {
        connection.query(
            "INSERT INTO departments SET ?",
            {department_name: response.newDept, over_head_costs:response.overhead},
            function (error, res) {
                if(error) throw error;
                //console.log(res);
                console.log("New department created");
                supervisorDisplay();
            })
    })
}

startApp();