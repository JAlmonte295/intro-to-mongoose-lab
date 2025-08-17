require('dotenv').config();
const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const User = require('./models/user');

/**
 * Main application file for the Intro to Mongoose Lab.
 */

function displayWelcomeMessage() {
    console.log('====================================');
    console.log('  Welcome to the Mongoose Lab App!  ');
    console.log('====================================\n');
}

function displayMenu() {
    console.log('\n--- Main Menu ---');
    console.log('1. Create a user');
    console.log('2. View all users');
    console.log('3. Update a user');
    console.log('4. Delete a user');
    console.log('5. Quit');
    console.log('------------------');
}

async function createUser() {
    console.log('\n--- Create a New User ---');
    const name = prompt('Enter user name: ');
    const email = prompt('Enter user email: ');

    try {
        const newUser = new User({ name, email });
        await newUser.save();
        console.log(`\nUser "${name}" created successfully!`);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error for email
            console.error('\nError: A user with that email already exists.');
        } else {
            console.error('\nAn error occurred while creating the user:', error.message);
        }
    }
}

async function main() {
    displayWelcomeMessage();
    await connectDB();

    while (true) {
        displayMenu();
        const choice = prompt('Enter your choice: ');

        switch (choice) {
            case '1':
                await createUser();
                break;
            case '2':
                console.log('\nAction: View all users...');
                break;
            case '3':
                console.log('\nAction: Update a user...');
                break;
            case '4':
                console.log('\nAction: Delete a user...');
                break;
            case '5':
                console.log('\nExiting application. Goodbye!');
                await mongoose.disconnect();
                return;
            default:
                console.log('\nInvalid choice. Please enter a number between 1 and 5.');
        }
    }
}

main();