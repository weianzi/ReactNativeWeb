/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactNavigatorBreadcrumbNavigationBar
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactNavigatorBreadcrumbNavigationBarStyles = require('ReactNavigatorBreadcrumbNavigationBarStyles');

var _ReactNavigatorBreadcrumbNavigationBarStyles2 = _interopRequireDefault(_ReactNavigatorBreadcrumbNavigationBarStyles);

var _ReactNavigatorNavigationBarStylesAndroid = require('ReactNavigatorNavigationBarStylesAndroid');

var _ReactNavigatorNavigationBarStylesAndroid2 = _interopRequireDefault(_ReactNavigatorNavigationBarStylesAndroid);

var _ReactNavigatorNavigationBarStylesIOS = require('ReactNavigatorNavigationBarStylesIOS');

var _ReactNavigatorNavigationBarStylesIOS2 = _interopRequireDefault(_ReactNavigatorNavigationBarStylesIOS);

var _ReactPlatform = require('ReactPlatform');

var _ReactPlatform2 = _interopRequireDefault(_ReactPlatform);

var _ReactStyleSheet = require('ReactStyleSheet');

var _ReactStyleSheet2 = _interopRequireDefault(_ReactStyleSheet);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var _ReactSetNativeProps = require('ReactSetNativeProps');

var _ReactSetNativeProps2 = _interopRequireDefault(_ReactSetNativeProps);

var _immutable = require('immutable');

var _fbjsLibInvariant = require('fbjs/lib/invariant');

var _fbjsLibInvariant2 = _interopRequireDefault(_fbjsLibInvariant);

var Interpolators = _ReactNavigatorBreadcrumbNavigationBarStyles2['default'].Interpolators;
var NavigatorNavigationBarStyles = _ReactPlatform2['default'].OS === 'android' ? _ReactNavigatorNavigationBarStylesAndroid2['default'] : _ReactNavigatorNavigationBarStylesIOS2['default'];

/**
 * Reusable props objects.
 */
var CRUMB_PROPS = Interpolators.map(function () {
  return { style: {} };
});
var ICON_PROPS = Interpolators.map(function () {
  return { style: {} };
});
var SEPARATOR_PROPS = Interpolators.map(function () {
  return { style: {} };
});
var TITLE_PROPS = Interpolators.map(function () {
  return { style: {} };
});
var RIGHT_BUTTON_PROPS = Interpolators.map(function () {
  return { style: {} };
});

var navStatePresentedIndex = function navStatePresentedIndex(navState) {
  if (navState.presentedIndex !== undefined) {
    return navState.presentedIndex;
  }
  // TODO: rename `observedTopOfStack` to `presentedIndex` in `NavigatorIOS`
  return navState.observedTopOfStack;
};

/**
 * The first route is initially rendered using a different style than all
 * future routes.
 *
 * @param {number} index Index of breadcrumb.
 * @return {object} Style config for initial rendering of index.
 */
var initStyle = function initStyle(index, presentedIndex) {
  return index === presentedIndex ? _ReactNavigatorBreadcrumbNavigationBarStyles2['default'].Center[index] : index < presentedIndex ? _ReactNavigatorBreadcrumbNavigationBarStyles2['default'].Left[index] : _ReactNavigatorBreadcrumbNavigationBarStyles2['default'].Right[index];
};

