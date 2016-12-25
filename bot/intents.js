const builder = require('botbuilder');

// Setup the Intents Dialog
const intents = new builder.IntentDialog();

// Strings to match (and its dialogs)
intents.matches(/^hoje/i, (session) => session.beginDialog('Menu:Today'));
intents.matches(/^amanhã/i, (session) => session.beginDialog('Menu:Tomorrow'));
intents.matches(/^semana/i, (session) => session.beginDialog('Menu:Week'));
intents.matches(/^assina/i, (session) => session.beginDialog('Subscribe:CheckStatus'));
intents.matches(/^notifica/i, (session) => session.beginDialog('Subscribe:CheckStatus'));
intents.matches(/^cancel/i, (session) => session.beginDialog('Subscribe:CheckStatus'));

// Default action, when no match is found
intents.onDefault((session, args, next) => session.beginDialog('Welcome:Greeting'));

module.exports = intents;
