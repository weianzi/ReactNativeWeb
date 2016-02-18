/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var TabBarContents = _react2['default'].createClass({
  displayName: 'TabBarContents',

  getInitialState: function getInitialState() {
    return {
      hasBeenSelected: false
    };
  },

  componentWillMount: function componentWillMount() {
    if (this.props.selected) {
      this.setState({
        hasBeenSelected: true
      });
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.state.hasBeenSelected || nextProps.selected) {
      this.setState({
        hasBeenSelected: true
      });
    }
  },

  render: function render() {
    var styles = {
      'display': 'none',
      'width': '100%',
      'height': '100%',
      'position': 'relative'
    };

    if (this.props.selected) {
      delete styles.display;
    }

    var tabContents = null;

    // if the tab has already been shown once, always continue to show it so we
    // preserve state between tab transitions
    if (this.state.hasBeenSelected) {
      tabContents = _react2['default'].createElement(
        _ReactView2['default'],
        { style: styles },
        this.props.children
      );
    }

    return tabContents;
  }
});

module.exports = TabBarContents;