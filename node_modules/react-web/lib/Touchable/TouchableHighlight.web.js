/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactTouchableHighlight
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var _reactTimerMixin = require('react-timer-mixin');

var _reactTimerMixin2 = _interopRequireDefault(_reactTimerMixin);

var _ReactTouchableWithoutFeedback = require('ReactTouchableWithoutFeedback');

var _ReactTouchableWithoutFeedback2 = _interopRequireDefault(_ReactTouchableWithoutFeedback);

var _ReactTouchable = require('ReactTouchable');

var _ReactStyleSheet = require('ReactStyleSheet');

var _ReactStyleSheet2 = _interopRequireDefault(_ReactStyleSheet);

var DEFAULT_PROPS = {
  activeOpacity: 0.8,
  underlayColor: 'black'
};

var PRESS_RECT_OFFSET = { top: 20, left: 20, right: 20, bottom: 30 };
var CHILD_REF = 'childRef';
var UNDERLAY_REF = 'underlayRef';
// var INACTIVE_CHILD_PROPS = {
//   style: StyleSheet.create({x: {opacity: 1.0}}).x,
// };
var INACTIVE_UNDERLAY_PROPS = {
  style: _ReactStyleSheet2['default'].create({ x: { backgroundColor: 'transparent' } }).x
};

var TouchableHighlight = _react2['default'].createClass({
  displayName: 'TouchableHighlight',

  propTypes: _extends({}, _ReactTouchableWithoutFeedback2['default'].propTypes, {
    /**
     * Determines what the opacity of the wrapped view should be when touch is
     * active.
     */
    activeOpacity: _react2['default'].PropTypes.number,
    /**
     * The color of the underlay that will show through when the touch is
     * active.
     */
    underlayColor: _react2['default'].PropTypes.string,
    /**
     * Called immediately after the underlay is shown
     */
    onShowUnderlay: _react2['default'].PropTypes.func,
    /**
     * Called immediately after the underlay is hidden
     */
    onHideUnderlay: _react2['default'].PropTypes.func
  }),

  mixins: [_reactTimerMixin2['default'], _ReactTouchable.Mixin],

  getDefaultProps: function getDefaultProps() {
    return DEFAULT_PROPS;
  },

  // Performance optimization to avoid constantly re-generating these objects.
  computeSyntheticState: function computeSyntheticState(props) {
    return {
      activeProps: {
        style: {
          opacity: props.activeOpacity
        }
      },
      activeUnderlayProps: {
        style: {
          backgroundColor: props.underlayColor
        }
      },
      underlayStyle: [INACTIVE_UNDERLAY_PROPS.style, props.style]
    };
  },

  getInitialState: function getInitialState() {
    return _extends({}, this.touchableGetInitialState(), this.computeSyntheticState(this.props));
  },

  componentDidMount: function componentDidMount() {
    // ensurePositiveDelayProps(this.props);
    // ensureComponentIsNative(this.refs[CHILD_REF]);
  },

  componentDidUpdate: function componentDidUpdate() {
    // ensureComponentIsNative(this.refs[CHILD_REF]);
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    // ensurePositiveDelayProps(nextProps);
    if (nextProps.activeOpacity !== this.props.activeOpacity || nextProps.underlayColor !== this.props.underlayColor || nextProps.style !== this.props.style) {
      this.setState(this.computeSyntheticState(nextProps));
    }
  },

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandleActivePressIn: function touchableHandleActivePressIn(e) {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    this._showUnderlay();
    this.props.onPressIn && this.props.onPressIn(e);
  },

  touchableHandleActivePressOut: function touchableHandleActivePressOut(e) {
    if (!this._hideTimeout) {
      this._hideUnderlay();
    }
    this.props.onPressOut && this.props.onPressOut(e);
  },

  touchableHandlePress: function touchableHandlePress(e) {
    this.clearTimeout(this._hideTimeout);
    this._showUnderlay();
    this._hideTimeout = this.setTimeout(this._hideUnderlay, this.props.delayPressOut || 100);
    this.props.onPress && this.props.onPress(e);
  },

  touchableHandleLongPress: function touchableHandleLongPress(e) {
    this.props.onLongPress && this.props.onLongPress(e);
  },

  touchableGetPressRectOffset: function touchableGetPressRectOffset() {
    return PRESS_RECT_OFFSET; // Always make sure to predeclare a constant!
  },

  touchableGetHighlightDelayMS: function touchableGetHighlightDelayMS() {
    return this.props.delayPressIn;
  },

  touchableGetLongPressDelayMS: function touchableGetLongPressDelayMS() {
    return this.props.delayLongPress;
  },

  touchableGetPressOutDelayMS: function touchableGetPressOutDelayMS() {
    return this.props.delayPressOut;
  },

  _showUnderlay: function _showUnderlay() {
    if (!this.isMounted()) {
      return;
    }

    // this.refs[UNDERLAY_REF].setNativeProps(this.state.activeUnderlayProps);
    // this.refs[CHILD_REF].setNativeProps(this.state.activeProps);
    this.props.onShowUnderlay && this.props.onShowUnderlay();
  },

  _hideUnderlay: function _hideUnderlay() {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    if (this.refs[UNDERLAY_REF]) {
      // this.refs[CHILD_REF].setNativeProps(INACTIVE_CHILD_PROPS);
      // this.refs[UNDERLAY_REF].setNativeProps({
      //  ...INACTIVE_UNDERLAY_PROPS,
      //  style: this.state.underlayStyle,
      // });
      this.props.onHideUnderlay && this.props.onHideUnderlay();
    }
  },

  render: function render() {

    return _react2['default'].createElement(
      _ReactView2['default'],
      {
        accessible: true,
        accessibilityComponentType: this.props.accessibilityComponentType,
        accessibilityTraits: this.props.accessibilityTraits,
        ref: UNDERLAY_REF,
        style: this.state.underlayStyle,
        onLayout: this.props.onLayout,
        onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
        onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
        onResponderGrant: this.touchableHandleResponderGrant,
        onResponderMove: this.touchableHandleResponderMove,
        onResponderRelease: this.touchableHandleResponderRelease,
        onResponderTerminate: this.touchableHandleResponderTerminate,
        testID: this.props.testID },
      _react2['default'].cloneElement(_react2['default'].Children.only(this.props.children), {
        ref: CHILD_REF
      })
    );
  }
});

module.exports = TouchableHighlight;