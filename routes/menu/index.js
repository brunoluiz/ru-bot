const Menu = require('../../models/Menu');
const Router = require('restify-router').Router;

const MenuRouter = new Router();

// add a route like you would on a restify server instance
MenuRouter.get('/api/menu/', (req, res) => Menu
  .getActualWeek((err, result) => res.send(result)));

module.exports = MenuRouter;
