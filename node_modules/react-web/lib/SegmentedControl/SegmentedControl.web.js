/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactSegmentedControl
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var _ReactText = require('ReactText');

var _ReactText2 = _interopRequireDefault(_ReactText);

var _ReactStyleSheet = require('ReactStyleSheet');

var _ReactStyleSheet2 = _interopRequireDefault(_ReactStyleSheet);

var SegmentedControl = _react2['default'].createClass({
  displayName: 'SegmentedControl',

  propTypes: {
    /**
     * The labels for the control's segment buttons, in order.
     */
    values: _react.PropTypes.arrayOf(_react.PropTypes.string),

    /**
     * The index in `props.values` of the segment to be pre-selected
     */
    selectedIndex: _react.PropTypes.number,

    /**
     * Callback that is called when the user taps a segment;
     * passes the segment's value as an argument
     */
    onValueChange: _react.PropTypes.func,

    /**
     * Callback that is called when the user taps a segment;
     * passes the event as an argument
     */
    onChange: _react.PropTypes.func,

    /**
     * If false the user won't be able to interact with the control.
     * Default value is true.
     */
    enabled: _react.PropTypes.bool,

    /**
     * Accent color of the control.
     */
    tintColor: _react.PropTypes.string,

    /**
     * If true, then selecting a segment won't persist visually.
     * The `onValueChange` callback will still work as expected.
     */
    momentary: _react.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      values: [],
      enabled: true
    };
  },

  getInitialState: function getInitialState() {
    return {
      selectedIndex: this.props.selectedIndex,
      momentary: false
    };
  },

  _onChange: function _onChange(value, index, event) {
    var _this = this;

    if (this.state.selectedIndex == index) return;

    this.setState({
      selectedIndex: index
    });

    if (!event) {
      event = {
        nativeEvent: {}
      };
    }
    // shim the value
    event.nativeEvent.value = value;
    event.nativeEvent.selectedSegmentIndex = index;
    this.props.onChange && this.props.onChange(event);
    this.props.onValueChange && this.props.onValueChange(event.nativeEvent.value);

    if (this.props.momentary) {
      setTimeout(function () {
        return _this.setState({
          selectedIndex: null
        });
      }, 300);
    }
  },

  render: function render() {
    var _this2 = this;

    var props = this.props;

    var items = props.values.map(function (value, index) {
      return _react2['default'].createElement(
        _ReactView2['default'],
        { key: index, style: [styles.segmentedControlItem, props.tintColor ? { borderColor: props.tintColor } : null, _this2.state.selectedIndex === index ? [styles.segmentedControlItemSelected, props.tintColor ? { backgroundColor: props.tintColor } : null] : null, index === 0 ? styles.firstChild : styles.otherChild, index === props.values.length - 1 ? styles.lastChild : null] },
        _react2['default'].createElement(
          _ReactText2['default'],
          { style: [styles.segmentedControlText, props.tintColor ? {
              color: props.tintColor
            } : null, _this2.state.selectedIndex === index ? styles.segmentedControlTextSelected : null],
            onPress: props.enabled ? _this2._onChange.bind(_this2, value, index) : null },
          ' ',
          value,
          ' '
        )
      );
    });

    return _react2['default'].createElement(
      _ReactView2['default'],
      _extends({}, this.props, { style: [styles.segmentedControl, props.enabled ? null : styles.disable, this.props.style] }),
      items
    );
  }
});

var defaultColor = '#007AFF';

var styles = _ReactStyleSheet2['default'].create({
  segmentedControl: {
    height: 28,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  segmentedControlItem: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: defaultColor,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1
  },
  segmentedControlItemSelected: {
    backgroundColor: defaultColor
  },
  segmentedControlText: {
    color: defaultColor,
    fontSize: 12,
    lineHeight: 12,
    padding: '7 0',
    textAlign: 'center'
  },
  segmentedControlTextSelected: {
    color: 'white'
  },
  disable: {
    opacity: 0.5
  },
  firstChild: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderRightWidth: 0
  },
  otherChild: {
    borderRightWidth: 0
  },
  lastChild: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    borderRightWidth: 1
  }
});

module.exports = SegmentedControl;