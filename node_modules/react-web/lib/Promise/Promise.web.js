/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactPromise
 */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _promiseLibEs6Extensions = require('promise/lib/es6-extensions');

var _promiseLibEs6Extensions2 = _interopRequireDefault(_promiseLibEs6Extensions);

require('promise/lib/done');

/**
 * Handle either fulfillment or rejection with the same callback.
 */
_promiseLibEs6Extensions2['default'].prototype['finally'] = function (onSettled) {
  return this.then(onSettled, onSettled);
};

module.exports = _promiseLibEs6Extensions2['default'];