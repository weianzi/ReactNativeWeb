/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactPicker
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var PICKER = 'picker';

var Picker = _react2['default'].createClass({
  displayName: 'Picker',

  propTypes: {
    onValueChange: _react.PropTypes.func,
    selectedValue: _react.PropTypes.any },

  // string or integer basically
  _onChange: function _onChange(event) {
    // shim the native event
    event.nativeEvent.newValue = this.refs[PICKER].value;

    if (this.props.onChange) {
      this.props.onChange(event);
    }

    if (this.props.onValueChange) {
      this.props.onValueChange(event.nativeEvent.newValue);
    }
  },

  render: function render() {
    return _react2['default'].createElement(
      'select',
      {
        ref: PICKER,
        value: this.props.selectedValue,
        style: _extends({
          margin: 10,
          color: 'inherit',
          font: 'inherit'
        }, this.props.style),
        onChange: this._onChange
      },
      this.props.children
    );
  }
});

Picker.Item = _react2['default'].createClass({
  displayName: 'Item',

  propTypes: {
    value: _react.PropTypes.any, // string or integer basically
    label: _react.PropTypes.string
  },

  render: function render() {
    return _react2['default'].createElement(
      'option',
      { value: this.props.value },
      this.props.label
    );
  }
});

module.exports = Picker;