const firebase = require('firebase');
const config = require('./config.js');

var app = firebase.initializeApp(config);

const store = app.firestore();
const tabs = store.collection('tabs');

module.exports = {
  store,
  tabs,
};
