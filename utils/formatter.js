const Formatter = {
  menu: function(item) {
    if(!item) return '';

    let menu = '### Cardápio de ' + item.date + '\n\n';

    menu += (item.basics) ? ('- **Acompanhamento:** ' + item.basics + '\n\n') : '';

    menu += (item.main_dish) ? ('- **Prato principal:** ' + item.main_dish + '\n\n') : '';
    menu += (item.side_dish) ? ('- **Complemento:** ' + item.side_dish + '\n\n') : '';
    menu += (item.salad) ? ('- **Salada:** ' + item.salad + '\n\n') : '';
    menu += (item.dessert) ? ('- **Sobremesa:** ' + item.dessert + '\n\n') : '';

    return menu;
  }
}

module.exports = Formatter;
