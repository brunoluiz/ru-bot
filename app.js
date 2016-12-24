const restify = require('restify');
const builder = require('botbuilder');
const fs = require('fs');

const fixture = JSON.parse(fs.readFileSync('tests.json', 'utf8'));

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

// Init the entry point to the Intents object
bot.dialog('/', intents);

/* ***********************************
Bots Dialogs
************************************ */

bot.dialog('/menu/today', (session) => {
  session.send('Cardápio de hoje');
  session.endDialog();
});

bot.dialog('/menu/tomorrow', (session) => {
  session.send('Cardápio de amanhã');
  session.endDialog();
});

bot.dialog('/menu/week', (session) => {
  session.send('Cardápio da Semana!!!');
  fixture.forEach((item) => {
    const text = 'Dia: ' + item.date + '\n';
    text += 'Acompanhamento: ' + item.basics + '\n';
    text += 'Prato principal: ' + item.main_dish + '\n';
    text += 'Complemento: ' + item.side_dish + '\n';
    text += 'Salada: ' + item.salad + '\n';
    text += 'Sobremesa: ' + item.dessert + '\n';

    session.send(text);
  });
  session.send('Pruuu!');
  session.endDialog();
});

bot.dialog('/menu/error', (session) => {
  session.send('Pruuu! Esse cardápio não está disponível');
  session.endDialog();
});

const options = {
  'Quero o cardápio de hoje': {
    uri: '/menu/today'
  },
  'Quero o cardápio de amanhã': {
    uri: '/menu/tomorrow'
  },
  'Quero o cardápio da semana': {
    uri: '/menu/week'
  }
}

bot.dialog('/help', (session) => {
  builder.Prompts.choice(session,
    'Pruuu! Não entendi o que você pediu... o que você quer?',
    options, {
      maxRetries: 0
    });
});

/* ***********************************
Intents
************************************ */

intents.onDefault([
    (session, args, next) => session.beginDialog('/help'),
    (session, results, next) => {
      if (!results.response) {
        session.endDialog();
      }

      const option = options[results.response.entity];
      session.beginDialog(option.uri);
    }
]);

intents.matches(/^semana/i, (session) => session.beginDialog('/menu/week'));
intents.matches(/^hoje/i, (session) => session.beginDialog('/menu/today'));
intents.matches(/^amanhã/i, (session) => session.beginDialog('/menu/tomorrow'));
