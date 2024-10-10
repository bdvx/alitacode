const axios = require("axios");
const OutputService = require("../services/output.service");

const client = axios.create();

client.interceptors.request.use((config) => {
  OutputService.logRequest(config);

  return config;
});

client.interceptors.response.use(
  (response) => {
    OutputService.logResponse(response);
    return response;
  },
  (error) => {
    OutputService.logResponseError(error);
    return Promise.reject(error);
  }
);

module.exports = client;
