const builder = require('botbuilder');
const fs = require('fs');
const Formatter = require('../utils/formatter');

const pru = '**Pruuu!** ';
const ruData = JSON.parse(fs.readFileSync('tests.json', 'utf8'));
const library = new builder.Library('Menu');

library.dialog('Today', (session) => {
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
    session.replaceDialog('Menu:Error');
  }

  // Format the menu and send it
  let menu = Formatter.menu(item[0]);

  session.send('# Cardápio de Hoje!!!');
  session.send(menu);
  session.send(pru);
  session.endDialog();
});

library.dialog('Tomorrow', (session) => {
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
    return session.replaceDialog('Menu:Error');
  }

  // Format the menu
  let menu = Formatter.menu(item[0]);

  session.send('# Cardápio de Amanhã!!!');
  session.send(menu);
  session.send(pru);
  session.endDialog();
});

library.dialog('Week', (session) => {
  if (!ruData) {
    session.replaceDialog('Menu:Error');
  }

  session.send('# Cardápio da Semana!!!');
  session.sendTyping();

  // Fetch the menu data and send it
  ruData.menu.forEach((item) => {
    const menu = Formatter.menu(item);
    session.send(menu);
  });

  session.send(pru);
  session.endDialog();
});

library.dialog('Error', (session) => {
  session.send(pru + 'Esse cardápio não está disponível');
  session.endDialog();
});

module.exports = library;
