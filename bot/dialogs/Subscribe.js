const builder = require('botbuilder');
const library = new builder.Library('Subscribe');
const Subscription = require('../../models/Subscription');

// ENTRY POINT
library.dialog('CheckStatus',
(session) => Subscription.isSubscribed(session, (result) => {
  if (result) {
    session.send('subscribe:alreadysubscribed');
    return session.replaceDialog('Subscribe:Cancel');
  } else {
    session.send('subscribe:notsubscribed');
    return session.replaceDialog('Subscribe:Subscribe');
  }
}));

// SUBSCRIBE DIALOG

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

  session.endDialog('subscribe:notconfirmed');
}, (session, results, next) => {
  session.sendTyping();

  Subscription.collection.insert({
    user: session.message.address.user,
    address: session.message.address
  });

  session.endDialog('subscribe:confirmed');
}]);

// CANCEL DIALOG

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

  session.endDialog('subscribe:notcanceled');
}, (session, results, next) => {
  session.sendTyping();

  Subscription.remove({
    user: session.message.address.user
  }, (err) => console.log(err));

  session.endDialog('subscribe:canceled');
}]);

module.exports = library;
