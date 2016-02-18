/**
 * @generated SignedSource<<24d5cc1cdd24704296686faf89dd36cf>>
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
 * @providesModule ReactEventSubscriptionVendor
 * @typechecks
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fbjsLibInvariant = require('fbjs/lib/invariant');

/**
 * EventSubscriptionVendor stores a set of EventSubscriptions that are
 * subscribed to a particular event type.
 */

var _fbjsLibInvariant2 = _interopRequireDefault(_fbjsLibInvariant);

var EventSubscriptionVendor = (function () {
  function EventSubscriptionVendor() {
    _classCallCheck(this, EventSubscriptionVendor);

    this._subscriptionsForType = {};
    this._currentSubscription = null;
  }

  /**
   * Adds a subscription keyed by an event type.
   *
   * @param {string} eventType
   * @param {EventSubscription} subscription
   */

  _createClass(EventSubscriptionVendor, [{
    key: 'addSubscription',
    value: function addSubscription(eventType, subscription) {
      (0, _fbjsLibInvariant2['default'])(subscription.subscriber === this, 'The subscriber of the subscription is incorrectly set.');
      if (!this._subscriptionsForType[eventType]) {
        this._subscriptionsForType[eventType] = [];
      }
      var key = this._subscriptionsForType[eventType].length;
      this._subscriptionsForType[eventType].push(subscription);
      subscription.eventType = eventType;
      subscription.key = key;
      return subscription;
    }

    /**
     * Removes a bulk set of the subscriptions.
     *
     * @param {?string} eventType - Optional name of the event type whose
     *   registered supscriptions to remove, if null remove all subscriptions.
     */
  }, {
    key: 'removeAllSubscriptions',
    value: function removeAllSubscriptions(eventType) {
      if (eventType === undefined) {
        this._subscriptionsForType = {};
      } else {
        delete this._subscriptionsForType[eventType];
      }
    }

    /**
     * Removes a specific subscription. Instead of calling this function, call
     * `subscription.remove()` directly.
     *
     * @param {object} subscription
     */
  }, {
    key: 'removeSubscription',
    value: function removeSubscription(subscription) {
      var eventType = subscription.eventType;
      var key = subscription.key;

      var subscriptionsForType = this._subscriptionsForType[eventType];
      if (subscriptionsForType) {
        delete subscriptionsForType[key];
      }
    }

    /**
     * Returns the array of subscriptions that are currently registered for the
     * given event type.
     *
     * Note: This array can be potentially sparse as subscriptions are deleted
     * from it when they are removed.
     *
     * TODO: This returns a nullable array. wat?
     *
     * @param {string} eventType
     * @returns {?array}
     */
  }, {
    key: 'getSubscriptionsForType',
    value: function getSubscriptionsForType(eventType) {
      return this._subscriptionsForType[eventType];
    }
  }]);

  return EventSubscriptionVendor;
})();

module.exports = EventSubscriptionVendor;