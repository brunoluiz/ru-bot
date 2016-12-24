const mongoose = require('./config/mongoose');
const restify = require('restify');
const builder = require('botbuilder');
const intents = require('./config/intents');
const axios = require('axios');
const fs = require('fs');
const Menu = require('./models/Menu');

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
const bot = new builder.UniversalBot(connector, {
  localizerSettings: {
    defaultLocale: 'pt-BR'
  }
});

// Load the libraries (dialogs)
bot.library(require('./dialogs/Menu'));
bot.library(require('./dialogs/Help'));

// Init the entry point with the Intents config
bot.dialog('/', intents);

bot.on('conversationUpdate', (message) => {
  if (message.membersAdded) {
    // FIXME: i18n
    let welcome = new builder.Message()
      .address(message.address)
      .text('Olá, sou o PruBot! Posso lhe informar os cardápios e informações sobre o RU da UFSC e notificá-lo diariamente do cardápio do dia. Digite **AJUDA** para saber um pouco mais.');
    bot.send(welcome);
  }
});

// Add API endpoints
server.post('/api/messages', connector.listen());

server.get('/api/menu', (req, res, next) => {
  Menu.find().sort({date: -1}).limit(7)
  .exec((err, result) => {
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
