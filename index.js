const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");
const { Pool } = require("pg");
require("dotenv").config();
// view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const pool = new Pool(
    {
        user: process.env.USER_NAME,
        password: process.env.PASSWORD,
        host: "localhost",
        database: process.env.DBNAME
    },
    console.log(`Connected to the employees_db database.`)
);

pool.connect(() => {
    mainMenu()
});

function mainMenu() {
    inquirer.prompt([
        {
        type: "list",
        message: "What would you like to do?",
        name: "menu",
        choices: [
            "view all departments",
            "view all roles",
            "view all employees",
            "add a department",
            "add a role",
            "add an employee",
            "update an employee role",
            ],
        },
    ]).then((response) => {
        if (response.menu === "view all departments") {
        viewDepartments();
        } else if (response.menu === "view all employees") {
            viewEmployees();
        }
    });
}

function viewDepartments() {
    pool.query('SELECT * FROM department', function (err, {rows}) {
        printTable(rows)
        mainMenu()
    })
}

function viewEmployees() {
    pool.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title as title, department.name as department, role.salary, CONCAT (employee_manager.first_name,'', employee_manager.last_name) as manager
        FROM employee
        LEFT JOIN role ON role.id = employee.role_id
        LEFT JOIN department ON department.id = role.department_id
        LEFT JOIN employee as employee_manager ON employee.manager_id= employee_manager.id ORDER BY employee.id;`, 
        function (err, {rows}) {
            printTable(rows)
            mainMenu()
        }
    )
}