const addContext = require("./addContext");
const addExample = require("./addExample");
const createPrompt = require("./createPrompt");
const predict = require("./predict");
const addGoodPrediction = require("./addGoodPrediction");
const suggest = require("./suggest");
const initAlita = require("./initAlita");
const syncPrompts = require("./syncPrompts");
const syncEmbeddings = require("./syncEmbeddings");
const onConfigChange = require("./onConfigChange");

module.exports = {
  addExample,
  addContext,
  createPrompt,
  predict,
  addGoodPrediction,
  suggest,
  initAlita,
  syncPrompts,
  syncEmbeddings,
  onConfigChange
};
