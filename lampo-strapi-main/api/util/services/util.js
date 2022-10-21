const axios = require('axios');
const fs = require('fs');


module.exports = {

  /**
   * Refresh Scheduler token when called
   * @returns {Promise<string>}
   */
  async refreshToken() {
    const entity = await strapi.services.scheduler.find();
    const body = {identifier: entity.username, password: entity.password};
    try {
      const res = await axios.post(entity.url, body);
      console.log('Request to scheduler was success');
      const updated = await strapi.query('scheduler').update({id: entity.id}, {token: res.data.jwt});
      return res.data.jwt;
    } catch (e) {
      console.log('Failed to refresh token', e);
    }
    return '';
  },

  /**
   * This function is used to read html files from templates directory,
   * this can also be used to read other files
   * @param path Path of file
   * @returns {Promise<string|null>}
   */
  async readHTMLFile(path) {
    try {
      const file = fs.readFileSync(path, {encoding: 'utf-8'});
      console.log('Got file');
      return file;
    } catch (e) {
      console.log('Unable to read file!', e);
      return null;
    }
  },

};
