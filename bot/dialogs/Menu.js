const builder = require('botbuilder');
const fs = require('fs');
const Formatter = require('../../helpers/Formatter');
const Menu = require('../../models/Menu');

const library = new builder.Library('Menu');

const sendDayMenu = (session, offset) => {
  session.sendTyping();

  // Create the date object, based on the specified object
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Reset the hours
  let offsetDate = today.setDate(today.getDate() + offset);

  // Get the specified date menu item
  Menu.getDay(offsetDate, (err, result) => {
    if (err || !result) session.endDialog('menu:error');

    // Format the menu and send it
    let menu = Formatter.menu(session, result);
    session.endDialog(menu);
  });
}

library.dialog('Today', (session) => sendDayMenu(session, 0));

library.dialog('Tomorrow', (session) => sendDayMenu(session, 1));

library.dialog('Week', (session) => {
  session.sendTyping();

  // Fetch the menu data and send it
  Menu.getActualWeek((err, result) => {
    result.forEach((item) => {
      const menu = Formatter.menu(session, item);
      session.send(menu);
    });

    session.endDialog('pru');
  });

});

module.exports = library;
