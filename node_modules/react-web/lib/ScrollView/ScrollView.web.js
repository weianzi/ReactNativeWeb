/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule ReactScrollView
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ReactScrollResponder = require('ReactScrollResponder');

var _ReactScrollResponder2 = _interopRequireDefault(_ReactScrollResponder);

var _ReactStyleSheet = require('ReactStyleSheet');

var _ReactStyleSheet2 = _interopRequireDefault(_ReactStyleSheet);

var _ReactView = require('ReactView');

var _ReactView2 = _interopRequireDefault(_ReactView);

var _domkitThrottle = require('domkit/throttle');

var _domkitThrottle2 = _interopRequireDefault(_domkitThrottle);

var SCROLLVIEW = 'ScrollView';
var INNERVIEW = 'InnerScrollView';

/**
 * Component that wraps platform ScrollView while providing
 * integration with touch locking "responder" system.
 *
 * Keep in mind that ScrollViews must have a bounded height in order to work,
 * since they contain unbounded-height children into a bounded container (via
 * a scroll interaction). In order to bound the height of a ScrollView, either
 * set the height of the view directly (discouraged) or make sure all parent
 * views have bounded height. Forgetting to transfer `{flex: 1}` down the
 * view stack can lead to errors here, which the element inspector makes
 * easy to debug.
 *
 * Doesn't yet support other contained responders from blocking this scroll
 * view from becoming the responder.
 */
