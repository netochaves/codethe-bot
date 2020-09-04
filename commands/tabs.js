const {allTabs, updateTab} = require('../tabs');

module.exports = {
  list: {
    name: '!contas',
    description: 'Lista todos os débitos',
    async execute(msg) {
      const tabs = await allTabs();
      msg.channel.send(tabs);
    }
  },
  add: {
    name: '!poenaconta',
    description: 'Adiciona um débito na conta de alguém',
    async execute(msg, [debtor, type, quantity = 1]) {
      const response = await updateTab(
        debtor,
        type,
        parseInt(quantity, 10)
      );
      msg.channel.send(response);
    }
  },
  remove: {
    name: '!pagou',
    description: 'Remove débitos na conta de alguém',
    async execute(msg, [debtor, type, quantity = 1]) {
      const response = await updateTab(
        debtor,
        type,
        -1 * parseInt(quantity, 10)
      );
      msg.channel.send(response);
    }
  },
};

