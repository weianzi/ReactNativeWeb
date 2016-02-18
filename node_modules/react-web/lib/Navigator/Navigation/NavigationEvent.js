/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactNavigationEvent
 * 
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fbjsLibInvariant = require('fbjs/lib/invariant');

var _fbjsLibInvariant2 = _interopRequireDefault(_fbjsLibInvariant);

var NavigationEventPool = (function () {
  function NavigationEventPool() {
    _classCallCheck(this, NavigationEventPool);

    this._list = [];
  }

  _createClass(NavigationEventPool, [{
    key: 'get',
    value: function get(type, currentTarget, data) {
      var event;
      if (this._list.length > 0) {
        event = this._list.pop();
        event.constructor.call(event, type, currentTarget, data);
      } else {
        event = new NavigationEvent(type, currentTarget, data);
      }
      return event;
    }
  }, {
    key: 'put',
    value: function put(event) {
      this._list.push(event);
    }
  }]);

  return NavigationEventPool;
})();

var _navigationEventPool = new NavigationEventPool();

/**
 * The NavigationEvent interface represents any event of the navigation.
 * It contains common properties and methods to any event.
 *
 * == Important Properties ==
 *
 * - target:
 *   A reference to the navigation context that dispatched the event. It is
 *   different from event.currentTarget when the event handler is called during
 *   the bubbling or capturing phase of the event.
 *
 * - currentTarget:
 *   Identifies the current target for the event, as the event traverses the
 *   navigation context tree. It always refers to the navigation context the
 *   event handler has been attached to as opposed to event.target which
 *   identifies the navigation context on which the event occurred.
 *
 * - eventPhase:
 *   Returns an integer value which specifies the current evaluation phase of
 *   the event flow; possible values are listed in NavigationEvent phase
 *   constants below.
 */

var NavigationEvent = (function () {
  _createClass(NavigationEvent, null, [{
    key: 'pool',
    value: function pool(type, currentTarget, data) {
      return _navigationEventPool.get(type, currentTarget, data);
    }
  }]);

  function NavigationEvent(type, currentTarget, data) {
    _classCallCheck(this, NavigationEvent);

    this.target = currentTarget;
    this.eventPhase = NavigationEvent.NONE;

    this._type = type;
    this._currentTarget = currentTarget;
    this._data = data;
    this._defaultPrevented = false;
    this._disposed = false;
    this._propagationStopped = false;
  }

  /**
   * Event phase constants.
   * These values describe which phase the event flow is currently being
   * evaluated.
   */

  // No event is being processed at this time.

  /* $FlowFixMe - get/set properties not yet supported */

  _createClass(NavigationEvent, [{
    key: 'preventDefault',
    value: function preventDefault() {
      this._defaultPrevented = true;
    }
  }, {
    key: 'stopPropagation',
    value: function stopPropagation() {
      this._propagationStopped = true;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.preventDefault();
      this.stopPropagation();
    }
  }, {
    key: 'isPropagationStopped',
    value: function isPropagationStopped() {
      return this._propagationStopped;
    }

    /**
     * Dispose the event.
     * NavigationEvent shall be disposed after being emitted by
     * `NavigationEventEmitter`.
     */
  }, {
    key: 'dispose',
    value: function dispose() {
      (0, _fbjsLibInvariant2['default'])(!this._disposed, 'NavigationEvent is already disposed');
      this._disposed = true;

      // Clean up.
      this.target = null;
      this.eventPhase = NavigationEvent.NONE;
      this._type = null;
      this._currentTarget = null;
      this._data = null;
      this._defaultPrevented = false;

      // Put this back to the pool to reuse the instance.
      _navigationEventPool.put(this);
    }
  }, {
    key: 'type',
    get: function get() {
      return this._type;
    }

    /* $FlowFixMe - get/set properties not yet supported */
  }, {
    key: 'currentTarget',
    get: function get() {
      return this._currentTarget;
    }

    /* $FlowFixMe - get/set properties not yet supported */
  }, {
    key: 'data',
    get: function get() {
      return this._data;
    }

    /* $FlowFixMe - get/set properties not yet supported */
  }, {
    key: 'defaultPrevented',
    get: function get() {
      return this._defaultPrevented;
    }
  }]);

  return NavigationEvent;
})();

NavigationEvent.NONE = 0;

// The event is being propagated through the currentTarget's ancestor objects.
NavigationEvent.CAPTURING_PHASE = 1;

// The event has arrived at the event's currentTarget. Event listeners registered for
// this phase are called at this time.
NavigationEvent.AT_TARGET = 2;

// The event is propagating back up through the currentTarget's ancestors in reverse
// order, starting with the parent. This is known as bubbling, and occurs only
// if event propagation isn't prevented. Event listeners registered for this
// phase are triggered during this process.
NavigationEvent.BUBBLING_PHASE = 3;

module.exports = NavigationEvent;

// Returns an integer value which specifies the current evaluation phase of
// the event flow.