const Subscription = require('../../models/Subscription');
const Router = require('restify-router').Router;
const Menu = require('../../models/Menu');
const moment = require('moment');
const restify = require('restify');
const bot = require('../../bot').bot;

const NotifyRouter = new Router();

NotifyRouter.post('/api/notify/:token', (req, res, next) =>
  ((req.params.token !== process.env.SECTOKEN) ?
    next(new restify.errors.UnauthorizedError()) : next())
, (req, res, next) => {
  // Check if there is a menu to notify users about
  const today = moment().startOf('day').toDate();
  Menu.getDay(today, (err, menu) =>
    ((err || !menu) ? next(new restify.errors.MethodNotAllowedError('Empty Menu')) : next()));
}, (req, res, next) => Subscription.find().exec((err, subscriptions) => {
  subscriptions.forEach(subscription =>
    bot.beginDialog(subscription.address, 'Menu:Today'));

  res.send(200);
  return next();
}));

module.exports = NotifyRouter;
