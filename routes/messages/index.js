const connector = require('../../bot').connector;
const Router = require('restify-router').Router;

const MessagesRouter = new Router();

MessagesRouter.post('/api/messages', connector.listen());

module.exports = MessagesRouter;
