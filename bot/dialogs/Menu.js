const builder = require('botbuilder');
const fs = require('fs');
const Formatter = require('../../helpers/Formatter');
const Utils = require('../../helpers/Utils');
const moment = require('moment');
const Menu = require('../../models/Menu');

const library = new builder.Library('Menu');

const url = process.env.URL || 'http://localhost:'+process.env.PORT;

const cardImages = [
    url + '/public/assets/images/food-1.jpg',
    url + '/public/assets/images/food-2.jpg',
    url + '/public/assets/images/food-3.jpg',
    url + '/public/assets/images/food-4.jpg',
    url + '/public/assets/images/food-5.jpg',
    url + '/public/assets/images/food-6.jpg',
    url + '/public/assets/images/food-7.jpg',
    url + '/public/assets/images/food-8.jpg'
];

const getButtonLabel = (date) => {
  const dateMoment = moment(date).locale('pt-br').utc();
  const dateNumber = dateMoment.format('DD/M/YY');
  const dateString = dateMoment.format('dddd');
  return dateString + ' (' + dateNumber + ')';
};

// Get the specified date menu item
const getMenu = (session, date) => (
  Menu.getDay(date, (err, result) => {
    if (err || !result) return session.endDialog('menu:error');

    session.sendTyping();

    // Format the menu and send it
    let menu = Formatter.menu(session, result);
    session.endDialog(menu);
  })
);

library.dialog('Today', (session) => {
  const date = moment().utc().toDate().setUTCHours(0,0,0,0);
  return getMenu(session, date);
});
library.dialog('Tomorrow', (session) => {
  const date = moment().add(1, 'day').utc().toDate().setUTCHours(0,0,0,0);
  return getMenu(session, date);
});
library.dialog('Day', (session, results, next) => {
  const date = JSON.parse(results.data).date;
  return getMenu(session, date);
});

library.dialog('Week', [(session) => {
  session.sendTyping();

  // Fetch the menu data and send it
  Menu.getActualWeek((err, result) => {
    let cards = new Array();

    result.sort((a,b) =>
      moment(a.date).isAfter(moment(a.b)) ? -1 : 1
    ).forEach((item, index) => {
      const payload  = JSON.stringify({date: item.date});

      const date = moment(item.date).locale('pt-br').utc();
      const dateNumber = date.format('DD/M/YY');
      const dateString = date.format('dddd');
      const title = dateString + ' (' + dateNumber + ')';

      const action   = builder.CardAction.dialogAction(session, 'Menu', payload, dateString);

      const card = new builder.ThumbnailCard(session)
        .title(title)
        .images([
          builder.CardImage.create(session, Utils.shuffle(cardImages)[index])
        ])
        .buttons([action])
        .tap(action);

      cards.push(card);
    });

    const carousel = new builder.Message(session)
        .textFormat(builder.TextFormat.xml)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);

    session.endDialog(carousel);
  });

}]);

module.exports = library;
