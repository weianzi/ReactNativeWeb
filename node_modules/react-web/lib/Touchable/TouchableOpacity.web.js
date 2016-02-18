/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactTouchableOpacity
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ReactAnimated = require('ReactAnimated');

var _ReactAnimated2 = _interopRequireDefault(_ReactAnimated);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactTimerMixin = require('react-timer-mixin');

var _reactTimerMixin2 = _interopRequireDefault(_reactTimerMixin);

var _ReactTouchable = require('ReactTouchable');

var _ReactTouchableWithoutFeedback = require('ReactTouchableWithoutFeedback');

// var ensurePositiveDelayProps = require('ensurePositiveDelayProps');

var _ReactTouchableWithoutFeedback2 = _interopRequireDefault(_ReactTouchableWithoutFeedback);

var flattenStyle = require('ReactFlattenStyle');

/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, dimming it.
 * This is done without actually changing the view hierarchy, and in general is
 * easy to add to an app without weird side-effects.
 *
 * Example:
 *
 * ```
 * renderButton: function() {
 *   return (
 *     <TouchableOpacity onPress={this._onPressButton}>
 *       <Image
 *         style={styles.button}
 *         source={require('image!myButton')}
 *       />
 *     </TouchableOpacity>
 *   );
 * },
 * ```
 */

var TouchableOpacity = _react2['default'].createClass({
  displayName: 'TouchableOpacity',

  mixins: [_reactTimerMixin2['default'], _ReactTouchable.Mixin],

  propTypes: _extends({}, _ReactTouchableWithoutFeedback2['default'].propTypes, {
    /**
     * Determines what the opacity of the wrapped view should be when touch is
     * active.
     */
    activeOpacity: _react2['default'].PropTypes.number
  }),

  getDefaultProps: function getDefaultProps() {
    return {
      activeOpacity: 0.2
    };
  },

  getInitialState: function getInitialState() {
    return _extends({}, this.touchableGetInitialState(), {
      anim: new _ReactAnimated2['default'].Value(1)
    });
  },

  componentDidMount: function componentDidMount() {
    // ensurePositiveDelayProps(this.props);
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    // ensurePositiveDelayProps(nextProps);
  },

  setOpacityTo: function setOpacityTo(value) {
    _ReactAnimated2['default'].timing(this.state.anim, { toValue: value, duration: 150 }).start();
  },

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandleActivePressIn: function touchableHandleActivePressIn(e) {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    this._opacityActive();
    this.props.onPressIn && this.props.onPressIn(e);
  },

  touchableHandleActivePressOut: function touchableHandleActivePressOut(e) {
    if (!this._hideTimeout) {
      this._opacityInactive();
    }
    this.props.onPressOut && this.props.onPressOut(e);
  },

  touchableHandlePress: function touchableHandlePress(e) {
    this.clearTimeout(this._hideTimeout);
    this._opacityActive();
    this._hideTimeout = this.setTimeout(this._opacityInactive, this.props.delayPressOut || 100);
    this.props.onPress && this.props.onPress(e);
  },

  touchableHandleLongPress: function touchableHandleLongPress(e) {
    this.props.onLongPress && this.props.onLongPress(e);
  },

  touchableGetPressRectOffset: function touchableGetPressRectOffset() {
    return PRESS_RECT_OFFSET; // Always make sure to predeclare a constant!
  },

  touchableGetHighlightDelayMS: function touchableGetHighlightDelayMS() {
    return this.props.delayPressIn || 0;
  },

  touchableGetLongPressDelayMS: function touchableGetLongPressDelayMS() {
    return this.props.delayLongPress === 0 ? 0 : this.props.delayLongPress || 500;
  },

  touchableGetPressOutDelayMS: function touchableGetPressOutDelayMS() {
    return this.props.delayPressOut;
  },

  _opacityActive: function _opacityActive() {
    this.setOpacityTo(this.props.activeOpacity);
  },

  _opacityInactive: function _opacityInactive() {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    var childStyle = flattenStyle(this.props.style) || {};
    this.setOpacityTo(childStyle.opacity === undefined ? 1 : childStyle.opacity);
  },

  render: function render() {
    return _react2['default'].createElement(
      _ReactAnimated2['default'].View,
      {
        accessible: true,
        accessibilityComponentType: this.props.accessibilityComponentType,
        accessibilityTraits: this.props.accessibilityTraits,
        style: [this.props.style, { opacity: this.state.anim }],
        testID: this.props.testID,
        onLayout: this.props.onLayout,
        onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
        onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
        onResponderGrant: this.touchableHandleResponderGrant,
        onResponderMove: this.touchableHandleResponderMove,
        onResponderRelease: this.touchableHandleResponderRelease,
        onResponderTerminate: this.touchableHandleResponderTerminate },
      this.props.children
    );
  }
});

/**
 * When the scroll view is disabled, this defines how far your touch may move
 * off of the button, before deactivating the button. Once deactivated, try
 * moving it back and you'll see that the button is once again reactivated!
 * Move it back and forth several times while the scroll view is disabled.
 */
var PRESS_RECT_OFFSET = { top: 20, left: 20, right: 20, bottom: 30 };

module.exports = TouchableOpacity;