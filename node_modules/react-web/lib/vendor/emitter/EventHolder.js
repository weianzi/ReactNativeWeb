/**
 * @generated SignedSource<<0591836c443c735d24e61782320d3d16>>
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
 * @providesModule ReactEventHolder
 * @typechecks
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fbjsLibInvariant = require('fbjs/lib/invariant');

var _fbjsLibInvariant2 = _interopRequireDefault(_fbjsLibInvariant);

var EventHolder = (function () {
  function EventHolder() {
    _classCallCheck(this, EventHolder);

    this._heldEvents = {};
    this._currentEventKey = null;
  }

  /**
   * Holds a given event for processing later.
   *
   * TODO: Annotate return type better. The structural type of the return here
   *       is pretty obvious.
   *
   * @param {string} eventType - Name of the event to hold and later emit
   * @param {...*} Arbitrary arguments to be passed to each registered listener
   * @return {object} Token that can be used to release the held event
   *
   * @example
   *
   *   holder.holdEvent({someEvent: 'abc'});
   *
   *   holder.emitToHandler({
   *     someEvent: function(data, event) {
   *       console.log(data);
   *     }
   *   }); //logs 'abc'
   *
   */

  _createClass(EventHolder, [{
    key: 'holdEvent',
    value: function holdEvent(eventType, a, b, c, d, e, _) {
      this._heldEvents[eventType] = this._heldEvents[eventType] || [];
      var eventsOfType = this._heldEvents[eventType];
      var key = {
        eventType: eventType,
        index: eventsOfType.length
      };
      eventsOfType.push([a, b, c, d, e, _]);
      return key;
    }

    /**
     * Emits the held events of the specified type to the given listener.
     *
     * @param {?string} eventType - Optional name of the events to replay
     * @param {function} listener - The listener to which to dispatch the event
     * @param {?object} context - Optional context object to use when invoking
     *   the listener
     */
  }, {
    key: 'emitToListener',
    value: function emitToListener(eventType, listener, context) {
      var _this = this;

      var eventsOfType = this._heldEvents[eventType];
      if (!eventsOfType) {
        return;
      }
      var origEventKey = this._currentEventKey;
      eventsOfType.forEach(function ( /* ?array */eventHeld, /* number */index) {
        if (!eventHeld) {
          return;
        }
        _this._currentEventKey = {
          eventType: eventType,
          index: index
        };
        listener.apply(context, eventHeld);
      });
      this._currentEventKey = origEventKey;
    }

    /**
     * Provides an API that can be called during an eventing cycle to release
     * the last event that was invoked, so that it is no longer "held".
     *
     * If it is called when not inside of an emitting cycle it will throw.
     *
     * @throws {Error} When called not during an eventing cycle
     */
  }, {
    key: 'releaseCurrentEvent',
    value: function releaseCurrentEvent() {
      (0, _fbjsLibInvariant2['default'])(this._currentEventKey !== null, 'Not in an emitting cycle; there is no current event');
      this.releaseEvent(this._currentEventKey);
    }

    /**
     * Releases the event corresponding to the handle that was returned when the
     * event was first held.
     *
     * @param {object} token - The token returned from holdEvent
     */
  }, {
    key: 'releaseEvent',
    value: function releaseEvent(token) {
      delete this._heldEvents[token.eventType][token.index];
    }

    /**
     * Releases all events of a certain type.
     *
     * @param {string} type
     */
  }, {
    key: 'releaseEventType',
    value: function releaseEventType(type) {
      this._heldEvents[type] = [];
    }
  }]);

  return EventHolder;
})();

module.exports = EventHolder;