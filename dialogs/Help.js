const builder = require('botbuilder');
const library = new builder.Library('Help');

const pru = '**Pruuu!** ';
const options = {
  'Quero o cardápio de hoje': {
    id: 'Menu:Today'
  },
  'Quero o cardápio de amanhã': {
    id: 'Menu:Tomorrow'
  },
  'Quero o cardápio da semana': {
    id: 'Menu:Week'
  }
}

library.dialog('Options', [(session) => {
  builder.Prompts.choice(session,
    pru + 'Não entendi o que você pediu... o que você quer?',
    options, {
      maxRetries: 0
    });
}, (session, results) => {
  if (results.response) {
    const option = options[results.response.entity];
    session.replaceDialog(option.id);
  }

  session.endDialog();
}]);

module.exports = library;
module.exports.options = options;
