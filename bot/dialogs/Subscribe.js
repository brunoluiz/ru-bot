const builder = require('botbuilder');
const library = new builder.Library('Subscribe');
const Subscription = require('../../models/Subscription');

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
  session.sendTyping();

  Subscription.collection.insert({
    user: session.message.address.user,
    address: session.message.address
  });

  session.send('subscribe:confirmed');
  session.endDialog();
}]);

library.dialog('Cancel', [(session) => {
  const yesOrNoOptions = ['Sim', 'Não'];
  builder.Prompts.choice(session, 'subscribe:cancel', yesOrNoOptions, {
    maxRetries: 0
  });
}, (session, results, next) => {

  if (results.response) {
    const option = results.response.entity;
    if (option == 'Sim') return next();
  }

  session.send('subscribe:notcanceled');
  session.endDialog();
}, (session, results, next) => {
  session.sendTyping();

  Subscription.remove({
    user: session.message.address.user
  }, (err) => console.log(err));

  session.send('subscribe:canceled');
  session.endDialog();
}]);


module.exports = library;
