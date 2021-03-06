/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-restricted-syntax */
const urlParse = require('url');
const { JSEncrypt } = require('jsencrypt');
const { getLocale } = require('@/locale');
const { SALT, PUBLIC_KEY } = require('./config');

const encryptor = new JSEncrypt();
encryptor.setPublicKey(PUBLIC_KEY);

module.exports.parseURL = function parseURL(url) {
  if (!url) {
    return null;
  }
  return urlParse.parse(url);
};

module.exports.generateSign = function generateSign() {
  // 加入验签环节
  const timestamp = new Date().getTime();
  const securityKey = `${timestamp}${SALT}`;
  const rsaPassWord = encryptor.encrypt(securityKey);
  return {
    'x-ts': timestamp,
    'x-sign': rsaPassWord,
    'x-language': getLocale(),
  };
};

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
module.exports.extend = function extend(a, b, thisArg) {
  // eslint-disable-next-line no-use-before-define
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      // eslint-disable-next-line no-use-before-define
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
};

function bind(fn, thisArg) {
  return function wrap() {
    const args = new Array(arguments.length);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < args.length; i++) {
      // eslint-disable-next-line prefer-rest-params
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /* eslint no-param-reassign:0 */
    obj = [obj];
  }

  if (obj instanceof Array) {
    // Iterate over array values
    // eslint-disable-next-line no-plusplus
    for (let i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
