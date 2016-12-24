const builder = require('botbuilder');

const library = new builder.Library('Help');

const pru = '**Pruuu!** ';
const options = {
  'Quero o cardápio de hoje': {
    uri: 'Menu:Today'
  },
  'Quero o cardápio de amanhã': {
    uri: 'Menu:Tomorrow'
  },
  'Quero o cardápio da semana': {
    uri: 'Menu:Week'
  }
}

library.dialog('Options', (session) => {
  builder.Prompts.choice(session,
    pru + 'Não entendi o que você pediu... o que você quer?',
    options, {
      maxRetries: 0
    });
});

module.exports = library;
module.exports.options = options;
