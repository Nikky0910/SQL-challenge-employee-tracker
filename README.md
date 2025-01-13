# SQL-challenge-employee-tracker

## Description

This project is designed to build a command-line application that serves as an efficient tool for managing a company's employee database. By utilizing Node.js for back-end logic, Inquirer for an interactive command-line interface, and PostgreSQL as the database, the application allows users to perform a variety of tasks seamlessly. These tasks include viewing, adding, and updating employee, role, and department information. The intuitive prompts provided by the Inquirer package ensure a smooth and user-friendly experience, while the integration with PostgreSQL enables reliable storage and organization of complex relational data. This application is ideal for companies seeking to streamline their employee data management processes in an accessible, text-based environment.

## Table of Contents (Optional)

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

To get started with the Employee Management System, follow these steps to install the necessary dependencies and set up the application:

1. **Clone the Repository**  
   First, clone the repository to your local machine using the following command:

   ```bash
   git clone https://github.com/Nikky0910/SQL-challenge-employee-tracker.git

2. **Navigate to the Project Directory**  
   After cloning, navigate to the project directory:

   ```bash
   cd SQL-challenge-employee-tracker

3. **Install Dependencies**  
   Install the required Node.js packages by running:

   ```bash
   npm install

This will install the following dependencies:

- **inquirer**: A package for handling interactive prompts.
- **pg**: The PostgreSQL client for Node.js, used to interact with the database.
- **console-table-printer**: A library to print data in a table format for better visualization.

4. **Set Up PostgreSQL Database**  
   - Ensure that **PostgreSQL** is installed on your machine.
   - Create a new database (e.g., `employees_db`) by running the following command in the PostgreSQL CLI:
     ```sql
     CREATE DATABASE employees_db;
     ```
   - Update the `.env` file in the project with your PostgreSQL database connection details:
     ```bash
     USER_NAME=your-username
     PASSWORD=your-password
     DBNAME=employees_db
     ```
5. **Run the Application**  
   Once you have installed all dependencies and set up the database, you can start the application by running the following command in your project directory:

   ```bash
   node index.js

   This will launch the command-line interface where you can start interacting with the Employee Management System.
   
## Usage

Please refer to the following video on how to use the application: 

<a href = "#"> Click here to watch the video</a>


## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
