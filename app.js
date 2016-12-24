const restify = require('restify');
const builder = require('botbuilder');
const fs = require('fs');

const pru = '**Pruuu!** ';
const ruData = JSON.parse(fs.readFileSync('tests.json', 'utf8'));

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
const formatter = {
  menu: function(item) {
    if(!item) {
      return '';
    }

    let menu = '';
    menu += '### ' + item.date + '\n\n';
    menu += '- **Acompanhamento:** ' + item.basics + '\n\n';
    menu += '- **Prato principal:** ' + item.main_dish + '\n\n';
    menu += '- **Complemento:** ' + item.side_dish + '\n\n';
    menu += '- **Salada:** ' + item.salad + '\n\n';
    menu += '- **Sobremesa:** ' + item.dessert + '\n\n';

    return menu;
  }
}

/* ***********************************
Bots Dialogs
************************************ */

bot.dialog('/menu/today', (session) => {
  // Create a Today Date object
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Fetch the menu and search for the specified day
  let item = ruData.menu.filter((item) => {
    let date = new Date(item.date);
    return +date == +today;
  });

  // If there is no menu item for this date, return an error
  if(item.length != 1) {
    session.beginDialog('/menu/error');
  }

  // Format the menu and send it
  let menu = formatter.menu(item[0]);

  session.send('# Cardápio de Hoje!!!');
  session.send(menu);
  session.send(pru);
  session.endDialog();
});

bot.dialog('/menu/tomorrow', (session) => {
  // Create a Today Date object
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Creat the Tomorrow object
  let tomorrow = today.setDate(today.getDate() + 1);

  // Fetch the menu and search for the specified day
  let item = ruData.menu.filter((item) => {
    let date = new Date(item.date);
    return +date == +today;
  });

  // If there is no menu item for this date, return an error
  if(item.length != 1) {
    session.beginDialog('/menu/error');
  }

  // Format the menu
  let menu = formatter.menu(item[0]);

  session.send('# Cardápio de Amanhã!!!');
  session.send(menu);
  session.send(pru);
  session.endDialog();
});

bot.dialog('/menu/week', (session) => {
  if (!ruData) {
    session.beginDialog('/menu/error');
  }

  session.send('# Cardápio da Semana!!!');
  session.sendTyping();

  // Fetch the menu data and send it
  ruData.menu.forEach((item) => {
    const menu = formatter.menu(item);
    session.send(menu);
  });

  session.send(pru);
  session.endDialog();
});

bot.dialog('/menu/error', (session) => {
  session.send(pru + 'Esse cardápio não está disponível');
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
    pru + 'Não entendi o que você pediu... o que você quer?',
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
