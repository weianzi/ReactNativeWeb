/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactNavigationEventEmitter
 * 
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _EventEmitter2 = require('EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var _ReactNavigationEvent = require('ReactNavigationEvent');

var _ReactNavigationEvent2 = _interopRequireDefault(_ReactNavigationEvent);

var NavigationEventEmitter = (function (_EventEmitter) {
  _inherits(NavigationEventEmitter, _EventEmitter);

  function NavigationEventEmitter(target) {
    _classCallCheck(this, NavigationEventEmitter);

    _get(Object.getPrototypeOf(NavigationEventEmitter.prototype), 'constructor', this).call(this);
    this._emitting = false;
    this._emitQueue = [];
    this._target = target;
  }

  _createClass(NavigationEventEmitter, [{
    key: 'emit',
    value: function emit(eventType, data, didEmitCallback, extraInfo) {
      if (this._emitting) {
        // An event cycle that was previously created hasn't finished yet.

        var args = Array.prototype.slice.call(arguments);
        this._emitQueue.unshift(args);
        return;
      }

      this._emitting = true;

      var event = _ReactNavigationEvent2['default'].pool(eventType, this._target, data);

      if (extraInfo) {
        if (extraInfo.target) {
          event.target = extraInfo.target;
        }

        if (extraInfo.eventPhase) {
          event.eventPhase = extraInfo.eventPhase;
        }

        if (extraInfo.defaultPrevented) {
          event.preventDefault();
        }

        if (extraInfo.propagationStopped) {
          event.stopPropagation();
        }
      }

      // EventEmitter#emit only takes `eventType` as `String`. Casting `eventType`
      // to `String` to make  happy.
      _get(Object.getPrototypeOf(NavigationEventEmitter.prototype), 'emit', this).call(this, String(eventType), event);

      if (typeof didEmitCallback === 'function') {
        didEmitCallback.call(this._target, event);
      }
      event.dispose();

      this._emitting = false;

      while (this._emitQueue.length) {
        var args = this._emitQueue.shift();
        this.emit.apply(this, args);
      }
    }
  }]);

  return NavigationEventEmitter;
})(_EventEmitter3['default']);

module.exports = NavigationEventEmitter;
// Put this event cycle into the queue and will finish them later.