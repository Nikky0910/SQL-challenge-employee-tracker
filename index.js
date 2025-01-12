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
        } else if (response.menu === "view all roles") {
            viewRoles();
        } else if(response.menu === "add an employee") {
            addEmployee()
        } else if (response.menu === "update an employee role") {
            updateEmployeeRole()
        } else if (response.menu === "add a role") {
            addRole()
        } else if(response.menu === "add a department") {
            addDepartment()
        }
    });
}

function viewDepartments() {
    pool.query(
        `SELECT id AS "ID",
                name AS "Department"
        FROM department
        ORDER BY id`, 
        (err, {rows}) => {
            if (err) {
                console.error("Error fetching departments:", err.message);
            } else {
                printTable(rows)
            }
        mainMenu();
    })
}

function viewEmployees() {
    pool.query(
        `SELECT employee.id AS "ID", 
                employee.first_name AS "First Name", 
                employee.last_name AS "Last Name", 
                role.title AS "Role", 
                department.name AS "Department", 
                role.salary AS "Salary", 
                CONCAT (manager.first_name,'', manager.last_name) AS "Manager"
        FROM employee
        LEFT JOIN role ON role.id = employee.role_id
        LEFT JOIN department ON department.id = role.department_id
        LEFT JOIN employee as manager ON employee.manager_id= manager.id 
        ORDER BY employee.id`, 
        (err, {rows}) => {
            if (err) {
                console.error('Error fetching employees:', err.message)
            } else {
                printTable(rows)
            }
            mainMenu();
        }
    )
}

function viewRoles() {
    pool.query(`SELECT role.id AS "ID", 
                role.title as "Title", 
                department.name as "Department", 
                role.salary as "Salary" 
        FROM role
        JOIN department ON department.id = role.department_id
        ORDER BY role.id`,
        (err,{rows})=> {
            if (err) {
                console.error("Error fetching roles:", err.message);
            } else {
                printTable(rows)
            }
            mainMenu();
        }
    )
}

function addEmployee() {
    pool.query("SELECT title as name, id as value FROM role", 
        (err, {rows: roleRows}) => {
            if(err) {
                console.error("Error fetching roles:", err.message);
                mainMenu();
                return;
            }
            pool.query(`SELECT CONCAT(first_name,'',last_name) AS name, id AS value FROM employee`, (err, {rows: managerRows})=> {
                if (err) {
                    console.error("Error fetching managers:", err.message);
                    mainMenu();
                    return;
                }
                inquirer.prompt([
                    {
                        type: "input",
                        message: "What is the employee's first name?",
                        name: "first_name",
                    },
                    {
                        type: "input",
                        message: "What is the employee's last name?",
                        name: "last_name",
                    },
                    {
                        type: "list",
                        message: "What is the employee's role?",
                        name: "role",
                        choices: roleRows
                    },
                    {
                        type: "list",
                        message: "What is the employee's manager?",
                        name: "manager",
                        choices: managerRows
                    }]).then((response) => {
                        pool.query(
                            `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES($1, $2, $3, $4)`, [response.first_name, response.last_name, response.role,response.manager], (err)=> {
                                if (err) {
                                    console.error("Error adding employee:", err.message);
                                } else {
                                    console.log("New Employee has been added into the system!")
                                }
                                viewEmployees();
                            })
                });
            })
        }
    )
}

function addRole() {
    pool.query("SELECT name as name, id as value FROM department", (err, {rows}) => {
            if(err) {
                console.error("Error fetching departments", err.message);
                mainMenu();
                return;
            }
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the name of the role?",
                    name: "title",
                },
                {
                    type: "input",
                    message: "What is the salary of the role?",
                    name: "salary",
                },
                {
                    type: "list",
                    message: "Which department does the role belong to?",
                    name: "department",
                    choices: rows
                }
            ]).then((response) => {
                pool.query(
                    `INSERT INTO role(title, salary, department_id) VALUES($1, $2, $3)`, [response.title, response.salary, response.department], (err)=> {
                        if (err) {
                            console.error("Error adding role:", err.message)
                        } else {
                            console.log("A new role has been added into the system!")
                        }
                        viewRoles();
                    }
                )});
    })
}

function addDepartment() {
    inquirer.prompt([
    {
        type: "input",
        message: "What is the name of the department?",
        name: "department",
    }]).then((response) => {
    pool.query(
        `INSERT INTO department(name) VALUES($1)`, [response.department], (err)=> {
            if (err) {
                console.error("Error adding department:", err.message)
            } else {
                console.log("A new department has been added into the system!")
            }
            viewDepartments();
        }
    )});
}

function updateEmployeeRole() {
    pool.query("SELECT CONCAT(first_name,'  ',last_name) AS name, id AS value FROM employee", (err, {rows: employeeRows}) => {
        if (err) {
            console.error("Error fetching employees", err.message);
            mainMenu();
            return;
        }
        pool.query("SELECT title as name, id as value FROM role", (err, {rows : roleRows}) => {
            if (err) {
                console.error("Error fetching roles:", err.message);
                mainMenu();
                return;
            }
            inquirer.prompt([
                {
                    type: "list",
                    message: "Which employee's role do you want to update?",
                    name: "employee",
                    choices: employeeRows
                },
                {
                    type: "list",
                    message: "Which role do you want to assign the selected employee?",
                    name: "role",
                    choices: roleRows
                }
            ])
            .then ((response)=> {
                pool.query (`UPDATE employee SET role_id = $1 where id = $2`, [response.role, response.employee], (err) => {
                    if (err) {
                        console.error("Error updating employee's role", err.message)
                    } else {
                        console.log("Employee's role has been updated")
                    }
                    viewEmployees()
                });
            })
        })
    })
}