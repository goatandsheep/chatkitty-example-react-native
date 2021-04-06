/* eslint-disable no-console */

export default class Logger {
  /**
   * Centralized logger controlled by environment
   * @constructor
   * @param {String} name
   * @param {String} level
   */
  constructor(name, level) {
    this.name = typeof name !== 'undefined' ? name : '';
    this.level = typeof level !== 'undefined' ? level : 'NONE';
  }

  /**
   * Logs debug messages
   * @param {String} title
   * @param {String} msg
   */
  debug(title, msg) {
    if (typeof msg === 'undefined') {
      msg = title;
      title = '';
    }
    if (this.level !== 'NONE') {
      if (this.name || title) {
        console.debug(
          (title ? `${title}` : '') + (this.name ? `[${this.name}]` : ''),
          msg
        );
      } else {
        console.debug(msg);
      }
    }
  }

  /**
   * Logs error messages
   * @param {String} title
   * @param {String} msg
   */
  error(title, msg) {
    if (typeof msg === 'undefined') {
      msg = title;
      title = '';
    }
    if (this.level !== 'NONE') {
      if (this.name || title) {
        console.error(
          (title ? `${title}` : '') + (this.name ? `[${this.name}]` : ''),
          msg
        );
      } else {
        console.error(msg);
      }
    }
  }

  /**
   * Logs info messages
   * @param {String} title
   * @param {String} msg
   */
  info(title, msg) {
    if (typeof msg === 'undefined') {
      msg = title;
      title = '';
    }
    if (this.level !== 'NONE') {
      if (this.name || title) {
        console.info(
          (title ? `${title}` : '') + (this.name ? `[${this.name}]` : ''),
          msg
        );
      } else {
        console.info(msg);
      }
    }
  }

  /**
   * Logs warning messages
   * @param {String} title
   * @param {String} msg
   */
  warn(title, msg) {
    if (typeof msg === 'undefined') {
      msg = title;
      title = '';
    }
    if (this.level !== 'NONE') {
      if (this.name || title) {
        console.warn(
          (title ? `${title}` : '') + (this.name ? `[${this.name}]` : ''),
          msg
        );
      } else {
        console.warn(msg);
      }
    }
  }
}
