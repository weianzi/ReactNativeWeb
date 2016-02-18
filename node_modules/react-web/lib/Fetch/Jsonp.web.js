/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactJsonp
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ReactPromise = require('ReactPromise');

// From https://github.com/camsong/fetch-jsonp

var _ReactPromise2 = _interopRequireDefault(_ReactPromise);

var defaultOptions = {
  timeout: 5000,
  jsonpCallback: 'callback'
};

function generateCallbackFunction() {
  return 'jsonp_' + Date.now() + '_' + Math.ceil(Math.random() * 100000);
}

// Known issue: Will throw 'Uncaught ReferenceError: callback_*** is not defined' error if request timeout
function clearFunction(functionName) {
  // IE8 throws an exception when you try to delete a property on window
  // http://stackoverflow.com/a/1824228/751089
  try {
    delete window[functionName];
  } catch (e) {
    window[functionName] = undefined;
  }
}

function removeScript(scriptId) {
  var script = document.getElementById(scriptId);
  document.getElementsByTagName("head")[0].removeChild(script);
}

var fetchJsonp = function fetchJsonp(url) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var timeout = options.timeout != null ? options.timeout : defaultOptions.timeout;
  var jsonpCallback = options.jsonpCallback != null ? options.jsonpCallback : defaultOptions.jsonpCallback;

  var timeoutId = undefined;

  return new _ReactPromise2['default'](function (resolve, reject) {
    var callbackFunction = generateCallbackFunction();

    window[callbackFunction] = function (response) {
      resolve({
        ok: true,
        // keep consistent with fetch API
        json: function json() {
          return _ReactPromise2['default'].resolve(response);
        }
      });

      if (timeoutId) clearTimeout(timeoutId);

      removeScript(jsonpCallback + '_' + callbackFunction);

      clearFunction(callbackFunction);
    };

    // Check if the user set their own params, and if not add a ? to start a list of params
    url += url.indexOf('?') === -1 ? '?' : '&';

    var jsonpScript = document.createElement('script');
    jsonpScript.setAttribute("src", url + jsonpCallback + '=' + callbackFunction);
    jsonpScript.id = jsonpCallback + '_' + callbackFunction;
    document.getElementsByTagName("head")[0].appendChild(jsonpScript);

    timeoutId = setTimeout(function () {
      reject(new Error('JSONP request to ' + url + ' timed out'));

      clearFunction(callbackFunction);
      removeScript(jsonpCallback + '_' + callbackFunction);
    }, timeout);
  });
};

exports['default'] = fetchJsonp;
module.exports = exports['default'];