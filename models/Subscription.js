const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
  user: { type: Object, required: true, unique: true },
  address: { type: Object, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

subscriptionSchema.statics.isSubscribed = (session, callback) => mongoose
  .model('Subscription').findOne({
    user: session.message.address.user,
  }, (err, result) => callback(result));

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
