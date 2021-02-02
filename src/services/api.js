const axios = require('axios');

const api = axios.create({
  baseURL: 'https://alumia.instructure.com/api/v1'
})

module.exports = api;
