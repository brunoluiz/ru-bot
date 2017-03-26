const restify = require('restify');
const Menu = require('./models/Menu');
const Subscription = require('./models/Subscription');
const bot = require('./bot').bot;
const connector = require('./bot').connector;
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

// Connect to the MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.PORT || 3978, () => {
  console.log('%s listening to %s', server.name, server.url);
});

// Add API endpoints
server.post('/api/messages', connector.listen());

server.get('/api/menu', (req, res) => {
  Menu.getActualWeek((err, result) => {
    res.send(result);
  });
});

// TODO: Refactor all this scrapping method
server.post('/api/populate/:token', (req, res, next) =>
  axios.get('http://ru.ufsc.br/ru/')
  .then((response) => {
    if (req.params.token !== process.env.SECTOKEN) {
      return res.send(401);
    }

    const items = [];

    // Loads the HTML to the Cherrio lib
    const $ = cheerio.load(response.data);

    // First things first: define the start and end date of this menu
    const dateEl = $('p:nth-child(1) > span:first-child').text();
    console.log(dateEl);
    const dateRange = dateEl.match(/([0-9]*)\/([0-9]*)/g);
    const startDateStr = dateRange[0];
    // const endDateStr = dateRange[1];
    const year = $('.last-update').text().match(/[0-9]{4}/)[0];

    // Get the start date Date object
    const dateInfo = startDateStr.split('/');
    const month = dateInfo[1];
    const day = dateInfo[0];
    const startDate = moment(`${year}-${month}-${day}`);

    // Get the menu's table and iterate over it
    const rows = $('table:nth-child(4) > tbody > tr').toArray();
    rows.forEach((row, index) => {
      if (index === 0) return;

      // Get all the columns
      const cols = $(row).find('td');

      // Push the item
      items.push({
        date: moment(startDate).add(index - 1, 'day').utc().toDate(),
        basics: `${$(cols[1]).text().trim()} / ${$(cols[2]).text().trim()}`,
        main_dish: $(cols[3]).text().trim(),
        side_dish: $(cols[4]).text().trim(),
        salad: $(cols[5]).text().trim(),
        dessert: $(cols[6]).text().trim(),
      });
    });

    // Batch insert all the menu items in the Database
    Menu.collection.insert(items);

    res.send(200);
    return next();
  }).catch(error => console.log(error)));

server.post('/api/notify/:token', (req, res) => {
  if (req.params.token !== process.env.SECTOKEN) {
    res.send(401);
  }

  // Get all subscriptions and send the Today's Menu
  Subscription.find().exec((err, subscriptions) =>
    subscriptions.forEach(subscription =>
      bot.beginDialog(subscription.address, 'Menu:Today')));

  res.send(200);
});

server.get(/\/public\/?.*/, restify.serveStatic({
  directory: __dirname,
}));
