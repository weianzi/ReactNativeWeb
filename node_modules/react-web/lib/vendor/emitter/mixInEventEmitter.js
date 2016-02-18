/**
 * @generated SignedSource<<c735038726af2daf584b3e7fb3950e8b>>
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !! This file is a check-in of a static_upstream project!      !!
 * !!                                                            !!
 * !! You should not modify this file directly. Instead:         !!
 * !! 1) Use `fjs use-upstream` to temporarily replace this with !!
 * !!    the latest version from upstream.                       !!
 * !! 2) Make your changes, test them, etc.                      !!
 * !! 3) Use `fjs push-upstream` to copy your changes back to    !!
 * !!    static_upstream.                                        !!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * @providesModule ReactMixInEventEmitter
 */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _EventEmitter = require('EventEmitter');

var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

var _ReactEventEmitterWithHolding = require('ReactEventEmitterWithHolding');

var _ReactEventEmitterWithHolding2 = _interopRequireDefault(_ReactEventEmitterWithHolding);

var _ReactEventHolder = require('ReactEventHolder');

var _ReactEventHolder2 = _interopRequireDefault(_ReactEventHolder);

var _ReactEventValidator = require('ReactEventValidator');

var _ReactEventValidator2 = _interopRequireDefault(_ReactEventValidator);

var _copyProperties = require('copyProperties');

var _copyProperties2 = _interopRequireDefault(_copyProperties);

var _fbjsLibInvariant = require('fbjs/lib/invariant');

var _fbjsLibInvariant2 = _interopRequireDefault(_fbjsLibInvariant);

var _fbjsLibKeyOf = require('fbjs/lib/keyOf');

var _fbjsLibKeyOf2 = _interopRequireDefault(_fbjsLibKeyOf);

var TYPES_KEY = (0, _fbjsLibKeyOf2['default'])({ __types: true });

/**
 * API to setup an object or constructor to be able to emit data events.
 *
 * @example
 * function Dog() { ...dog stuff... }
 * mixInEventEmitter(Dog, {bark: true});
 *
 * var puppy = new Dog();
 * puppy.addListener('bark', function (volume) {
 *   console.log('Puppy', this, 'barked at volume:', volume);
 * });
 * puppy.emit('bark', 'quiet');
 * // Puppy <puppy> barked at volume: quiet
 *
 *
 * // A "singleton" object may also be commissioned:
 *
 * var Singleton = {};
 * mixInEventEmitter(Singleton, {lonely: true});
 * Singleton.emit('lonely', true);
 */
function mixInEventEmitter(klass, types) {
  (0, _fbjsLibInvariant2['default'])(types, 'Must supply set of valid event types');
  (0, _fbjsLibInvariant2['default'])(!this.__eventEmitter, 'An active emitter is already mixed in');

  // If this is a constructor, write to the prototype, otherwise write to the
  // singleton object.
  var target = klass.prototype || klass;

  var ctor = klass.constructor;
  if (ctor) {
    (0, _fbjsLibInvariant2['default'])(ctor === Object || ctor === Function, 'Mix EventEmitter into a class, not an instance');
  }

  // Keep track of the provided types, union the types if they already exist,
  // which allows for prototype subclasses to provide more types.
  if (target.hasOwnProperty(TYPES_KEY)) {
    (0, _copyProperties2['default'])(target.__types, types);
  } else if (target.__types) {
    target.__types = (0, _copyProperties2['default'])({}, target.__types, types);
  } else {
    target.__types = types;
  }
  (0, _copyProperties2['default'])(target, EventEmitterMixin);
}

var EventEmitterMixin = {
  emit: function emit(eventType, a, b, c, d, e, _) {
    return this.__getEventEmitter().emit(eventType, a, b, c, d, e, _);
  },

  emitAndHold: function emitAndHold(eventType, a, b, c, d, e, _) {
    return this.__getEventEmitter().emitAndHold(eventType, a, b, c, d, e, _);
  },

  addListener: function addListener(eventType, listener, context) {
    return this.__getEventEmitter().addListener(eventType, listener, context);
  },

  once: function once(eventType, listener, context) {
    return this.__getEventEmitter().once(eventType, listener, context);
  },

  addRetroactiveListener: function addRetroactiveListener(eventType, listener, context) {
    return this.__getEventEmitter().addRetroactiveListener(eventType, listener, context);
  },

  addListenerMap: function addListenerMap(listenerMap, context) {
    return this.__getEventEmitter().addListenerMap(listenerMap, context);
  },

  addRetroactiveListenerMap: function addRetroactiveListenerMap(listenerMap, context) {
    return this.__getEventEmitter().addListenerMap(listenerMap, context);
  },

  removeAllListeners: function removeAllListeners() {
    this.__getEventEmitter().removeAllListeners();
  },

  removeCurrentListener: function removeCurrentListener() {
    this.__getEventEmitter().removeCurrentListener();
  },

  releaseHeldEventType: function releaseHeldEventType(eventType) {
    this.__getEventEmitter().releaseHeldEventType(eventType);
  },

  __getEventEmitter: function __getEventEmitter() {
    if (!this.__eventEmitter) {
      var emitter = new _EventEmitter2['default']();
      emitter = _ReactEventValidator2['default'].addValidation(emitter, this.__types);

      var holder = new _ReactEventHolder2['default']();
      this.__eventEmitter = new _ReactEventEmitterWithHolding2['default'](emitter, holder);
    }
    return this.__eventEmitter;
  }
};

module.exports = mixInEventEmitter;