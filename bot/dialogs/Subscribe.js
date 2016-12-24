const builder = require('botbuilder');
const library = new builder.Library('Subscribe');

library.dialog('Subscribe', [(session) => {
  const yesOrNoOptions = ['Sim', 'Não'];
  builder.Prompts.choice(session, 'subscribe:ask', yesOrNoOptions, {
    maxRetries: 0
  });
}, (session, results, next) => {

  if (results.response) {
    const option = results.response.entity;
    if (option == 'Sim') return next();
  }

  session.send('subscribe:notconfirmed');
  session.endDialog();
}, (session, results, next) => {
  session.send('subscribe:confirmed');
  session.endDialog();
}]);

module.exports = library;
