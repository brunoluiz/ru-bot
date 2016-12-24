const mongoose = require('mongoose');

let subscriptionSchema = mongoose.Schema({
  user: {type: Object, required: true, unique: true},
  address: {type: Object, required: true},
  createdAt: {type: Date, required: true, default: Date.now}
});

let subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = subscription;
