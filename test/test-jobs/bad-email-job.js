'use strict';

class EmailJob {
  /**
   * Handle job
   * @param {string} email
   * @param {string} subject
   */
  * handle(email, subject) {
    throw new Error('Cannot send email');
    console.log(`Sending email to ${email} with the subject ${subject}`);
  }

  /**
   * Handle job failure
   * @param {string} email
   * @param {string} subject
   */
  * failed(email, subject) {
    console.error(`Failed sending email to ${email} with the subject ${subject}`);
  }
}

module.exports = EmailJob;
