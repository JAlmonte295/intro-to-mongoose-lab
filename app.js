
const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

const connectDB = require('./db');
const User = require('./models/user');

// Start of App

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
                await createUser();
                break;
            case '2':
                await viewAllUsers();
                break;
            case '3':
                await updateUser();
                break;
            case '4':
                await deleteUser();
                break;
            case '5':
                console.log('\nExiting application. Goodbye!');
                await mongoose.disconnect();
                return;
            default:
                console.log('\nInvalid choice. Please enter a number between 1 and 5.');
        }
        prompt('\nPress Enter to continue...');
    }
}

//CREATE USER
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

//VIEW ALL CREATED USERS
async function viewAllUsers() {
    console.log('\n--- View All Users ---');
    try {
        const users = await User.find();
        if (users.length === 0) {
            console.log('\nNo users found.');
        } else {
            console.log('\nAll Users:');
            users.forEach((user, index) => {
                console.log(`${index + 1}. Name: ${user.name}, Email: ${user.email}, ID: ${user._id}`);
            });
        }
        } catch (error) {
        console.error('\nAn error occurred while fetching users:', error.message);
    }
};

//UPDATE USER

async function updateUser() {
    console.log('\n--- Update a User ---');
    console.log('\n--- Current Users ---');
    try {
        const users = await User.find();
        if (users.length === 0) {
            console.log('\nNo users found.');
        } else {
            users.forEach((user, index) => {
                console.log(`${index + 1}. Name: ${user.name}, Email: ${user.email}, ID: ${user._id}`);
            });
        }
        } catch (error) {
        console.error('\nAn error occurred while fetching users:', error.message);
    }

    const userId = prompt('\nCopy and paste the user ID you wish to update: ');

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('\nInvalid user ID format.');
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
        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

        if (!updatedUser) {
            console.log('\nUser not found.');
        } else {
            console.log(`\nUser "${updatedUser.name}" updated successfully!`);
        }
    } catch (error) {
        if (error.code === 11000) {
            console.error('\nError: A user with that email already exists.');
        } else {
            console.error('\nAn error occurred while updating the user:', error.message);
        }
    }
}

//DELETE USER

async function deleteUser() {
    console.log ('\n--- Delete a User ---');
    console.log('\n--- Current Users ---');
    try {
        const users = await User.find();
        if (users.length === 0) {
            console.log('\nNo users to delete.');
            return;
        } else {
            users.forEach((user, index) => {
                console.log(`${index + 1}. Name: ${user.name}, Email: ${user.email}, ID: ${user._id}`);
            });
        }
    } catch (error) {
        console.error('\nAn error occurred while fetching users:', error.message);
    }


    const userId = prompt('\nEnter the user ID to delete: ');

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('\nInvalid user ID format.');
        return;
    }

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            console.log('\nUser not found.');
        } else {
            console.log(`\nUser "${deletedUser.name}" deleted successfully!`);
        }
    } catch (error) {
        console.error('\nAn error occurred while deleting the user:', error.message);
    }
};




main();