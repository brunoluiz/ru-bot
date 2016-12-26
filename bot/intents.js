const builder = require('botbuilder');

// Setup the Intents Dialog
const intents = new builder.IntentDialog();

// Strings to match (and its dialogs)
intents.matches(/hoje/ig, (session) => session.beginDialog('Menu:Today'));
intents.matches(/amanhã/ig, (session) => session.beginDialog('Menu:Tomorrow'));
intents.matches(/semana/ig, (session) => session.beginDialog('Menu:Week'));
intents.matches(/menu/ig, (session) => session.beginDialog('Menu:Week'));
intents.matches(/assina/ig, (session) => session.beginDialog('Subscribe:CheckStatus'));
intents.matches(/notifica/ig, (session) => session.beginDialog('Subscribe:CheckStatus'));
intents.matches(/cancel/ig, (session) => session.beginDialog('Subscribe:CheckStatus'));

// Default action, when no match is found
intents.onDefault((session, args, next) => session.beginDialog('Welcome:Greeting'));

module.exports = intents;
