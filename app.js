const restify = require('restify');
const fs = require('fs');
const Menu = require('./models/Menu');
const Subscription = require('./models/Subscription');
const bot = require('./bot').bot;
const connector = require('./bot').connector;
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

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

// TODO: Refactor all this scrapping method
server.post('/api/populate/:token', (req, res, next) =>
  axios.get('http://ru.ufsc.br/ru/').then((response) => {
    if (req.params.token != process.env.SECTOKEN) {
      return res.send(401);
    }

    let items = new Array();

    // Loads the HTML to the Cherrio lib
    let $ = cheerio.load(response.data);

    // First things first: define the start and end date of this menu
    let dateEl = $('p:nth-child(1) > span:first-child').text();
    let dateRange = dateEl.match(/([1-9][0-9]*)\/([1-9][0-9]*)/g);
    let startDateStr = dateRange[0];
    let endDateStr = dateRange[1];
    let year = $('li.last-update').text().match(/[0-9]{4}/)[0];

    // Get the start date Date object
    let dateInfo = startDateStr.split('/');
    let month = dateInfo[1];
    let day = dateInfo[0];
    let startDate = new Date(year + '-' + month + '-' + day);

    // Get the menu's table and iterate over it
    let rows = $('table:nth-child(4) > tbody > tr').toArray();
    rows.forEach((row, index) => {
      if(index == 0) return;

      // Get all the columns
      cols = $(row).find('td');

      // Get the right date
      let date = startDate.setDate(startDate.getDate() + 1);

      // Push the item
      items.push({
        date: new Date(date),
        basics: $(cols[1]).text().trim() + '/ ' + $(cols[2]).text().trim(),
        main_dish: $(cols[3]).text().trim(),
        side_dish: $(cols[4]).text().trim(),
        salad: $(cols[5]).text().trim(),
        dessert: $(cols[6]).text().trim(),
      });
    });

    // Batch insert all the menu items in the Database
    Menu.collection.insert(items);

    res.send(200);
  })
);

server.post('/api/notify/:token', (req, res, next) => {
  if (req.params.token != process.env.SECTOKEN) {
    res.send(401);
  }

  // Get all subscriptions and send the Today's Menu
  Subscription.find().exec(
    (err, subscriptions) =>
    subscriptions.forEach((subscription) =>
    bot.beginDialog(subscription.address, 'Menu:Today'))
  );

  res.send(200);
});
