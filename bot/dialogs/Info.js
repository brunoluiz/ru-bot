const I18n = require('../../helpers/I18n');
const builder = require('botbuilder');
const library = new builder.Library('Info');

let options = {};

library.dialog('Info', [(session) => {
  options[I18n(session, 'info:timetable')] = {id: 'Info:Timetable'};
  options[I18n(session, 'info:prices')] = {id: 'Info:Prices'};
  options[I18n(session, 'info:credits')] = {id: 'Info:Credits'};

  builder.Prompts.choice(session, 'info:prompt', options, {
    maxRetries: 0
  });
}, (session, results) => {
  if (!results.response) {
    return session.endConversation('options:notvalid');
  }

  const option = options[results.response.entity];
  session.sendTyping();
  session.beginDialog(option.id);

  builder.Prompts.choice(session, 'info:prompt:again', ['yes' , 'no'], {
    maxRetries: 1
  });
}, (session, results) => {
  console.log('response', results.response);
  if (!results.response) {
    return session.endConversation('options:notvalid');
  } else if (results.response.entity == 'yes') {
    session.replaceDialog('Info:Info');
  } else {
    return session.endConversation();
  }
}]);

library.dialog('Prices', (session) => {
  session.send('info:prices');
  let prices = '';
  prices += '- ' + I18n(session, 'info:prices:student') + ': R$ 1.50\n';
  prices += '- ' + I18n(session, 'info:prices:uniemployees') + ': R$ 2.90\n';
  prices += '- ' + I18n(session, 'info:prices:others') + ': R$ 6.10\n';
  session.send(prices);
});

library.dialog('Timetable', (session) => {
  session.send('info:timetable:weekdays');
  session.send('info:timetable:weekends');
  session.send('info:timetable:ticketoffice');
});

library.dialog('Credits', (session) => {
  session.send('info:credits:team');
  session.send("info:credits:about");
});

module.exports = library;
