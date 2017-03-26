const builder = require('botbuilder');
const Subscription = require('../../models/Subscription');
const console = require('console');

const library = new builder.Library('Subscription');
const isResponseYes = results => (results.response && results.response.entity === 'yes');

// ENTRY POINT
library.dialog('Subscription', session => Subscription.isSubscribed(session, (result) => {
  if (result) {
    session.send('alreadysubscribed');
    return session.replaceDialog('Subscription:Cancel');
  }

  session.send('notsubscribed');
  return session.replaceDialog('Subscription:Subscribe');
}));

// SUBSCRIBE DIALOG
library.dialog('Subscribe', [(session) => {
  builder.Prompts.choice(session, 'prompt', ['yes', 'no'], {
    maxRetries: 0,
    promptAfterAction: false,
  });
}, (session, results, next) => {
  if (isResponseYes(results)) return next();

  return session.endDialog('notconfirmed');
}, (session) => {
  session.sendTyping();

  Subscription.collection.insert({
    user: session.message.address.user,
    address: session.message.address,
  });

  session.endDialog('confirmed');
}]);

// CANCEL DIALOG
library.dialog('Cancel', [(session) => {
  builder.Prompts.choice(session, 'cancel', ['yes', 'no'], {
    maxRetries: 0,
    promptAfterAction: false,
  });
}, (session, results, next) => {
  if (isResponseYes(results)) return next();

  return session.endDialog('notcanceled');
}, (session) => {
  session.sendTyping();

  Subscription.remove({
    user: session.message.address.user,
  }, err => console.log(err));

  session.endDialog('canceled');
}]);

module.exports = library;