var ScrollView = _react2['default'].createClass({
  displayName: 'ScrollView',

  propTypes: {
    /**
     * Controls whether iOS should automatically adjust the content inset
     * for scroll views that are placed behind a navigation bar or
     * tab bar/ toolbar. The default value is true.
     * @platform ios
     */
    automaticallyAdjustContentInsets: _react.PropTypes.bool,
    /**
     * The amount by which the scroll view content is inset from the edges
     * of the scroll view. Defaults to `{0, 0, 0, 0}`.
     * @platform ios
     */
    // contentInset: EdgeInsetsPropType,
    /**
     * Used to manually set the starting scroll offset.
     * The default value is `{x: 0, y: 0}`.
     * @platform ios
     */
    // contentOffset: PointPropType,
    /**
     * When true, the scroll view bounces when it reaches the end of the
     * content if the content is larger then the scroll view along the axis of
     * the scroll direction. When false, it disables all bouncing even if
     * the `alwaysBounce*` props are true. The default value is true.
     * @platform ios
     */
    bounces: _react.PropTypes.bool,
    /**
     * When true, gestures can drive zoom past min/max and the zoom will animate
     * to the min/max value at gesture end, otherwise the zoom will not exceed
     * the limits.
     * @platform ios
     */
    bouncesZoom: _react.PropTypes.bool,
    /**
     * When true, the scroll view bounces horizontally when it reaches the end
     * even if the content is smaller than the scroll view itself. The default
     * value is true when `horizontal={true}` and false otherwise.
     * @platform ios
     */
    alwaysBounceHorizontal: _react.PropTypes.bool,
    /**
     * When true, the scroll view bounces vertically when it reaches the end
     * even if the content is smaller than the scroll view itself. The default
     * value is false when `horizontal={true}` and true otherwise.
     * @platform ios
     */
    alwaysBounceVertical: _react.PropTypes.bool,
    /**
     * When true, the scroll view automatically centers the content when the
     * content is smaller than the scroll view bounds; when the content is
     * larger than the scroll view, this property has no effect. The default
     * value is false.
     * @platform ios
     */
    centerContent: _react.PropTypes.bool,
    /**
     * These styles will be applied to the scroll view content container which
     * wraps all of the child views. Example:
     *
     *   return (
     *     <ScrollView contentContainerStyle={styles.contentContainer}>
     *     </ScrollView>
     *   );
     *   ...
     *   var styles = StyleSheet.create({
     *     contentContainer: {
     *       paddingVertical: 20
     *     }
     *   });
     */
    // contentContainerStyle: StyleSheetPropType(ViewStylePropTypes),
    /**
     * A floating-point number that determines how quickly the scroll view
     * decelerates after the user lifts their finger. Reasonable choices include
     *   - Normal: 0.998 (the default)
     *   - Fast: 0.9
     * @platform ios
     */
    decelerationRate: _react.PropTypes.number,
    /**
     * When true, the scroll view's children are arranged horizontally in a row
     * instead of vertically in a column. The default value is false.
     */
    horizontal: _react.PropTypes.bool,
    /**
     * When true, the ScrollView will try to lock to only vertical or horizontal
     * scrolling while dragging.  The default value is false.
     * @platform ios
     */
    directionalLockEnabled: _react.PropTypes.bool,
    /**
     * When false, once tracking starts, won't try to drag if the touch moves.
     * The default value is true.
     * @platform ios
     */
    canCancelContentTouches: _react.PropTypes.bool,
    /**
     * Determines whether the keyboard gets dismissed in response to a drag.
     *   - 'none' (the default), drags do not dismiss the keyboard.
     *   - 'on-drag', the keyboard is dismissed when a drag begins.
     *   - 'interactive', the keyboard is dismissed interactively with the drag and moves in
     *     synchrony with the touch; dragging upwards cancels the dismissal.
     *     On android this is not supported and it will have the same behavior as 'none'.
     */
    keyboardDismissMode: _react.PropTypes.oneOf(['none', // default
    'interactive', 'on-drag']),
    /**
     * When false, tapping outside of the focused text input when the keyboard
     * is up dismisses the keyboard. When true, the scroll view will not catch
     * taps, and the keyboard will not dismiss automatically. The default value
     * is false.
     */
    keyboardShouldPersistTaps: _react.PropTypes.bool,
    /**
     * The maximum allowed zoom scale. The default value is 1.0.
     * @platform ios
     */
    maximumZoomScale: _react.PropTypes.number,
    /**
     * The minimum allowed zoom scale. The default value is 1.0.
     * @platform ios
     */
    minimumZoomScale: _react.PropTypes.number,
    /**
     * Fires at most once per frame during scrolling. The frequency of the
     * events can be contolled using the `scrollEventThrottle` prop.
     */
    onScroll: _react.PropTypes.func,
    /**
     * Called when a scrolling animation ends.
     * @platform ios
     */
    onScrollAnimationEnd: _react.PropTypes.func,
    /**
     * When true, the scroll view stops on multiples of the scroll view's size
     * when scrolling. This can be used for horizontal pagination. The default
     * value is false.
     * @platform ios
     */
    pagingEnabled: _react.PropTypes.bool,
    /**
     * When false, the content does not scroll.
     * The default value is true.
     * @platform ios
     */
    scrollEnabled: _react.PropTypes.bool,
    /**
     * This controls how often the scroll event will be fired while scrolling
     * (in events per seconds). A higher number yields better accuracy for code
     * that is tracking the scroll position, but can lead to scroll performance
     * problems due to the volume of information being send over the bridge.
     * The default value is zero, which means the scroll event will be sent
     * only once each time the view is scrolled.
     * @platform ios
     */
    scrollEventThrottle: _react.PropTypes.number,
    /**
     * The amount by which the scroll view indicators are inset from the edges
     * of the scroll view. This should normally be set to the same value as
     * the `contentInset`. Defaults to `{0, 0, 0, 0}`.
     * @platform ios
     */
    // scrollIndicatorInsets: EdgeInsetsPropType,
    /**
     * When true, the scroll view scrolls to top when the status bar is tapped.
     * The default value is true.
     * @platform ios
     */
    scrollsToTop: _react.PropTypes.bool,
    /**
     * When true, shows a horizontal scroll indicator.
     */
    showsHorizontalScrollIndicator: _react.PropTypes.bool,
    /**
     * When true, shows a vertical scroll indicator.
     */
    showsVerticalScrollIndicator: _react.PropTypes.bool,
    /**
     * An array of child indices determining which children get docked to the
     * top of the screen when scrolling. For example, passing
     * `stickyHeaderIndices={[0]}` will cause the first child to be fixed to the
     * top of the scroll view. This property is not supported in conjunction
     * with `horizontal={true}`.
     * @platform ios
     */
    stickyHeaderIndices: _react.PropTypes.arrayOf(_react.PropTypes.number),
    // style: StyleSheetPropType(ViewStylePropTypes),
    /**
     * When set, causes the scroll view to stop at multiples of the value of
     * `snapToInterval`. This can be used for paginating through children
     * that have lengths smaller than the scroll view. Used in combination
     * with `snapToAlignment`.
     * @platform ios
     */
    snapToInterval: _react.PropTypes.number,
    /**
     * When `snapToInterval` is set, `snapToAlignment` will define the relationship
     * of the the snapping to the scroll view.
     *   - `start` (the default) will align the snap at the left (horizontal) or top (vertical)
     *   - `center` will align the snap in the center
     *   - `end` will align the snap at the right (horizontal) or bottom (vertical)
     * @platform ios
     */
    snapToAlignment: _react.PropTypes.oneOf(['start', // default
    'center', 'end']),
    /**
     * Experimental: When true, offscreen child views (whose `overflow` value is
     * `hidden`) are removed from their native backing superview when offscreen.
     * This can improve scrolling performance on long lists. The default value is
     * false.
     */
    removeClippedSubviews: _react.PropTypes.bool,
    /**
     * The current scale of the scroll view content. The default value is 1.0.
     * @platform ios
     */
    zoomScale: _react.PropTypes.number
  },

  mixins: [_ReactScrollResponder2['default'].Mixin],

  getInitialState: function getInitialState() {
    return this.scrollResponderMixinGetInitialState();
  },

  /**
   * Returns a reference to the underlying scroll responder, which supports
   * operations like `scrollTo`. All ScrollView-like components should
   * implement this method so that they can be composed while providing access
   * to the underlying scroll responder's methods.
   */
  getScrollResponder: function getScrollResponder() {
    return this;
  },

  getInnerViewNode: function getInnerViewNode() {
    return this.refs[INNERVIEW];
  },

  scrollTo: function scrollTo(destY, destX) {
    // $FlowFixMe - Don't know how to pass Mixin correctly. Postpone for now
    // this.getScrollResponder().scrollResponderScrollTo(destX || 0, destY || 0);
    this.scrollWithoutAnimationTo(destY, destX);
  },

  scrollWithoutAnimationTo: function scrollWithoutAnimationTo(destY, destX) {
    // $FlowFixMe - Don't know how to pass Mixin correctly. Postpone for now
    // this.getScrollResponder().scrollResponderScrollWithouthAnimationTo(
    //   destX || 0,
    //   destY || 0,
    // );

    var scrollView = _reactDom2['default'].findDOMNode(this.refs[SCROLLVIEW]);
    scrollView.scrollTop = destY || 0;
    scrollView.scrollLeft = destX || 0;
  },

  handleScroll: function handleScroll(e) {
    // if (__DEV__) {
    //   if (this.props.onScroll && !this.props.scrollEventThrottle) {
    //     console.log(
    //       'You specified `onScroll` on a <ScrollView> but not ' +
    //       '`scrollEventThrottle`. You will only receive one event. ' +
    //       'Using `16` you get all the events but be aware that it may ' +
    //       'cause frame drops, use a bigger number if you don\'t need as ' +
    //       'much precision.'
    //     );
    //   }
    // }
    // if (Platform.OS === 'android') {
    //   if (this.props.keyboardDismissMode === 'on-drag') {
    //     dismissKeyboard();
    //   }
    // }

    this.props.onScroll && this.props.onScroll(e);
  },

  render: function render() {
    var contentContainerStyle = [styles.contentContainer, this.props.horizontal && styles.contentContainerHorizontal, this.props.contentContainerStyle];
    // if (__DEV__ && this.props.style) {
    //   var style = flattenStyle(this.props.style);
    //   var childLayoutProps = ['alignItems', 'justifyContent']
    //     .filter((prop) => style && style[prop] !== undefined);
    //   invariant(
    //     childLayoutProps.length === 0,
    //     'ScrollView child layout (' + JSON.stringify(childLayoutProps) +
    //       ') must by applied through the contentContainerStyle prop.'
    //   );
    // }

    var contentContainer = _react2['default'].createElement(
      _ReactView2['default'],
      {
        ref: INNERVIEW,
        style: contentContainerStyle,
        removeClippedSubviews: this.props.removeClippedSubviews,
        collapsable: false },
      this.props.children
    );

    var alwaysBounceHorizontal = this.props.alwaysBounceHorizontal !== undefined ? this.props.alwaysBounceHorizontal : this.props.horizontal;

    var alwaysBounceVertical = this.props.alwaysBounceVertical !== undefined ? this.props.alwaysBounceVertical : !this.props.horizontal;

    if (this.props.scrollEventThrottle && this.props.onScroll) {
      var handleScroll = (0, _domkitThrottle2['default'])(this.handleScroll, this.props.scrollEventThrottle);
    }

    var props = _extends({}, this.props, {
      alwaysBounceHorizontal: alwaysBounceHorizontal,
      alwaysBounceVertical: alwaysBounceVertical,
      style: [styles.base, this.props.style],
      onTouchStart: this.scrollResponderHandleTouchStart,
      onTouchMove: this.scrollResponderHandleTouchMove,
      onTouchEnd: this.scrollResponderHandleTouchEnd,
      onScrollBeginDrag: this.scrollResponderHandleScrollBeginDrag,
      onScrollEndDrag: this.scrollResponderHandleScrollEndDrag,
      onMomentumScrollBegin: this.scrollResponderHandleMomentumScrollBegin,
      onMomentumScrollEnd: this.scrollResponderHandleMomentumScrollEnd,
      onStartShouldSetResponder: this.scrollResponderHandleStartShouldSetResponder,
      onStartShouldSetResponderCapture: this.scrollResponderHandleStartShouldSetResponderCapture,
      // onScrollShouldSetResponder: this.scrollResponderHandleScrollShouldSetResponder,
      // onScroll: handleScroll,
      onScrollShouldSetResponder: handleScroll,
      // replace onScroll in the props
      onScroll: function onScroll() {},
      onResponderGrant: this.scrollResponderHandleResponderGrant,
      onResponderTerminationRequest: this.scrollResponderHandleTerminationRequest,
      onResponderTerminate: this.scrollResponderHandleTerminate,
      onResponderRelease: this.scrollResponderHandleResponderRelease,
      onResponderReject: this.scrollResponderHandleResponderReject
    });

    return _react2['default'].createElement(
      _ReactView2['default'],
      _extends({}, props, { ref: SCROLLVIEW }),
      contentContainer
    );
  }
});

var styles = _ReactStyleSheet2['default'].create({
  base: {
    overflow: 'scroll',
    WebkitOverflowScrolling: 'touch',
    flex: 1
  },
  contentContainer: {
    position: 'absolute',
    minWidth: '100%'
  },
  contentContainerHorizontal: {
    alignSelf: 'flex-start',
    flexDirection: 'row'
  }
});

module.exports = ScrollView;