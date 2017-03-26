const restify = require('restify');
const mongoose = require('mongoose');
const console = require('console');

const ScrapRouter = require('./routes/scrap');
const MessagesRouter = require('./routes/messages');
const NotifyRouter = require('./routes/scrap');
const MenuRouter = require('./routes/menu');

// Connect to the MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.PORT || 3978, () =>
  console.log('%s listening to %s', server.name, server.url));

MessagesRouter.applyRoutes(server);
ScrapRouter.applyRoutes(server);
NotifyRouter.applyRoutes(server);
MenuRouter.applyRoutes(server);

server.get(/\/public\/?.*/, restify.serveStatic({
  directory: __dirname,
}));