var NavigatorBreadcrumbNavigationBar = _react2['default'].createClass({
  displayName: 'NavigatorBreadcrumbNavigationBar',

  propTypes: {
    navigator: _react.PropTypes.shape({
      push: _react.PropTypes.func,
      pop: _react.PropTypes.func,
      replace: _react.PropTypes.func,
      popToRoute: _react.PropTypes.func,
      popToTop: _react.PropTypes.func
    }),
    routeMapper: _react.PropTypes.shape({
      rightContentForRoute: _react.PropTypes.func,
      titleContentForRoute: _react.PropTypes.func,
      iconForRoute: _react.PropTypes.func
    }),
    navState: _react2['default'].PropTypes.shape({
      routeStack: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.object),
      presentedIndex: _react2['default'].PropTypes.number
    }),
    style: _ReactView2['default'].propTypes.style
  },

  statics: {
    Styles: _ReactNavigatorBreadcrumbNavigationBarStyles2['default']
  },

  _updateIndexProgress: function _updateIndexProgress(progress, index, fromIndex, toIndex) {
    var amount = toIndex > fromIndex ? progress : 1 - progress;
    var oldDistToCenter = index - fromIndex;
    var newDistToCenter = index - toIndex;
    var interpolate;
    (0, _fbjsLibInvariant2['default'])(Interpolators[index], 'Cannot find breadcrumb interpolators for ' + index);
    if (oldDistToCenter > 0 && newDistToCenter === 0 || newDistToCenter > 0 && oldDistToCenter === 0) {
      interpolate = Interpolators[index].RightToCenter;
    } else if (oldDistToCenter < 0 && newDistToCenter === 0 || newDistToCenter < 0 && oldDistToCenter === 0) {
      interpolate = Interpolators[index].CenterToLeft;
    } else if (oldDistToCenter === newDistToCenter) {
      interpolate = Interpolators[index].RightToCenter;
    } else {
      interpolate = Interpolators[index].RightToLeft;
    }

    if (interpolate.Crumb(CRUMB_PROPS[index].style, amount)) {
      this._setPropsIfExists('crumb_' + index, CRUMB_PROPS[index]);
    }
    if (interpolate.Icon(ICON_PROPS[index].style, amount)) {
      this._setPropsIfExists('icon_' + index, ICON_PROPS[index]);
    }
    if (interpolate.Separator(SEPARATOR_PROPS[index].style, amount)) {
      this._setPropsIfExists('separator_' + index, SEPARATOR_PROPS[index]);
    }
    if (interpolate.Title(TITLE_PROPS[index].style, amount)) {
      this._setPropsIfExists('title_' + index, TITLE_PROPS[index]);
    }
    var right = this.refs['right_' + index];
    if (right && interpolate.RightItem(RIGHT_BUTTON_PROPS[index].style, amount)) {
      (0, _ReactSetNativeProps2['default'])(right, RIGHT_BUTTON_PROPS[index]);
    }
  },

  updateProgress: function updateProgress(progress, fromIndex, toIndex) {
    var max = Math.max(fromIndex, toIndex);
    var min = Math.min(fromIndex, toIndex);
    for (var index = min; index <= max; index++) {
      this._updateIndexProgress(progress, index, fromIndex, toIndex);
    }
  },

  onAnimationStart: function onAnimationStart(fromIndex, toIndex) {
    var max = Math.max(fromIndex, toIndex);
    var min = Math.min(fromIndex, toIndex);
    for (var index = min; index <= max; index++) {
      this._setRenderViewsToHardwareTextureAndroid(index, true);
    }
  },

  onAnimationEnd: function onAnimationEnd() {
    var max = this.props.navState.routeStack.length - 1;
    for (var index = 0; index <= max; index++) {
      this._setRenderViewsToHardwareTextureAndroid(index, false);
    }
  },

  _setRenderViewsToHardwareTextureAndroid: function _setRenderViewsToHardwareTextureAndroid(index, renderToHardwareTexture) {
    var props = {
      renderToHardwareTextureAndroid: renderToHardwareTexture
    };

    this._setPropsIfExists('icon_' + index, props);
    this._setPropsIfExists('separator_' + index, props);
    this._setPropsIfExists('title_' + index, props);
    this._setPropsIfExists('right_' + index, props);
  },

  componentWillMount: function componentWillMount() {
    this._descriptors = {
      crumb: new _immutable.Map(),
      title: new _immutable.Map(),
      right: new _immutable.Map()
    };
  },

  render: function render() {
    var navState = this.props.navState;
    var icons = navState && navState.routeStack.map(this._getBreadcrumb);
    var titles = navState.routeStack.map(this._getTitle);
    var buttons = navState.routeStack.map(this._getRightButton);
    return _react2['default'].createElement(
      _ReactView2['default'],
      { style: [styles.breadCrumbContainer, this.props.style] },
      titles,
      icons,
      buttons
    );
  },

  _getBreadcrumb: function _getBreadcrumb(route, index) {
    if (this._descriptors.crumb.has(route)) {
      return this._descriptors.crumb.get(route);
    }

    var navBarRouteMapper = this.props.routeMapper;
    var firstStyles = initStyle(index, navStatePresentedIndex(this.props.navState));

    var breadcrumbDescriptor = _react2['default'].createElement(
      _ReactView2['default'],
      { ref: 'crumb_' + index, style: firstStyles.Crumb },
      _react2['default'].createElement(
        _ReactView2['default'],
        { ref: 'icon_' + index, style: firstStyles.Icon },
        navBarRouteMapper.iconForRoute(route, this.props.navigator)
      ),
      _react2['default'].createElement(
        _ReactView2['default'],
        { ref: 'separator_' + index, style: firstStyles.Separator },
        navBarRouteMapper.separatorForRoute(route, this.props.navigator)
      )
    );

    this._descriptors.crumb = this._descriptors.crumb.set(route, breadcrumbDescriptor);
    return breadcrumbDescriptor;
  },

  _getTitle: function _getTitle(route, index) {
    if (this._descriptors.title.has(route)) {
      return this._descriptors.title.get(route);
    }

    var titleContent = this.props.routeMapper.titleContentForRoute(this.props.navState.routeStack[index], this.props.navigator);
    var firstStyles = initStyle(index, navStatePresentedIndex(this.props.navState));

    var titleDescriptor = _react2['default'].createElement(
      _ReactView2['default'],
      { ref: 'title_' + index, style: firstStyles.Title },
      titleContent
    );
    this._descriptors.title = this._descriptors.title.set(route, titleDescriptor);
    return titleDescriptor;
  },

  _getRightButton: function _getRightButton(route, index) {
    if (this._descriptors.right.has(route)) {
      return this._descriptors.right.get(route);
    }
    var rightContent = this.props.routeMapper.rightContentForRoute(this.props.navState.routeStack[index], this.props.navigator);
    if (!rightContent) {
      this._descriptors.right = this._descriptors.right.set(route, null);
      return null;
    }
    var firstStyles = initStyle(index, navStatePresentedIndex(this.props.navState));
    var rightButtonDescriptor = _react2['default'].createElement(
      _ReactView2['default'],
      { ref: 'right_' + index, style: firstStyles.RightItem },
      rightContent
    );
    this._descriptors.right = this._descriptors.right.set(route, rightButtonDescriptor);
    return rightButtonDescriptor;
  },

  _setPropsIfExists: function _setPropsIfExists(ref, props) {
    var ref = this.refs[ref];
    // ref && ref.setNativeProps(props);
    ref && (0, _ReactSetNativeProps2['default'])(ref, props);
  }
});

var styles = _ReactStyleSheet2['default'].create({
  breadCrumbContainer: {
    overflow: 'hidden',
    position: 'absolute',
    height: NavigatorNavigationBarStyles.General.TotalNavHeight,
    top: 0,
    left: 0,
    right: 0
  }
});

module.exports = NavigatorBreadcrumbNavigationBar;