const mongoose = require('mongoose');

// Connect to the Database
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL);

module.exports = mongoose;
