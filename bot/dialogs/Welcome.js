const I18n = require('../../helpers/I18n');
const builder = require('botbuilder');
const library = new builder.Library('Welcome');

let options = {};

library.dialog('Greeting', [(session) => {
  options[I18n(session, 'options:subscribe')] = {id: 'Subscribe:CheckStatus'};
  options[I18n(session, 'options:todaymenu')] = {id: 'Menu:Today'};
  options[I18n(session, 'options:tmrwmenu')] = {id: 'Menu:Tomorrow'};
  options[I18n(session, 'options:weekmenu')] = {id: 'Menu:Week'};

  builder.Prompts.choice(session, 'greeting', options, {
    maxRetries: 0
  });
}, (session, results, next) => {
  if (!results.response) {
    return session.endConversation('options:notvalid');
  }

  const option = options[results.response.entity];
  session.sendTyping();
  session.replaceDialog(option.id);
}]);

module.exports = library;
