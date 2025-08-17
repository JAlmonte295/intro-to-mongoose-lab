// const prompt = require('prompt-sync')();

// const username = prompt('What is your name?');

// console.log(`Your name is ${username}`);

/**
 * Main application file for the Intro to Mongoose Lab.
 */

function displayWelcomeMessage() {
    console.log('====================================');
    console.log('  Welcome to the Mongoose Lab App!  ');
    console.log('====================================\n');
}

function main() {
    displayWelcomeMessage();
}

main();

module.exports = main;