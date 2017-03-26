const Subscription = require('../../models/Subscription');
const Router = require('restify-router').Router;
const bot = require('../../bot').bot;

const NotifyRouter = new Router();

// add a route like you would on a restify server instance
NotifyRouter.post('/api/notify/:token', (req, res, next) => {
  if (req.params.token !== process.env.SECTOKEN) {
    res.send(401);
  }

  // Get all subscriptions and send the Today's Menu
  Subscription.find().exec((err, subscriptions) =>
    subscriptions.forEach(subscription =>
      bot.beginDialog(subscription.address, 'Menu:Today')));

  res.send(201);
  return next();
});

module.exports = NotifyRouter;
