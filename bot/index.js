const builder = require('botbuilder');
const intents = require('./intents');

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

module.exports = {
  connector: connector,
  bot: bot
};
