const label = (str) => (
  '- **' + str + ': **'
);

const Formatter = {
  menu: function(session, item) {
    if(!item) return '';

    const locale = {
      title: session.localizer.gettext(session.preferredLocale(), 'menu:format:title'),
      basics: session.localizer.gettext(session.preferredLocale(), 'menu:format:basics'),
      main_dish: session.localizer.gettext(session.preferredLocale(), 'menu:format:main_dish'),
      side_dish: session.localizer.gettext(session.preferredLocale(), 'menu:format:side_dish'),
      salad: session.localizer.gettext(session.preferredLocale(), 'menu:format:salad'),
      dessert: session.localizer.gettext(session.preferredLocale(), 'menu:format:dessert'),
    }

    let date = item.date.getUTCDate() + '/';
    date += item.date.getUTCMonth() + '/';
    date += item.date.getUTCFullYear();

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
