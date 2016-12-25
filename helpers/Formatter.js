const I18n = require ('./I18n')

// Format the string as a markdown strong list item
const label = (str) => (
  '- **' + str + ': **'
);

const Formatter = {
  menu: function(session, item) {
    if(!item) return '';

    const locale = {
      title: I18n(session, 'menu:format:title'),
      basics: I18n(session, 'menu:format:basics'),
      main_dish: I18n(session, 'menu:format:main_dish'),
      side_dish: I18n(session, 'menu:format:side_dish'),
      salad: I18n(session, 'menu:format:salad'),
      dessert: I18n(session, 'menu:format:dessert'),
    }

    // Format the date as DD/MM/YYYY
    let date = item.date.getUTCDate() + '/';
    date += item.date.getUTCMonth() + '/';
    date += item.date.getUTCFullYear();

    // Format the menu string as a Markdown string
    let menu = '### ' + locale.title + date + '\n\n';
    menu += (item.basics) ? (label(locale.basics) + item.basics + '\n\n') : '';
    menu += (item.main_dish) ? (label(locale.main_dish) + item.main_dish + '\n\n') : '';
    menu += (item.side_dish) ? (label(locale.side_dish) + item.side_dish + '\n\n') : '';
    menu += (item.salad) ? (label(locale.salad) + item.salad + '\n\n') : '';
    menu += (item.dessert) ? (label(locale.dessert) + item.dessert + '\n\n') : '';

    return menu;
  }
}

module.exports = Formatter;
