const builder = require('botbuilder');
const options = require('../dialogs/Help').options;

// Setup the Intents Dialog
const intents = new builder.IntentDialog();

// Strings to match (and its dialogs)
intents.matches(/^hoje/i, (session) => session.beginDialog('Menu:Today'));
intents.matches(/^amanhã/i, (session) => session.beginDialog('Menu:Tomorrow'));
intents.matches(/^semana/i, (session) => session.beginDialog('Menu:Week'));

// Default action, when no match is found
intents.onDefault([
    (session, args, next) => session.beginDialog('Help:Options'),
    (session, results, next) => {
      if (results.response) {
        const option = options[results.response.entity];
        session.replaceDialog(option.uri);
      }

      session.endDialog();
    }
]);

module.exports = intents;
