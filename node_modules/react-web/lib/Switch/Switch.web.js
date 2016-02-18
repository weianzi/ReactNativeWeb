/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactSwitch
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Switch = _react2['default'].createClass({
  displayName: 'Switch',

  propTypes: {
    value: _react.PropTypes.bool,
    disabled: _react.PropTypes.bool,
    onValueChange: _react.PropTypes.func,
    onTintColor: _react.PropTypes.string,
    thumbTintColor: _react.PropTypes.string,
    tintColor: _react.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      onTintColor: '#00e158',
      thumbTintColor: '#fff',
      tintColor: '#fff'
    };
  },

  getInitialState: function getInitialState() {
    return {
      value: this.props.value,
      disabled: this.props.disabled
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
      disabled: nextProps.disabled
    });
  },

  getStyles: function getStyles() {
    return {
      span: {
        position: 'relative',
        display: 'inline-block',
        margin: 2,
        height: 30,
        width: 50,
        cursor: 'default', // pointer will cause a grey background color on chrome
        verticalAlign: 'middle',
        borderRadius: 20,
        borderColor: '#dfdfdf',
        borderWidth: 1,
        borderStyle: 'solid',
        WebkitUserSelect: 'none',
        WebkitBoxSizing: 'content-box',
        WebkitBackfaceVisibility: 'hidden'
      },
      checkedSpan: {
        borderColor: this.props.onTintColor,
        backgroundColor: this.props.onTintColor,
        boxShadow: this.props.onTintColor + ' 0 0 0 16px inset',
        WebkitTransition: 'border 0.2s, box-shadow 0.2s, background-color 1s'
      },
      uncheckedSpan: {
        borderColor: '#dfdfdf',
        backgroundColor: this.props.tintColor,
        boxShadow: '#dfdfdf 0 0 0 0 inset',
        WebkitTransition: 'border 0.2s, box-shadow 0.2s'
      },
      disabledSpan: {
        opacity: 0.5,
        cursor: 'not-allowed',
        boxShadow: 'none'
      },
      small: {
        position: 'absolute',
        top: 0,
        width: 30,
        height: 30,
        backgroundColor: this.props.thumbTintColor,
        borderRadius: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        WebkitTransition: '-webkit-transform 0.2s ease-in'
      },
      checkedSmall: {
        WebkitTransform: 'translateX(20px)'
      },
      uncheckedSmall: {
        WebkitTransform: 'translateX(0)'
      }
    };
  },

  handleClick: function handleClick(e) {
    if (this.state.disabled) {
      return null;
    }

    var newVal = !this.state.value;
    this.props.onValueChange && this.props.onValueChange.call(this, newVal);
    this.setState({
      value: newVal
    });

    var oldValue = this.props.value;
    setTimeout((function () {
      if (this.props.value == oldValue) {
        this.setState({
          value: this.props.value
        });
      }
    }).bind(this), 200);
  },

  render: function render() {
    var styles = this.getStyles();
    var spancss = this.state.value ? _extends({}, styles.span, styles.checkedSpan) : _extends({}, styles.span, styles.uncheckedSpan);
    var smallcss = this.state.value ? _extends({}, styles.small, styles.checkedSmall) : _extends({}, styles.small, styles.uncheckedSmall);
    spancss = this.state.disabled ? _extends({}, spancss, styles.disabledSpan) : spancss;

    return _react2['default'].createElement(
      'span',
      { onClick: this.handleClick, style: spancss },
      _react2['default'].createElement('small', { style: smallcss })
    );
  }

});
module.exports = Switch;