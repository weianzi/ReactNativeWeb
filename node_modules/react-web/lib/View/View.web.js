/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactView
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactStyleSheet = require('ReactStyleSheet');

var _ReactStyleSheet2 = _interopRequireDefault(_ReactStyleSheet);

var _ReactLayoutMixin = require('ReactLayoutMixin');

var View = _react2['default'].createClass({
  displayName: 'View',

  mixins: [_ReactLayoutMixin.Mixin],

  propTypes: {
    /**
     * Used to locate this view in end-to-end tests. NB: disables the 'layout-only
     * view removal' optimization for this view!
     */
    testID: _react.PropTypes.string,

    /**
     * For most touch interactions, you'll simply want to wrap your component in
     * `TouchableHighlight` or `TouchableOpacity`. Check out `Touchable.js`,
     * `ScrollResponder.js` and `ResponderEventPlugin.js` for more discussion.
     */
    onMoveShouldSetResponder: _react.PropTypes.func,
    onResponderGrant: _react.PropTypes.func,
    onResponderMove: _react.PropTypes.func,
    onResponderReject: _react.PropTypes.func,
    onResponderRelease: _react.PropTypes.func,
    onResponderTerminate: _react.PropTypes.func,
    onResponderTerminationRequest: _react.PropTypes.func,
    onStartShouldSetResponder: _react.PropTypes.func,
    onStartShouldSetResponderCapture: _react.PropTypes.func,

    /**
     * Invoked on mount and layout changes with
     *
     *   {nativeEvent: { layout: {x, y, width, height}}}.
     *
     * This event is fired immediately once the layout has been calculated, but
     * the new layout may not yet be reflected on the screen at the time the
     * event is received, especially if a layout animation is in progress.
     */
    onLayout: _react.PropTypes.func,

    /**
     * In the absence of `auto` property, `none` is much like `CSS`'s `none`
     * value. `box-none` is as if you had applied the `CSS` class:
     *
     * ```
     * .box-none {
     *   pointer-events: none;
     * }
     * .box-none * {
     *   pointer-events: all;
     * }
     * ```
     *
     * `box-only` is the equivalent of
     *
     * ```
     * .box-only {
     *   pointer-events: all;
     * }
     * .box-only * {
     *   pointer-events: none;
     * }
     * ```
     *
     * But since `pointerEvents` does not affect layout/appearance, and we are
     * already deviating from the spec by adding additional modes, we opt to not
     * include `pointerEvents` on `style`. On some platforms, we would need to
     * implement it as a `className` anyways. Using `style` or not is an
     * implementation detail of the platform.
     */
    pointerEvents: _react.PropTypes.oneOf(['box-none', 'none', 'box-only', 'auto']),

    style: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.array])
  },

  render: function render() {
    return _react2['default'].createElement(
      'div',
      _extends({ className: _ReactStyleSheet2['default'].viewClassName }, this.props),
      this.props.children
    );
  }
});

module.exports = View;