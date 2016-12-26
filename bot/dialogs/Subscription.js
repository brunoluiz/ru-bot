const builder = require('botbuilder');
const library = new builder.Library('Subscription');
const Subscription = require('../../models/Subscription');

// ENTRY POINT
library.dialog('Subscription',
(session) => Subscription.isSubscribed(session, (result) => {
  if (result) {
    session.send('subscription:alreadysubscribed');
    return session.replaceDialog('Subscription:Cancel');
  } else {
    session.send('subscription:notsubscribed');
    return session.replaceDialog('Subscription:Subscribe');
  }
}));

// SUBSCRIBE DIALOG

library.dialog('Subscribe', [(session) => {
  builder.Prompts.choice(session, 'subscription:prompt', ['yes', 'no'], {
    maxRetries: 0
  });
}, (session, results, next) => {
  if (results.response) {
    const option = results.response.entity;
    if (option == 'Sim') return next();
  }

  session.endDialog('subscription:notconfirmed');
}, (session, results, next) => {
  session.sendTyping();

  Subscription.collection.insert({
    user: session.message.address.user,
    address: session.message.address
  });

  session.endDialog('subscription:confirmed');
}]);

// CANCEL DIALOG

library.dialog('Cancel', [(session) => {
  builder.Prompts.choice(session, 'subscription:cancel', ['yes', 'no'], {
    maxRetries: 0
  });
}, (session, results, next) => {
  if (results.response) {
    const option = results.response.entity;
    if (option == 'yes') return next();
  }

  session.endDialog('subscription:notcanceled');
}, (session, results, next) => {
  session.sendTyping();

  Subscription.remove({
    user: session.message.address.user
  }, (err) => console.log(err));

  session.endDialog('subscription:canceled');
}]);

module.exports = library;
