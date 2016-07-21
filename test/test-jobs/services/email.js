'use strict';

const Promise = require('bluebird');

/**
 * Mock email service
 */
class Email {
  constructor(client) {
    this.client = client;
  }

  send(address, subject, body) {
    return new Promise((resolve, reject) => {
      this.client.send(address, subject, body, (error, result) => {
        if (error) reject(error);

        resolve(result);
      });
    });
  }
}

module.exports = Email;
