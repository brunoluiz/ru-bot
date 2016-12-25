const I18n = require('../../helpers/I18n');
const builder = require('botbuilder');
const library = new builder.Library('Help');

let options = {};

library.dialog('Options', [(session) => {
  options[I18n(session, 'options:subscribe')] = {id: 'Subscribe:Subscribe'};
  options[I18n(session, 'options:todaymenu')] = {id: 'Menu:Today'};
  options[I18n(session, 'options:tmrwmenu')] = {id: 'Menu:Tomorrow'};
  options[I18n(session, 'options:weekmenu')] = {id: 'Menu:Week'};

  builder.Prompts.choice(session, 'help', options, {
    maxRetries: 0
  });
}, (session, results) => {
  if (results.response) {
    const option = options[results.response.entity];
    session.replaceDialog(option.id);
  } else {
    session.endDialog('options:notvalid');
  }
}]);

module.exports = library;
