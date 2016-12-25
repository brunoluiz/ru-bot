const I18n = require('../../helpers/I18n');
const builder = require('botbuilder');
const library = new builder.Library('Welcome');

let options = {};

const url = process.env.URL || 'http://localhost:'+process.env.PORT;

library.dialog('Greeting', (session, results, next) => {
  options[I18n(session, 'options:subscribe')] = {id: 'Subscribe:CheckStatus'};
  options[I18n(session, 'options:todaymenu')] = {id: 'Menu:Today'};
  options[I18n(session, 'options:tmrwmenu')] = {id: 'Menu:Tomorrow'};
  options[I18n(session, 'options:weekmenu')] = {id: 'Menu:Week'};

  let buttons = [
    builder.CardAction.dialogAction(session, 'Subscriptions', {}, 'options:subscribe'),
    builder.CardAction.dialogAction(session, 'TodaysMenu', {}, 'options:todaymenu'),
    // builder.CardAction.dialogAction(session, 'TomorrowsMenu', {}, 'options:tmrwmenu'),
    builder.CardAction.dialogAction(session, 'WeeksMenu', {}, 'options:weekmenu')
  ];

  const card = new builder.HeroCard(session)
    .title('whoami')
    .subtitle('help:label')
    .images([
        builder.CardImage.create(session, url + '/public/assets/images/hero_pigeon.jpg')
    ])
    .buttons(buttons);

  let msg = new builder.Message(session).addAttachment(card);
  session.send(msg);
});

module.exports = library;
