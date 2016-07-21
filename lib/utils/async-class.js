'use strict';

const co = require('co');

/**
 * [_methodKeys description]
 * @param  {[type]} target [description]
 * @return {[type]}        [description]
 */
const _methodKeys = function(target) {
  return Object.getOwnPropertyNames(target)
    .filter( key => {
      const descriptor = Object.getOwnPropertyDescriptor(target, key);
      return !descriptor.get && !descriptor.set;
    })
    .filter( key => typeof target[key] === 'function' );
};

/**
 * [_wrapFunctions description]
 * @param  {[type]} target [description]
 * @return {[type]}        [description]
 */
const _wrapFunctions = function(target) {
  _methodKeys(target).forEach( key => {
    let constructor = target[key].constructor.name;
    if(constructor === 'GeneratorFunction') {
      target[key] = co.wrap(target[key]);
    }
  });
};

/**
 * [exports description]
 * @param  {[type]} klass [description]
 * @return {[type]}       [description]
 */
module.exports = function(klass) {
  _wrapFunctions(klass);
  _wrapFunctions(klass.prototype);
  return klass;
}
