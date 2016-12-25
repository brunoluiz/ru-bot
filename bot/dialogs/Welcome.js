const I18n = require('../../helpers/I18n');
const builder = require('botbuilder');
const library = new builder.Library('Welcome');

let options = {};

library.dialog('Greeting', [(session) => {
  options[I18n(session, 'options:subscribe')] = {id: 'Subscribe:Subscribe'};
  options[I18n(session, 'options:todaymenu')] = {id: 'Menu:Today'};
  options[I18n(session, 'options:tmrwmenu')] = {id: 'Menu:Tomorrow'};
  options[I18n(session, 'options:weekmenu')] = {id: 'Menu:Week'};

  builder.Prompts.choice(session, 'greeting', options, {
    maxRetries: 0
  });
}, (session, results, next) => {
  if (results.response) {
    const option = options[results.response.entity];
    session.replaceDialog(option.id);
  } else {
    session.send('options:notvalid');
    session.endDialog();
  }
}]);

module.exports = library;
