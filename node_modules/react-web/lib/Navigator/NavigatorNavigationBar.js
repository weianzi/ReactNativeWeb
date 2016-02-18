/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactNavigatorNavigationBar
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactNavigatorNavigationBarStylesAndroid = require('ReactNavigatorNavigationBarStylesAndroid');

var _ReactNavigatorNavigationBarStylesAndroid2 = _interopRequireDefault(_ReactNavigatorNavigationBarStylesAndroid);

var _ReactNavigatorNavigationBarStylesIOS = require('ReactNavigatorNavigationBarStylesIOS');

var _ReactNavigatorNavigationBarStylesIOS2 = _interopRequireDefault(_ReactNavigatorNavigationBarStylesIOS);

var _ReactStyleSheet = require('ReactStyleSheet');

var _ReactStyleSheet2 = _interopRequireDefault(_ReactStyleSheet);

var _ReactStyleSheet3 = _interopRequireDefault(_ReactStyleSheet);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var _ReactSetNativeProps = require('ReactSetNativeProps');

var _ReactSetNativeProps2 = _interopRequireDefault(_ReactSetNativeProps);

var _immutable = require('immutable');

var COMPONENT_NAMES = ['Title', 'LeftButton', 'RightButton'];

var NavigatorNavigationBarStyles = _ReactStyleSheet2['default'].OS === 'android' ? _ReactNavigatorNavigationBarStylesAndroid2['default'] : _ReactNavigatorNavigationBarStylesIOS2['default'];

var navStatePresentedIndex = function navStatePresentedIndex(navState) {
  if (navState.presentedIndex !== undefined) {
    return navState.presentedIndex;
  }
  // TODO: rename `observedTopOfStack` to `presentedIndex` in `NavigatorIOS`
  return navState.observedTopOfStack;
};

var NavigatorNavigationBar = _react2['default'].createClass({
  displayName: 'NavigatorNavigationBar',

  propTypes: {
    navigator: _react.PropTypes.object,
    routeMapper: _react.PropTypes.shape({
      Title: _react.PropTypes.func.isRequired,
      LeftButton: _react.PropTypes.func.isRequired,
      RightButton: _react.PropTypes.func.isRequired
    }).isRequired,
    navState: _react.PropTypes.shape({
      routeStack: _react.PropTypes.arrayOf(_react.PropTypes.object),
      presentedIndex: _react.PropTypes.number
    }),
    navigationStyles: _react.PropTypes.object,
    style: _ReactView2['default'].propTypes.style
  },

  statics: {
    Styles: NavigatorNavigationBarStyles,
    StylesAndroid: _ReactNavigatorNavigationBarStylesAndroid2['default'],
    StylesIOS: _ReactNavigatorNavigationBarStylesIOS2['default']
  },

  getDefaultProps: function getDefaultProps() {
    return {
      navigationStyles: NavigatorNavigationBarStyles
    };
  },

  componentWillMount: function componentWillMount() {
    var _this = this;

    this._components = {};
    this._descriptors = {};

    COMPONENT_NAMES.forEach(function (componentName) {
      _this._components[componentName] = new _immutable.Map();
      _this._descriptors[componentName] = new _immutable.Map();
    });
  },

  _getReusableProps: function _getReusableProps(
  /* string */componentName,
  /* number */index) /* object */{
    if (!this._reusableProps) {
      this._reusableProps = {};
    }
    var propStack = this._reusableProps[componentName];
    if (!propStack) {
      propStack = this._reusableProps[componentName] = [];
    }
    var props = propStack[index];
    if (!props) {
      props = propStack[index] = { style: {} };
    }
    return props;
  },

  _updateIndexProgress: function _updateIndexProgress(
  /* number */progress,
  /* number */index,
  /* number */fromIndex,
  /* number */toIndex) {
    var amount = toIndex > fromIndex ? progress : 1 - progress;
    var oldDistToCenter = index - fromIndex;
    var newDistToCenter = index - toIndex;
    var interpolate;
    if (oldDistToCenter > 0 && newDistToCenter === 0 || newDistToCenter > 0 && oldDistToCenter === 0) {
      interpolate = this.props.navigationStyles.Interpolators.RightToCenter;
    } else if (oldDistToCenter < 0 && newDistToCenter === 0 || newDistToCenter < 0 && oldDistToCenter === 0) {
      interpolate = this.props.navigationStyles.Interpolators.CenterToLeft;
    } else if (oldDistToCenter === newDistToCenter) {
      interpolate = this.props.navigationStyles.Interpolators.RightToCenter;
    } else {
      interpolate = this.props.navigationStyles.Interpolators.RightToLeft;
    }

    COMPONENT_NAMES.forEach(function (componentName) {
      var component = this._components[componentName].get(this.props.navState.routeStack[index]);
      var props = this._getReusableProps(componentName, index);
      if (component && interpolate[componentName](props.style, amount)) {
        (0, _ReactSetNativeProps2['default'])(component, props);
      }
    }, this);
  },

  updateProgress: function updateProgress(
  /* number */progress,
  /* number */fromIndex,
  /* number */toIndex) {
    var max = Math.max(fromIndex, toIndex);
    var min = Math.min(fromIndex, toIndex);
    for (var index = min; index <= max; index++) {
      this._updateIndexProgress(progress, index, fromIndex, toIndex);
    }
  },

  render: function render() {
    var navBarStyle = {
      height: this.props.navigationStyles.General.TotalNavHeight
    };
    var navState = this.props.navState;
    var components = COMPONENT_NAMES.map(function (componentName) {
      return navState.routeStack.map(this._getComponent.bind(this, componentName));
    }, this);

    return _react2['default'].createElement(
      _ReactView2['default'],
      { style: [styles.navBarContainer, navBarStyle, this.props.style] },
      components
    );
  },

  _getComponent: function _getComponent(
  /* string */componentName,
  /* object */route,
  /* number */index) /* ?Object */{
    var _this2 = this;

    if (this._descriptors[componentName].includes(route)) {
      return this._descriptors[componentName].get(route);
    }

    var rendered = null;

    var content = this.props.routeMapper[componentName](this.props.navState.routeStack[index], this.props.navigator, index, this.props.navState);
    if (!content) {
      return null;
    }

    var initialStage = index === navStatePresentedIndex(this.props.navState) ? this.props.navigationStyles.Stages.Center : this.props.navigationStyles.Stages.Left;
    rendered = _react2['default'].createElement(
      _ReactView2['default'],
      {
        ref: function (ref) {
          _this2._components[componentName] = _this2._components[componentName].set(route, ref);
        },
        style: initialStage[componentName] },
      content
    );

    this._descriptors[componentName] = this._descriptors[componentName].set(route, rendered);
    return rendered;
  }

});

var styles = _ReactStyleSheet3['default'].create({
  navBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent'
  }
});

module.exports = NavigatorNavigationBar;