const mongoose = require('mongoose');

// Connect to the Database
mongoose.connect('mongodb://localhost/prubot');

module.exports = mongoose;
