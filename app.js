
const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

const connectDB = require('./db');
const User = require('./models/user');

// Start of App

function displayWelcomeMessage() {
    console.log('====================================');
    console.log('  Welcome to the Customer Relationship Management App!  ');
    console.log('====================================\n');
}

function displayMenu() {
    console.log('\n--- Main Menu ---');
    console.log('1. Create a customer');
    console.log('2. View all customers');
    console.log('3. Update a customer');
    console.log('4. Delete a customer');
    console.log('5. Quit');
    console.log('------------------');
    console.log('\n');
}

async function main() {
    displayWelcomeMessage();
    await connectDB();

    while (true) {
        displayMenu();
        const choice = prompt('Enter the number of your choice: ');
        switch (choice) {
            case '1':
                await createCustomer();
                break;
            case '2':
                await viewAllCustomers();
                break;
            case '3':
                await updateCustomer();
                break;
            case '4':
                await deleteCustomer();
                break;
            case '5':
                console.log('\nExiting application. Goodbye!');
                await mongoose.connection.close();
                return;
            default:
                console.log('\nInvalid choice. Please enter a number between 1 and 5.');
        }
        prompt('\nPress Enter to continue...');
    }
}

// Helper function to display and retrieve customers
async function displayAndGetCustomers(options = {}) {
    const {
        listHeader,
        noCustomersMessage = '\nNo customers found.'
    } = options;

    try {
        const customers = await User.find();
        if (customers.length === 0) {
            console.log(noCustomersMessage);
            return [];
        }

        if (listHeader) {
            console.log(listHeader);
        }
        customers.forEach((customer, index) => {
            console.log(`${index + 1}. Name: ${customer.name}, Email: ${customer.email}, ID: ${customer._id}`);
        });

        return customers;
    } catch (error) {
        console.error('\nAn error occurred while fetching customers:', error.message);
        return [];
    }
}

//CREATE CUSTOMER
async function createCustomer() {
    console.log('\n--- Create a New Customer ---');
    const name = prompt('Enter customer name: ');
    const email = prompt('Enter customer email: ');

    try {
        const newCustomer = new User({ name, email });
        await newCustomer.save();
        console.log(`\nCustomer "${name}" created successfully!`);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error for email
            console.error('\nError: A customer with that email already exists.');
        } else {
            console.error('\nAn error occurred while creating the customer:', error.message);
        }
    }
}

//VIEW ALL CREATED CUSTOMERS
async function viewAllCustomers() {
    console.log('\n--- View All Customers ---');
    await displayAndGetCustomers({ listHeader: '\nAll Customers:' });
};

//UPDATE CUSTOMER

async function updateCustomer() {
    console.log('\n--- Update a Customer ---');
    const customers = await displayAndGetCustomers({ listHeader: '\n--- Current Customers ---' });

    if (customers.length === 0) {
        return;
    }

    const userId = prompt('\nCopy and paste the customer ID you wish to update: ');

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('\nInvalid customer ID format.');
        return;
    }

    const newName = prompt('Enter the new name (or press Enter to keep current): ');
    const newEmail = prompt('Enter the new email (or press Enter to keep current): ');

    const updateFields = {};
    if (newName) {
        updateFields.name = newName;
    }
    if (newEmail) {
        updateFields.email = newEmail;
    }

    if (Object.keys(updateFields).length === 0) {
        console.log('\nNo changes were made.');
        return;
    }

    try {
        const updatedCustomer = await User.findByIdAndUpdate(userId, updateFields, { new: true });

        if (!updatedCustomer) {
            console.log('\nCustomer not found.');
        } else {
            console.log(`\nCustomer "${updatedCustomer.name}" updated successfully!`);
        }
    } catch (error) {
        if (error.code === 11000) {
            console.error('\nError: A customer with that email already exists.');
        } else {
            console.error('\nAn error occurred while updating the customer:', error.message);
        }
    }
}

//DELETE CUSTOMER

async function deleteCustomer() {
    console.log ('\n--- Delete a Customer ---');
    const customers = await displayAndGetCustomers({
        listHeader: '\n--- Current Customers ---',
        noCustomersMessage: '\nNo customers to delete.'
    });

    if (customers.length === 0) {
        return;
    }

    const userId = prompt('\nEnter the customer ID to delete: ');

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('\nInvalid customer ID format.');
        return;
    }

    try {
        const deletedCustomer = await User.findByIdAndDelete(userId);

        if (!deletedCustomer) {
            console.log('\nCustomer not found.');
        } else {
            console.log(`\nCustomer "${deletedCustomer.name}" deleted successfully!`);
        }
    } catch (error) {
        console.error('\nAn error occurred while deleting the customer:', error.message);
    }
};


main();