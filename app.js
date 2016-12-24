const restify = require('restify');
const builder = require('botbuilder');
const options = require('./dialogs/Help').options;

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

// Setup the Intents Dialog
const intents = new builder.IntentDialog();

// Load the libraries (dialogs)
bot.library(require('./dialogs/Menu'));
bot.library(require('./dialogs/Help'));

// Init the entry point to the Intents object
bot.dialog('/', intents);

// Intents
intents.onDefault([
    (session, args, next) => session.beginDialog('Help:Options'),
    (session, results, next) => {
      if (!results.response) {
        session.endDialog();
      }


      const option = options[results.response.entity];
      session.beginDialog(option.uri);
    }
]);

intents.matches(/^hoje/i, (session) => session.beginDialog('Menu:Today'));
intents.matches(/^amanhã/i, (session) => session.beginDialog('Menu:Tomorrow'));
intents.matches(/^semana/i, (session) => session.beginDialog('Menu:Week'));
