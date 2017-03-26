const Menu = require('../../models/Menu');
const Router = require('restify-router').Router;
const console = require('console');

const MenuRouter = new Router();

// add a route like you would on a restify server instance
MenuRouter.get('/api/menu/', (req, res, next) =>
  Menu.getActualWeek((err, result) => {
    res.send(result);
    next();
  }).catch(error => console.log(error)));

module.exports = MenuRouter;
