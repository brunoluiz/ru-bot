const axios = require('axios');
const cheerio = require('cheerio');
const Menu = require('../../models/Menu');
const Router = require('restify-router').Router;
const restify = require('restify');
const moment = require('moment');

const authMiddleware = require('../middlewares/authMiddleware');

const ScrapRouter = new Router();

// add a route like you would on a restify server instance
ScrapRouter.post('/api/scrap/:token',
  (req, res, next) => authMiddleware(req, res, next),
  (req, res, next) => axios.get('http://ru.ufsc.br/ru/')
    .then((response) => {
      const items = [];

      // Loads the HTML to the Cherrio lib
      const $ = cheerio.load(response.data);

      // First things first: define the start and end date of this menu
      const dateEl = $('p:nth-child(1) > span:first-child').text();
      const dateRange = dateEl.match(/([0-9]*)\/([0-9]*)/g);
      const startDateStr = dateRange[0];
      // const endDateStr = dateRange[1];
      const year = $('.last-update').text().match(/[0-9]{4}/)[0];

      // Get the start date Date object
      const dateInfo = startDateStr.split('/');
      const month = dateInfo[1];
      const day = dateInfo[0];
      const startDate = moment(`${year}-${month}-${day}`);

      // Get the menu's table and iterate over it
      const rows = $('table:nth-child(4) > tbody > tr').toArray();
      rows.forEach((row, index) => {
        if (index === 0) return;

        // Get all the columns
        const cols = $(row).find('td');

        // Push the item
        items.push({
          date: moment(startDate).add(index - 1, 'day').utc().toDate(),
          basics: `${$(cols[1]).text().trim()} / ${$(cols[2]).text().trim()}`,
          main_dish: $(cols[3]).text().trim(),
          side_dish: $(cols[4]).text().trim(),
          salad: $(cols[5]).text().trim(),
          dessert: $(cols[6]).text().trim(),
        });
      });

      return items;
    })
    .catch(() => Promise.reject(new restify.errors.MethodNotAllowedError('Scrapping Error')))
    .then(items => Menu.collection
      .insert(items)
      .catch(() => Promise.reject(new restify.errors.MethodNotAllowedError('Mongoose Error'))))
    .then(() => {
      res.send(200);
      return next();
    })
    .catch(error => next(error)));

module.exports = ScrapRouter;
