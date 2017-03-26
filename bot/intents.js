const builder = require('botbuilder');

// Setup the Intents Dialog
const intents = new builder.IntentDialog();

// Strings to match (and its dialogs)
intents.matches(/alert.*/i, session => session.beginDialog('Subscription:Subscription'));
intents.matches(/assina.*/i, session => session.beginDialog('Subscription:Subscription'));
intents.matches(/notifica.*/i, session => session.beginDialog('Subscription:Subscription'));
intents.matches(/cancel.*/i, session => session.beginDialog('Subscription:Subscription'));

intents.matches(/semana/i, session => session.beginDialog('Menu:Menu'));
intents.matches(/menu/i, session => session.beginDialog('Menu:Menu'));
intents.matches(/cardápio/i, session => session.beginDialog('Menu:Menu'));

intents.matches(/hoje/i, session => session.beginDialog('Menu:Today'));
intents.matches(/amanhã/i, session => session.beginDialog('Menu:Tomorrow'));

intents.matches(/info/i, session => session.beginDialog('Info:Info'));
intents.matches(/sobre/i, session => session.beginDialog('Info:Info'));

intents.matches(/Ver Cardápio/i, session => session.beginDialog('Menu:Menu'));
intents.matches(/Alertas diários/i, session => session.beginDialog('Subscription:Subscription'));

// Default action, when no match is found
intents.onDefault(session => session.beginDialog('Main:Main'));

module.exports = intents;
