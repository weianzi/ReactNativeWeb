/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactDimensions
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var dimensions = {
  // Not map to real window size, because that map to screen size in native env.
  window: {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    scale: window.devicePixelRatio || 1
  },
  modalFullscreenView: {
    width: screen.width,
    height: screen.height
  }
};

var Dimensions = (function () {
  function Dimensions() {
    _classCallCheck(this, Dimensions);
  }

  _createClass(Dimensions, null, [{
    key: 'get',

    /**
     * Initial dimensions are set before `runApplication` is called so they should
     * be available before any other require's are run, but may be updated later.
     *
     * Note: Although dimensions are available immediately, they may change (e.g
     * due to device rotation) so any rendering logic or styles that depend on
     * these constants should try to call this function on every render, rather
     * than caching the value (for example, using inline styles rather than
     * setting a value in a `StyleSheet`).
     *
     * @param {string} dim Name of dimension as defined when calling `set`.
     * @returns {Object?} Value for the dimension.
     */
    value: function get(dim) {
      return dimensions[dim];
    }
  }]);

  return Dimensions;
})();

module.exports = Dimensions;