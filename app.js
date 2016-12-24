const restify = require('restify');
const builder = require('botbuilder');
const intents = require('./config/intents');

//=========================================================
// Bot Setup
//=========================================================

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
server.post('/api/messages', connector.listen());

// Load the libraries (dialogs)
bot.library(require('./dialogs/Menu'));
bot.library(require('./dialogs/Help'));

// Init the entry point with the Intents config
bot.dialog('/', intents);
