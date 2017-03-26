const builder = require('botbuilder');
const Formatter = require('../../helpers/Formatter');
const Utils = require('../../helpers/Utils');
const I18n = require('../../helpers/I18n');
const foods = require('../foods.js');
const moment = require('moment');
const Menu = require('../../models/Menu');

const library = new builder.Library('Menu');

// Get the specified date menu item
const getMenu = (session, date) => Menu.getDay(date, (err, result) => {
  if (err || !result) return session.endDialog('error');

  session.sendTyping();

  // Format the menu and send it
  const menu = Formatter.menu(session, result);
  return session.endDialog(menu);
});

library.dialog('Today', (session) => {
  const date = moment().startOf('day').toDate();
  return getMenu(session, date);
});

library.dialog('Tomorrow', (session) => {
  const date = moment()
    .startOf('day')
    .add(1, 'day')
    .toDate();
  return getMenu(session, date);
});

library.dialog('Day', (session, results) => {
  const date = JSON.parse(results.data).date;
  return getMenu(session, date);
});

library.dialog('Menu', [(session, results, next) => {
  session.sendTyping();
  return next();
}, session => Menu.getActualWeek((err, result) => {
  const cards = [];
  const images = Utils.shuffle(foods);

  const menu = result
    .filter(item => moment(item.date).isSameOrAfter(moment(), 'day'))
    .sort((a, b) => (moment(a.date).isAfter(b.date) ? 1 : -1));

  if (menu.length === 0) return session.endDialog('error');

  menu.forEach((item, index) => {
    const payload = JSON.stringify({ date: item.date });

    const date = moment(item.date).locale('pt-br').utc();
    const dateNumber = date.format('DD/M/YY');
    const dateString = date.format('dddd');
    const title = `${dateString} (${dateNumber})`;

    const buttonText = `${I18n(session, 'view')} ${dateString}`;
    const button = builder.CardAction.dialogAction(session, 'DayMenu', payload, buttonText);

    const card = new builder.ThumbnailCard(session)
      .title(title)
      .images([builder.CardImage.create(session, images[index])])
      .buttons([button])
      .tap(button);

    cards.push(card);
  });

  const carousel = new builder.Message(session)
      .textFormat(builder.TextFormat.xml)
      .attachmentLayout(builder.AttachmentLayout.carousel)
      .attachments(cards);

  return session.endDialog(carousel);
})]);

module.exports = library;
