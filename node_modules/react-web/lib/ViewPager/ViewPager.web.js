/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * @providesModule ReactViewPager
 *
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var _ReactAnimated = require('ReactAnimated');

var _ReactAnimated2 = _interopRequireDefault(_ReactAnimated);

var _ReactDimensions = require('ReactDimensions');

var _ReactDimensions2 = _interopRequireDefault(_ReactDimensions);

var _ReactPanResponder = require('ReactPanResponder');

var _ReactPanResponder2 = _interopRequireDefault(_ReactPanResponder);

var _ReactDismissKeyboard = require('ReactDismissKeyboard');

var _ReactDismissKeyboard2 = _interopRequireDefault(_ReactDismissKeyboard);

var deviceSize = _ReactDimensions2['default'].get('window');
var VIEWPAGER_REF = 'viewpager';

var ViewPager = _react2['default'].createClass({
  displayName: 'ViewPager',

  propTypes: {
    /**
     * Index of initial page that should be selected. Use `setPage` method to
     * update the page, and `onPageSelected` to monitor page changes
     */
    initialPage: _react.PropTypes.number,

    /**
     * Executed when transitioning between pages (ether because of animation for
     * the requested page change or when user is swiping/dragging between pages)
     * The `event.nativeEvent` object for this callback will carry following data:
     *  - position - index of first page from the left that is currently visible
     *  - offset - value from range [0,1) describing stage between page transitions.
     *    Value x means that (1 - x) fraction of the page at "position" index is
     *    visible, and x fraction of the next page is visible.
     */
    onPageScroll: _react.PropTypes.func,

    /**
     * This callback will be caleld once ViewPager finish navigating to selected page
     * (when user swipes between pages). The `event.nativeEvent` object passed to this
     * callback will have following fields:
     *  - position - index of page that has been selected
     */
    onPageSelected: _react.PropTypes.func,

    /**
     * Determines whether the keyboard gets dismissed in response to a drag.
     *   - 'none' (the default), drags do not dismiss the keyboard.
     *   - 'on-drag', the keyboard is dismissed when a drag begins.
     */
    keyboardDismissMode: _react.PropTypes.oneOf(['none', // default
    'on-drag'])
  },

  getDefaultProps: function getDefaultProps() {
    return {
      initialPage: 0
    };
  },

  getInitialState: function getInitialState() {
    return {
      selectedPage: this.props.initialPage,
      pageWidth: deviceSize.width,
      pageCount: this.props.children.length,
      offsetLeft: new _ReactAnimated2['default'].Value(0)
    };
  },

  getInnerViewNode: function getInnerViewNode() {
    return this.refs[VIEWPAGER_REF].childNodes[0];
  },

  componentWillMount: function componentWillMount() {
    // let { offsetLeft, selectedPage } = this.state;

    // offsetLeft.addListener(({value}) => {
    // bad performance
    // this._onPageScroll({
    //  nativeEvent: {
    //    position: selectedPage,
    //    offset: value - selectedPage
    //  }
    // });
    // });

    this._panResponder = _ReactPanResponder2['default'].create({
      onStartShouldSetResponder: function onStartShouldSetResponder() {
        return true;
      },
      onMoveShouldSetPanResponder: this._shouldSetPanResponder,
      onPanResponderGrant: function onPanResponderGrant() {},
      onPanResponderMove: this._panResponderMove,
      onPanResponderTerminationRequest: function onPanResponderTerminationRequest() {
        return true;
      },
      onPanResponderRelease: this._panResponderRelease,
      onPanResponderTerminate: function onPanResponderTerminate() {}
    });
  },

  componentDidMount: function componentDidMount() {
    this.setPage(this.state.selectedPage);
  },

  _childrenWithOverridenStyle: function _childrenWithOverridenStyle() {
    // Override styles so that each page will fill the parent. Native component
    // will handle positioning of elements, so it's not important to offset
    // them correctly.
    return _react2['default'].Children.map(this.props.children, function (child) {
      var newProps = {
        style: [child.props.style, {
          width: deviceSize.width
        }],
        collapsable: false
      };
      return (0, _react.cloneElement)(child, (0, _objectAssign2['default'])({}, child.props, newProps));
    });
  },
  render: function render() {
    var children = this._childrenWithOverridenStyle();

    var _state = this.state;
    var offsetLeft = _state.offsetLeft;
    var pageWidth = _state.pageWidth;
    var pageCount = _state.pageCount;

    var width = pageWidth * pageCount;
    var count = pageCount - 1;

    var translateX = offsetLeft.interpolate({
      inputRange: [0, count],
      outputRange: [0, -(pageWidth * count)],
      extrapolate: 'clamp'
    });

    return _react2['default'].createElement(
      _ReactView2['default'],
      _extends({ ref: VIEWPAGER_REF,
        style: this.props.style
      }, this._panResponder.panHandlers),
      _react2['default'].createElement(
        _ReactAnimated2['default'].View,
        { style: {
            width: width,
            position: 'absolute',
            top: 0,
            left: translateX,
            bottom: 0,
            flexDirection: 'row'
          } },
        children
      )
    );
  },

  _onPageScroll: function _onPageScroll(event) {
    if (this.props.onPageScroll) {
      this.props.onPageScroll(event);
    }
    if (this.props.keyboardDismissMode === 'on-drag') {
      (0, _ReactDismissKeyboard2['default'])();
    }
  },

  _shouldSetPanResponder: function _shouldSetPanResponder() {
    var _this = this;

    if (this._scrolling) {
      this.state.offsetLeft.stopAnimation(function () {
        _this._scrolling = false;
      });
      return false;
    }

    return true;
  },

  _panResponderMove: function _panResponderMove(ev, _ref) {
    var dx = _ref.dx;

    var val = this.state.selectedPage + dx / this.state.pageWidth * -1;
    this.state.offsetLeft.setValue(val);
  },

  _panResponderRelease: function _panResponderRelease(ev, _ref2) {
    var dx = _ref2.dx;
    var _state2 = this.state;
    var selectedPage = _state2.selectedPage;
    var pageWidth = _state2.pageWidth;

    var range = Math.abs(dx) / pageWidth;
    var threshold = 1 / 5;

    if (range > threshold) {
      if (dx > 0) {
        selectedPage -= 1; // TODO step?
      } else {
          selectedPage += 1;
        }
    }

    this.setPage(selectedPage);
  },

  setPage: function setPage(index) {
    var _this2 = this;

    if (index < 0) {
      index = 0;
    } else if (index >= this.state.pageCount) {
      index = this.state.pageCount - 1;
    }

    this._scrolling = true;

    _ReactAnimated2['default'].spring(this.state.offsetLeft, {
      toValue: index,
      bounciness: 0,
      restSpeedThreshold: 1
    }).start(function () {

      _this2._onPageScroll({
        nativeEvent: {
          position: index,
          offset: 0
        }
      });

      _this2._scrolling = false;

      _this2.setState({
        selectedPage: index
      }, function () {
        _this2.props.onPageSelected && _this2.props.onPageSelected({ nativeEvent: { position: index } });
      });
    });
  }
});

module.exports = ViewPager;