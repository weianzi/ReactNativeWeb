/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactAlert
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var DEFAULT_BUTTON_TEXT = 'OK';
var DEFAULT_BUTTON = {
  text: DEFAULT_BUTTON_TEXT,
  onPress: null
};

/**
 * Launches an alert dialog with the specified title and message.
 *
 * Optionally provide a list of buttons. Tapping any button will fire the
 * respective onPress callback and dismiss the alert. By default, the only
 * button will be an 'OK' button
 *
 * The last button in the list will be considered the 'Primary' button and
 * it will appear bold.
 *
 * ```
 * AlertIOS.alert(
 *   'Foo Title',
 *   'My Alert Msg',
 *   [
 *     {text: 'Foo', onPress: () => console.log('Foo Pressed!')},
 *     {text: 'Bar', onPress: () => console.log('Bar Pressed!')},
 *   ]
 * )
 * ```
 */

var AlertIOS = (function () {
  function AlertIOS() {
    _classCallCheck(this, AlertIOS);
  }

  _createClass(AlertIOS, null, [{
    key: 'alert',
    value: (function (_alert) {
      function alert(_x, _x2, _x3, _x4) {
        return _alert.apply(this, arguments);
      }

      alert.toString = function () {
        return _alert.toString();
      };

      return alert;
    })(function (title, message, buttons, type) {
      var callbacks = [];
      var buttonsSpec = [];
      title = title || '';
      message = message || '';
      buttons = buttons || [DEFAULT_BUTTON];
      type = type || '';

      buttons.forEach(function (btn, index) {
        callbacks[index] = btn.onPress;
        var btnDef = {};
        btnDef[index] = btn.text || DEFAULT_BUTTON_TEXT;
        buttonsSpec.push(btnDef);
      });

      alert(title);
    })
  }, {
    key: 'prompt',
    value: (function (_prompt) {
      function prompt(_x5, _x6, _x7, _x8) {
        return _prompt.apply(this, arguments);
      }

      prompt.toString = function () {
        return _prompt.toString();
      };

      return prompt;
    })(function (title, value, buttons, callback) {
      if (arguments.length === 2) {
        if (typeof value === 'object') {
          buttons = value;
          value = undefined;
        } else if (typeof value === 'function') {
          callback = value;
          value = undefined;
        }
      } else if (arguments.length === 3 && typeof buttons === 'function') {
        callback = buttons;
        buttons = undefined;
      }

      if (!buttons) {
        buttons = [{
          text: 'Cancel'
        }, {
          text: 'OK',
          onPress: callback
        }];
      }

      var ret = prompt(title);
      if (ret && callback) {
        callback();
      }
    })
  }]);

  return AlertIOS;
})();

module.exports = AlertIOS;