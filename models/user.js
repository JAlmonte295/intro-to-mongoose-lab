const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // You can add more fields here, like age, etc.
});

const User = mongoose.model('User', userSchema);

module.exports = User;
