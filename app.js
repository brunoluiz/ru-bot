const restify = require('restify');
const fs = require('fs');
const Menu = require('./models/Menu');
const Subscription = require('./models/Subscription');
const bot = require('./bot').bot;
const connector = require('./bot').connector;
const mongoose = require('mongoose');

// Connect to the MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Add API endpoints
server.post('/api/messages', connector.listen());

server.get('/api/menu', (req, res, next) => {
  Menu.getActualWeek((err, result) => {
    res.send(result);
  });
});

server.get('/api/populate', (req, res, next) => {

  // FIXME: Replace this with the actual scrapper data
  let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  // Add a Date object to the item
  let menu = data.menu.map((item) => {
    item.date = new Date(item.date);
    return item;
  });

  // Batch insert all the menu items in the Database
  Menu.collection.insert(menu);

  res.send(200);
});

server.get('/api/notify', (req, res, next) => {
  // Get all subscriptions and send the Today's Menu
  Subscription.find().exec(
    (err, subscriptions) =>
    subscriptions.forEach((subscription) =>
    bot.beginDialog(subscription.address, 'Menu:Today'))
  );

  res.send(200);
});
