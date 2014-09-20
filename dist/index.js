"use strict";
var SLUG_REGEX = /\{\{([\w\d\.\?\!_-]*)\}\}/g;
function each(obj, fn) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn(obj[key], key);
    }
  }
}
function copy(from, to) {
  each(from, (function(val, key) {
    return to[key] = val;
  }));
}
function interpolate(str, data) {
  return str.replace(SLUG_REGEX, (function(slug, key) {
    var split = key.split('.');
    var val = data;
    var key;
    while (split.length) {
      key = split.shift();
      val = val[key];
    }
    return val || '';
  }));
}
module.exports = function dFactory(initialData) {
  var privateData = {};
  function addData(key, val) {
    privateData[key] = val;
    if (D.hasOwnProperty(key))
      return;
    Object.defineProperty(D, key, {
      get: (function() {
        return privateData[key];
      }),
      enumerable: true,
      configurable: false
    });
  }
  function deleteData(key) {
    privateData[key] = void 0;
  }
  each(initialData, (function(val, key) {
    return addData(key, val);
  }));
  function D(input) {
    if (Array.isArray(input)) {
      return input.map((function(str) {
        return interpolate(str, privateData);
      }));
    }
    return interpolate(input, privateData);
  }
  var staticMethods = {
    $delete: (function(name) {
      deleteData(name);
      return D;
    }),
    $extend: (function(obj) {
      each(obj, (function(val, key) {
        return addData(key, val);
      }));
      return D;
    })
  };
  copy(staticMethods, D);
  return D;
};
