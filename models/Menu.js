const mongoose = require('mongoose');

let menuSchema = mongoose.Schema({
  basics: {type: String, required: false},
  main_dish: {type: String, required: false},
  side_dish: {type: String, required: false},
  salad: {type: String, required: false},
  dessert: {type: String, required: false},
  date: {type: Date, required: true, unique: true},
  createdAt: {type: Date, required: true, default: Date.now}
});

menuSchema.statics.getActualWeek = (callback) => (
  mongoose.model('Menu').find(callback).limit(7).sort({date: -1})
);

menuSchema.statics.getDay = (day, callback) => (
  mongoose.model('Menu').findOne({date: day}, callback)
)

let Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
