/**
 * Printer.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: 'number', autoIncrement: true },
    cyan: { type: 'number', required: true },
    yellow: { type: 'number', required: true },
    magenta: { type: 'number', required: true },
    black: { type: 'number', required: true },
  },
};

