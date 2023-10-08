const axios = require("axios");

module.exports = class Request {
  constructor(url, options) {
    this._options = options || {};
    this._url = url;
  }

  options(options) {
    this._options = options || {};
    return this;
  }

  method(name) {
    this._options.method = name;
    return this;
  }

  headers(headers, isNew) {
    this._options.headers = isNew
      ? headers
      : { ...this._options.headers, ...headers };
    return this;
  }

  body(data) {
    this._options.data = data;
    return this;
  }

  auth(type, value) {
    switch (type) {
      case "Bearer":
        this._options.headers = { Authorization: `Bearer ${value}` };
        break;
      case "Basic":
        this._options.headers = { Authorization: `Basic ${value}` };
        break;
      case "Cookies":
        this._options.headers = { Cookies: value };
        break;
      default:
        this._options.headers = { Authorization: `Bearer ${value}` };
    }
    return this;
  }

  qs(params) {
    this._options.params = params;
    return this;
  }

  send() {
    return axios(this._url, this._options);
  }
};
