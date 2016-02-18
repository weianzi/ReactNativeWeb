/**
 * @generated SignedSource<<fb2bb5c1c402a097a7e1da7413526629>>
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
 * @providesModule EventEmitterWithHolding
 * @typechecks
 */
'use strict';

/**
 * @class EventEmitterWithHolding
 * @description
 * An EventEmitterWithHolding decorates an event emitter and enables one to
 * "hold" or cache events and then have a handler register later to actually
 * handle them.
 *
 * This is separated into its own decorator so that only those who want to use
 * the holding functionality have to and others can just use an emitter. Since
 * it implements the emitter interface it can also be combined with anything
 * that uses an emitter.
 */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EventEmitterWithHolding = (function () {
  /**
   * @constructor
   * @param {object} emitter - The object responsible for emitting the actual
   *   events.
   * @param {object} holder - The event holder that is responsible for holding
   *   and then emitting held events.
   */

  function EventEmitterWithHolding(emitter, holder) {
    _classCallCheck(this, EventEmitterWithHolding);

    this._emitter = emitter;
    this._eventHolder = holder;
    this._currentEventToken = null;
    this._emittingHeldEvents = false;
  }

  /**
   * @see EventEmitter#addListener
   */

  _createClass(EventEmitterWithHolding, [{
    key: 'addListener',
    value: function addListener(eventType, listener, context) {
      return this._emitter.addListener(eventType, listener, context);
    }

    /**
     * @see EventEmitter#once
     */
  }, {
    key: 'once',
    value: function once(eventType, listener, context) {
      return this._emitter.once(eventType, listener, context);
    }

    /**
     * Adds a listener to be invoked when events of the specified type are
     * emitted. An optional calling context may be provided. The data arguments
     * emitted will be passed to the listener function. In addition to subscribing
     * to all subsequent events, this method will also handle any events that have
     * already been emitted, held, and not released.
     *
     * @param {string} eventType - Name of the event to listen to
     * @param {function} listener - Function to invoke when the specified event is
     *   emitted
     * @param {*} context - Optional context object to use when invoking the
     *   listener
     *
     * @example
     *   emitter.emitAndHold('someEvent', 'abc');
     *
     *   emitter.addRetroactiveListener('someEvent', function(message) {
     *     console.log(message);
     *   }); // logs 'abc'
     */
  }, {
    key: 'addRetroactiveListener',
    value: function addRetroactiveListener(eventType, listener, context) {
      var subscription = this._emitter.addListener(eventType, listener, context);

      this._emittingHeldEvents = true;
      this._eventHolder.emitToListener(eventType, listener, context);
      this._emittingHeldEvents = false;

      return subscription;
    }

    /**
     * @see EventEmitter#removeAllListeners
     */
  }, {
    key: 'removeAllListeners',
    value: function removeAllListeners(eventType) {
      this._emitter.removeAllListeners(eventType);
    }

    /**
     * @see EventEmitter#removeCurrentListener
     */
  }, {
    key: 'removeCurrentListener',
    value: function removeCurrentListener() {
      this._emitter.removeCurrentListener();
    }

    /**
     * @see EventEmitter#listeners
     */
  }, {
    key: 'listeners',
    value: function listeners(eventType) /* TODO: Annotate return type here */{
      return this._emitter.listeners(eventType);
    }

    /**
     * @see EventEmitter#emit
     */
  }, {
    key: 'emit',
    value: function emit(eventType, a, b, c, d, e, _) {
      this._emitter.emit(eventType, a, b, c, d, e, _);
    }

    /**
     * Emits an event of the given type with the given data, and holds that event
     * in order to be able to dispatch it to a later subscriber when they say they
     * want to handle held events.
     *
     * @param {string} eventType - Name of the event to emit
     * @param {...*} Arbitrary arguments to be passed to each registered listener
     *
     * @example
     *   emitter.emitAndHold('someEvent', 'abc');
     *
     *   emitter.addRetroactiveListener('someEvent', function(message) {
     *     console.log(message);
     *   }); // logs 'abc'
     */
  }, {
    key: 'emitAndHold',
    value: function emitAndHold(eventType, a, b, c, d, e, _) {
      this._currentEventToken = this._eventHolder.holdEvent(eventType, a, b, c, d, e, _);
      this._emitter.emit(eventType, a, b, c, d, e, _);
      this._currentEventToken = null;
    }

    /**
     * @see EventHolder#releaseCurrentEvent
     */
  }, {
    key: 'releaseCurrentEvent',
    value: function releaseCurrentEvent() {
      if (this._currentEventToken !== null) {
        this._eventHolder.releaseEvent(this._currentEventToken);
      } else if (this._emittingHeldEvents) {
        this._eventHolder.releaseCurrentEvent();
      }
    }

    /**
     * @see EventHolder#releaseEventType
     * @param {string} eventType
     */
  }, {
    key: 'releaseHeldEventType',
    value: function releaseHeldEventType(eventType) {
      this._eventHolder.releaseEventType(eventType);
    }
  }]);

  return EventEmitterWithHolding;
})();

module.exports = EventEmitterWithHolding;