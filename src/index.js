var SLUG_REGEX = /\{\{([\w\d\.\?\!_-]*)\}\}/g;

/**
 * for of iterator
 * @param  {Object}   obj - Object to iterate on
 * @param  {Function} fn  - Callback
 * @return {void}
 */
function each(obj, fn) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn(obj[key], key);
    }
  }
}

/**
 * Copies one object into another
 * @param  {Object} from - Object to copy
 * @param  {Object} to   - Object to copy into
 * @return {void}
 */
function copy(from, to) {
  each(from, (val, key) => to[key] = val);
}

/**
 * Interpolates a string w/ values from `data`
 * @param  {string} str  - String to run interpolate on
 * @param  {Object} data - Data object to use when referencing interpolate tokens
 * @return {string}      - Interpolated string
 */
function interpolate(str, data) {
  return str.replace(SLUG_REGEX, (slug, key) => {
    var split = key.split('.');
    var val = data;
    var key;

    while (split.length) {
      key = split.shift();
      val = val[key];
    }

    return val || '';
  });
}

/**
 * Module which takes in optional initialData and returns 'd' function
 * @param  {Object} initialData - Hashmap of initialData
 * @return {Function}
 */
module.exports = function dFactory(initialData) {
  var privateData = {};

  /**
   * Add a data to `D`
   * @param {string} key - Name of data key
   * @param {string} val - Data value
   * @return {void}
   */
  function addData(key, val) {
    privateData[key] = val;

    if (D.hasOwnProperty(key)) return;

    Object.defineProperty(D, key, {
      get: () => privateData[key],
      enumerable: true,
      configurable: false
    });
  }

  /**
   * Sets a data key to `undefined`
   * @param  {string} key - Key to delete
   * @return {void}
   */
  function deleteData(key) {
    privateData[key] = void 0;
  }

  // Add any initial data to `D`
  each(initialData, (val, key) => addData(key, val));

  /**
   * Takes in a string or array of strings and runs 'd' on them
   * @param {(Array.<string>|string)} input - Input string or array
   * @return {(Array.<string>|string)}      - Interpolated string or array of strings
   */
  function D(input) {
    if (Array.isArray(input)) {
      return input.map((str) => interpolate(str, privateData));
    }

    return interpolate(input, privateData);
  }

  var staticMethods = {
    /**
     * Delete a data item
     * @param  {string} name - Key to delete from hashmap
     * @return {Function}    - D
     */
    $delete: (name) => {
      deleteData(name);
      return D;
    },

    /**
     * Takes an extension object and adds the data
     * @param  {Object.<string,string>} obj - Key / value data pairs
     * @return {Function}                   - D
     */
    $extend: (obj) => {
      each(obj, (val, key) => addData(key, val));
      return D;
    }
  };

  copy(staticMethods, D);

  return D;
};
