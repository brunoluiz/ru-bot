const restify = require('restify');
const builder = require('botbuilder');
const intents = require('./config/intents');
const axios = require('axios');
const fs = require('fs');

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
const bot = new builder.UniversalBot(connector);

// Load the libraries (dialogs)
bot.library(require('./dialogs/Menu'));
bot.library(require('./dialogs/Help'));

// Init the entry point with the Intents config
bot.dialog('/', intents);

// Add API endpoints
server.post('/api/messages', connector.listen());
server.get('/api/update/:token', (req, res, next) => {

  axios.get('https://jsonplaceholder.typicode.com/posts/1')
  .then((response) => {
    res.send(200);

    let contents = JSON.stringify(response.data);
    fs.writeFile('data.js', contents, (err) => {
      if (err) throw err;
      console.log('Updated RU data!');
    });
  })
  .catch(function (error) {
    console.log(error);
    res.send(500);
  });

});
