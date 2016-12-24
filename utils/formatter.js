const Formatter = {
  menu: function(item) {
    if(!item) {
      return '';
    }

    let menu = '';
    menu += '### ' + item.date + '\n\n';
    menu += '- **Acompanhamento:** ' + item.basics + '\n\n';
    menu += '- **Prato principal:** ' + item.main_dish + '\n\n';
    menu += '- **Complemento:** ' + item.side_dish + '\n\n';
    menu += '- **Salada:** ' + item.salad + '\n\n';
    menu += '- **Sobremesa:** ' + item.dessert + '\n\n';

    return menu;
  }
}

module.exports = Formatter;
