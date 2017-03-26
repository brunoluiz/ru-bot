const I18n = require('../../helpers/I18n');
const builder = require('botbuilder');

const library = new builder.Library('Main');
const options = {};
const url = process.env.URL || `http://localhost:${process.env.PORT}`;

library.dialog('Main', (session) => {
  options[I18n(session, 'main:options:subscribe')] = { id: 'Subscription:Subscription' };
  options[I18n(session, 'main:options:todaymenu')] = { id: 'Menu:Today' };
  options[I18n(session, 'main:options:tmrwmenu')] = { id: 'Menu:Tomorrow' };
  options[I18n(session, 'main:options:weekmenu')] = { id: 'Menu:Menu' };

  const buttons = [
    builder.CardAction.dialogAction(session, 'Subscriptions', {}, 'options:subscribe'),
    // builder.CardAction.dialogAction(session, 'TodaysMenu', {}, 'options:todaymenu'),
    // builder.CardAction.dialogAction(session, 'TomorrowsMenu', {}, 'options:tmrwmenu'),
    builder.CardAction.dialogAction(session, 'WeeksMenu', {}, 'options:menu'),
    builder.CardAction.dialogAction(session, 'Info', {}, 'options:info'),
  ];

  const card = new builder.HeroCard(session)
    .title('whoami')
    .text('help:label')
    .images([
      builder.CardImage.create(session, `${url}/public/assets/images/hero_pigeon.jpg`),
    ])
    .buttons(buttons);

  const msg = new builder.Message(session).addAttachment(card);
  session.endDialog(msg);
});

library.dialog('Greeting', (session) => {
  session.replaceDialog('Main:Main');
  session.sendTyping();
  session.send('main:whoami');
  session.send('main:purpose');
  session.send('main:firstinteraction');
});

module.exports = library;
