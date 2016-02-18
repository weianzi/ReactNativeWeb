/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactStaticRenderer
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var StaticRenderer = _react2['default'].createClass({
  displayName: 'StaticRenderer',

  propTypes: {
    shouldUpdate: _react.PropTypes.bool.isRequired,
    render: _react.PropTypes.func.isRequired
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    return nextProps.shouldUpdate;
  },

  render: function render() {
    return this.props.render();
  }
});

module.exports = StaticRenderer;