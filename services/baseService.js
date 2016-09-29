const BASE_URL = 'https://people.cit.com.br/search/json/';
var conf       = require('../config/config');

const OPTIONS = {
  auth: {
    user: conf.api.user,
    password: conf.api.password
  }
}
;
module.exports = {
  BASE_URL: BASE_URL,
  OPTIONS : OPTIONS
};