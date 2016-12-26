const I18n = require('../../helpers/I18n');
const builder = require('botbuilder');
const library = new builder.Library('Welcome');

let options = {};

const url = process.env.URL || 'http://localhost:'+process.env.PORT;

library.dialog('Welcome', (session, results, next) => {
  options[I18n(session, 'options:subscribe')] = {id: 'Subscription:Subscription'};
  options[I18n(session, 'options:todaymenu')] = {id: 'Menu:Today'};
  options[I18n(session, 'options:tmrwmenu')] = {id: 'Menu:Tomorrow'};
  options[I18n(session, 'options:weekmenu')] = {id: 'Menu:Menu'};

  let buttons = [
    builder.CardAction.dialogAction(session, 'Subscriptions', {}, 'options:subscribe'),
    // builder.CardAction.dialogAction(session, 'TodaysMenu', {}, 'options:todaymenu'),
    // builder.CardAction.dialogAction(session, 'TomorrowsMenu', {}, 'options:tmrwmenu'),
    builder.CardAction.dialogAction(session, 'WeeksMenu', {}, 'options:menu'),
    builder.CardAction.dialogAction(session, 'Info', {}, 'options:info')
  ];

  const card = new builder.HeroCard(session)
    .title('whoami')
    .text('help:label')
    .images([
        builder.CardImage.create(session, url + '/public/assets/images/hero_pigeon.jpg')
    ])
    .buttons(buttons);

  let msg = new builder.Message(session).addAttachment(card);
  session.endDialog(msg);
});

library.dialog('Greeting', (session, results, next) => {
  session.replaceDialog('Welcome:Welcome');
  session.send('greeting');
});

module.exports = library;
