const builder = require('botbuilder');
const fs = require('fs');
const Formatter = require('../utils/formatter');

const pru = '**Pruuu!** ';
const ruData = JSON.parse(fs.readFileSync('tests.json', 'utf8'));
const library = new builder.Library('Menu');

const getDateMenuItem = (data, userDate) => {
  let item = data.filter((item) => {
    let itemDate = new Date(item.date);
    return +itemDate == +userDate;
  });

  if (item.length == 0) throw 'no item';
  else if (item.length > 1) throw 'date issue';

  return item[0];
}

const sendMenu = (session, offset) => {
  if (!ruData) session.replaceDialog('Menu:Error');

  // Create the date object, based on the specified object
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Reset the hours
  let offsetDate = today.setDate(today.getDate() + offset);

  // Get the specified date menu item
  let item;
  try {
    item = getDateMenuItem(ruData.menu, offsetDate);
  } catch (err) {
    console.log(err);
    session.replaceDialog('Menu:Error');
  }

  // Format the menu and send it
  let menu = Formatter.menu(item);
  session.send(menu);
  session.send(pru);
  session.endDialog();
}

library.dialog('Today', (session) => sendMenu(session, 0));

library.dialog('Tomorrow', (session) => sendMenu(session, 1));

library.dialog('Error', (session) => {
  session.send(pru + 'Esse cardápio não está disponível');
  session.endDialog();
});

library.dialog('Week', (session) => {
  if (!ruData) session.replaceDialog('Menu:Error');

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

module.exports = library;
