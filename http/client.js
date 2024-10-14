const axios = require("axios");
const OutputService = require("../services/output.service");
const { workspace } = require("vscode");
const { WORKSPACE } = require("../constants");

const isDebug = () => workspace.getConfiguration(WORKSPACE.EXTENSION.NAME).get(WORKSPACE.EXTENSION.PARAM.DEBUG);

const client = axios.create();

client.interceptors.request.use((config) => {
  if (isDebug()) {
    OutputService.logRequest(config);
  }

  return config;
});

client.interceptors.response.use(
  (response) => {
    if (isDebug()) {
      OutputService.logResponse(response);
    }

    return response;
  },
  (error) => {
    if (isDebug()) {
      OutputService.logResponseError(error);
    }

    return Promise.reject(error);
  }
);

module.exports = client;
