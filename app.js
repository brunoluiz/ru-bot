const mongoose = require('./config/mongoose');
const restify = require('restify');
const fs = require('fs');
const Menu = require('./models/Menu');
const bot = require('./bot').connector;

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Add API endpoints
server.post('/api/messages', bot.listen());

server.get('/api/menu', (req, res, next) => {
  Menu.getActualWeek((err, result) => {
    res.send(result);
  });
});

server.get('/api/update/:token', (req, res, next) => {

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

server.get('/api/notify/today', (req, res, next) => {

});
