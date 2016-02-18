/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactRenderApplication
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ReactStyleSheet = require('ReactStyleSheet');

var _ReactStyleSheet2 = _interopRequireDefault(_ReactStyleSheet);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var _ReactPortal = require('ReactPortal');

var _ReactPortal2 = _interopRequireDefault(_ReactPortal);

var AppContainer = _react2['default'].createClass({
  displayName: 'AppContainer',

  render: function render() {
    var RootComponent = this.props.rootComponent;
    var appView = _react2['default'].createElement(
      _ReactView2['default'],
      {
        ref: 'main',
        className: _ReactStyleSheet2['default'].rootClassName,
        style: styles.appContainer },
      _react2['default'].createElement(RootComponent, _extends({}, this.props.initialProps, {
        rootTag: this.props.rootTag })),
      _react2['default'].createElement(_ReactPortal2['default'], null)
    );

    return appView;
  }
});

function renderApplication(RootComponent, initialProps, rootTag) {

  _reactDom2['default'].render(_react2['default'].createElement(AppContainer, {
    rootComponent: RootComponent,
    initialProps: initialProps,
    rootTag: rootTag }), rootTag);
}

var styles = _ReactStyleSheet2['default'].create({
  // This is needed so the application covers the whole screen
  // and therefore the contents of the React are not clipped.
  appContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }
});

module.exports = renderApplication;