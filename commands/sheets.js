const getData = require('../sheets/index');
module.exports = {
  name: '!caixinha',
  description: '!caixinha',
  async execute(msg, args) {
    msg.channel.send(`Temos ${await getData()} R$ na caixinha`);
  }
};
