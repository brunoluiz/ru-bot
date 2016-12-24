const builder = require('botbuilder');
const fs = require('fs');
const Formatter = require('../../helpers/formatter');
const Menu = require('../../models/Menu');

const library = new builder.Library('Menu');

const sendDayMenu = (session, offset) => {
  // Create the date object, based on the specified object
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Reset the hours
  let offsetDate = today.setDate(today.getDate() + offset);

  // Get the specified date menu item
  Menu.getDay(offsetDate, (err, result) => {
    if (err || !result) session.replaceDialog('Menu:Error');

    // Format the menu and send it
    let menu = Formatter.menu(session, result);
    session.send(menu);
    session.send('pru');
    session.endDialog();
  });
}

library.dialog('Today', (session) => sendDayMenu(session, 0));

library.dialog('Tomorrow', (session) => sendDayMenu(session, 1));

library.dialog('Error', (session) => {
  session.send('menu:error');
  session.endDialog();
});

library.dialog('Week', (session) => {
  // if (!ruData) session.replaceDialog('Menu:Error');

  session.send('menu:weektitle');
  session.sendTyping();

  // Fetch the menu data and send it
  Menu.getActualWeek((err, result) => {
    result.forEach((item) => {
      const menu = Formatter.menu(session, item);
      session.send(menu);
    });
  });

  session.send('pru');
  session.endDialog();
});

module.exports = library;
