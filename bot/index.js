const builder = require('botbuilder');
const intents = require('./intents');

// Create the connector (needs to be configurated on the MS Platform)
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Create chat bot
const bot = new builder.UniversalBot(connector, {
  localizerSettings: {
    defaultLocale: process.env.LOCALE || 'pt-br',
    botLocalePath: process.env.LOCALE_PATH || './locale'
  }
});

// Load the libraries (dialogs)
bot.library(require('./dialogs/Menu'));
bot.library(require('./dialogs/Subscription'));
bot.library(require('./dialogs/Welcome'));
bot.library(require('./dialogs/Info'));

// Init the entry point with the Intents config
bot.dialog('/', intents);

bot.beginDialogAction('Subscriptions', 'Subscription:Subscription');
bot.beginDialogAction('TodaysMenu', 'Menu:Today');
bot.beginDialogAction('TomorrowsMenu', 'Menu:Tomorrow');
bot.beginDialogAction('WeeksMenu', 'Menu:Menu');
bot.beginDialogAction('Menu', 'Menu:Day');
bot.beginDialogAction('Help', 'Welcome:Welcome');
bot.beginDialogAction('Info', 'Info:Info');

// Shows a greeting message for new users
bot.on('conversationUpdate', (message) => {
  if (message.membersAdded) {
    bot.beginDialog(message.address, 'Welcome:Greeting');
  }
});

module.exports = {
  connector: connector,
  bot: bot
};
