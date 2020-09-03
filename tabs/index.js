const {tabs} = require('../firebase');

const DEBTS_TYPES = {
  pizza: '🍕',
  churras: '🥩',
  cerva: '🍺',
};

function formattedTab(tab) {
  let debts = '';
  for (let type in DEBTS_TYPES) {
    let debt = tab[type];
    if (debt && debt > 0) {
      if (debts.length > 0)
        debts += ', ';
      debts += `${DEBTS_TYPES[type]}: ${debt}`;
    }
  }
  if (debts.length == 0)
    return '';

  return `${tab.debtor} = { ${debts} }\n`;
}

async function allTabs() {
  let message = '';
  return tabs.get()
    .then(
      (querySnapshot) => new Promise(
        (resolve) => {
          if (querySnapshot.docs && querySnapshot.size > 0) {
            message = querySnapshot.docs.reduce((msg, tab) => msg + formattedTab(tab.data()), '');
          }
          if (message.length == 0)
            message = 'Nenhum débito encontrado';
          resolve(message);
        }
      )
    );
}

async function updateTab(debtor, type, quantity) {
  if (!debtor)
    return Promise.resolve('Quem está devendo o que?');

  if (!type || !DEBTS_TYPES[type])
    return Promise.resolve(`O que ${debtor} vai pagar?`);

  if (!quantity || quantity == 0)
    return Promise.resolve('Quantidade inválida');

  let data = {debtor};

  return tabs.where('debtor', '==', debtor)
    .get()
    .then(
      (querySnapshot) => new Promise(
        (resolve) => {
          if (!querySnapshot.docs || querySnapshot.size == 0) {
            data[type] = Math.max(quantity, 0);
            tabs.add(data);
          } else {
            const doc = querySnapshot.docs[0];
            data = doc.data();
            data[type] = data[type] || 0;
            data[type] += quantity;
            doc.ref.update(data);
          }

          const message = quantity > 0 ?
            `Adicionado ${quantity} ${DEBTS_TYPES[type]} para ${debtor}` :
            `${debtor} pagou ${quantity} ${DEBTS_TYPES[type]}`;
          resolve(message);
        }
      )
    );
}


module.exports = {
  allTabs,
  updateTab
};
