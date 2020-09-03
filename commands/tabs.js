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
    async execute(msg, args) {
      const response = await updateTab(
        args[0],
        args[1],
        parseInt(args[2] || 1, 10)
      );
      msg.channel.send(response);
    }
  },
  remove: {
    name: '!pagou',
    description: 'Remove débitos na conta de alguém',
    async execute(msg, args) {
      const response = await updateTab(args[0], args[1], -1 * parseInt(args[2] || 1, 10));
      msg.channel.send(response);
    }
  },
};

