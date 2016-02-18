/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * 
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ReactEasing = require('ReactEasing');

var _ReactEasing2 = _interopRequireDefault(_ReactEasing);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactInteractionManager = require('ReactInteractionManager');

var _ReactInteractionManager2 = _interopRequireDefault(_ReactInteractionManager);

var _Interpolation = require('./Interpolation');

var _Interpolation2 = _interopRequireDefault(_Interpolation);

var _coreJsLibraryFnSet = require('core-js/library/fn/set');

var _coreJsLibraryFnSet2 = _interopRequireDefault(_coreJsLibraryFnSet);

var _SpringConfig = require('./SpringConfig');

var _SpringConfig2 = _interopRequireDefault(_SpringConfig);

var _ReactFlattenStyle = require('ReactFlattenStyle');

var _ReactFlattenStyle2 = _interopRequireDefault(_ReactFlattenStyle);

var _fbjsLibInvariant = require('fbjs/lib/invariant');

var _fbjsLibInvariant2 = _interopRequireDefault(_fbjsLibInvariant);

var _polyfillsRequestAnimationFrame = require('./polyfills/requestAnimationFrame');

var _polyfillsRequestAnimationFrame2 = _interopRequireDefault(_polyfillsRequestAnimationFrame);

// Note(vjeux): this would be better as an interface but flow doesn't
// support them yet

var Animated = (function () {
  function Animated() {
    _classCallCheck(this, Animated);
  }

  // Important note: start() and stop() will only be called at most once.
  // Once an animation has been stopped or finished its course, it will
  // not be reused.

  _createClass(Animated, [{
    key: '__attach',
    value: function __attach() {}
  }, {
    key: '__detach',
    value: function __detach() {}
  }, {
    key: '__getValue',
    value: function __getValue() {}
  }, {
    key: '__getAnimatedValue',
    value: function __getAnimatedValue() {
      return this.__getValue();
    }
  }, {
    key: '__addChild',
    value: function __addChild(child) {}
  }, {
    key: '__removeChild',
    value: function __removeChild(child) {}
  }, {
    key: '__getChildren',
    value: function __getChildren() {
      return [];
    }
  }]);

  return Animated;
})();

var Animation = (function () {
  function Animation() {
    _classCallCheck(this, Animation);
  }

  _createClass(Animation, [{
    key: 'start',
    value: function start(fromValue, onUpdate, onEnd, previousAnimation) {}
  }, {
    key: 'stop',
    value: function stop() {}

    // Helper function for subclasses to make sure onEnd is only called once.
  }, {
    key: '__debouncedOnEnd',
    value: function __debouncedOnEnd(result) {
      var onEnd = this.__onEnd;
      this.__onEnd = null;
      onEnd && onEnd(result);
    }
  }]);

  return Animation;
})();

var AnimatedWithChildren = (function (_Animated) {
  _inherits(AnimatedWithChildren, _Animated);

  function AnimatedWithChildren() {
    _classCallCheck(this, AnimatedWithChildren);

    _get(Object.getPrototypeOf(AnimatedWithChildren.prototype), 'constructor', this).call(this);
    this._children = [];
  }

  /**
   * Animated works by building a directed acyclic graph of dependencies
   * transparently when you render your Animated components.
   *
   *               new Animated.Value(0)
   *     .interpolate()        .interpolate()    new Animated.Value(1)
   *         opacity               translateY      scale
   *          style                         transform
   *         View#234                         style
   *                                         View#123
   *
   * A) Top Down phase
   * When an Animated.Value is updated, we recursively go down through this
   * graph in order to find leaf nodes: the views that we flag as needing
   * an update.
   *
   * B) Bottom Up phase
   * When a view is flagged as needing an update, we recursively go back up
   * in order to build the new value that it needs. The reason why we need
   * this two-phases process is to deal with composite props such as
   * transform which can receive values from multiple parents.
   */

  _createClass(AnimatedWithChildren, [{
    key: '__addChild',
    value: function __addChild(child) {
      if (this._children.length === 0) {
        this.__attach();
      }
      this._children.push(child);
    }
  }, {
    key: '__removeChild',
    value: function __removeChild(child) {
      var index = this._children.indexOf(child);
      if (index === -1) {
        console.warn('Trying to remove a child that doesn\'t exist');
        return;
      }
      this._children.splice(index, 1);
      if (this._children.length === 0) {
        this.__detach();
      }
    }
  }, {
    key: '__getChildren',
    value: function __getChildren() {
      return this._children;
    }
  }]);

  return AnimatedWithChildren;
})(Animated);

function _flush(rootNode) {
  var animatedStyles = new _coreJsLibraryFnSet2['default']();
  function findAnimatedStyles(node) {
    if (typeof node.update === 'function') {
      animatedStyles.add(node);
    } else {
      node.__getChildren().forEach(findAnimatedStyles);
    }
  }
  findAnimatedStyles(rootNode);
  animatedStyles.forEach(function (animatedStyle) {
    return animatedStyle.update();
  });
}

var easeInOut = _ReactEasing2['default'].inOut(_ReactEasing2['default'].ease);

var TimingAnimation = (function (_Animation) {
  _inherits(TimingAnimation, _Animation);

  function TimingAnimation(config) {
    _classCallCheck(this, TimingAnimation);

    _get(Object.getPrototypeOf(TimingAnimation.prototype), 'constructor', this).call(this);
    this._toValue = config.toValue;
    this._easing = config.easing || easeInOut;
    this._duration = config.duration !== undefined ? config.duration : 500;
    this._delay = config.delay || 0;
  }

  _createClass(TimingAnimation, [{
    key: 'start',
    value: function start(fromValue, onUpdate, onEnd) {
      var _this = this;

      this.__active = true;
      this._fromValue = fromValue;
      this._onUpdate = onUpdate;
      this.__onEnd = onEnd;

      var start = function start() {
        if (_this._duration === 0) {
          _this._onUpdate(_this._toValue);
          _this.__debouncedOnEnd({ finished: true });
        } else {
          _this._startTime = Date.now();
          _this._animationFrame = (0, _polyfillsRequestAnimationFrame2['default'])(_this.onUpdate.bind(_this));
        }
      };
      if (this._delay) {
        this._timeout = setTimeout(start, this._delay);
      } else {
        start();
      }
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate() {
      var now = Date.now();
      if (now >= this._startTime + this._duration) {
        if (this._duration === 0) {
          this._onUpdate(this._toValue);
        } else {
          this._onUpdate(this._fromValue + this._easing(1) * (this._toValue - this._fromValue));
        }
        this.__debouncedOnEnd({ finished: true });
        return;
      }

      this._onUpdate(this._fromValue + this._easing((now - this._startTime) / this._duration) * (this._toValue - this._fromValue));
      if (this.__active) {
        this._animationFrame = (0, _polyfillsRequestAnimationFrame2['default'])(this.onUpdate.bind(this));
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.__active = false;
      clearTimeout(this._timeout);
      window.cancelAnimationFrame(this._animationFrame);
      this.__debouncedOnEnd({ finished: false });
    }
  }]);

  return TimingAnimation;
})(Animation);

var DecayAnimation = (function (_Animation2) {
  _inherits(DecayAnimation, _Animation2);

  function DecayAnimation(config) {
    _classCallCheck(this, DecayAnimation);

    _get(Object.getPrototypeOf(DecayAnimation.prototype), 'constructor', this).call(this);
    this._deceleration = config.deceleration || 0.998;
    this._velocity = config.velocity;
  }

  _createClass(DecayAnimation, [{
    key: 'start',
    value: function start(fromValue, onUpdate, onEnd) {
      this.__active = true;
      this._lastValue = fromValue;
      this._fromValue = fromValue;
      this._onUpdate = onUpdate;
      this.__onEnd = onEnd;
      this._startTime = Date.now();
      this._animationFrame = (0, _polyfillsRequestAnimationFrame2['default'])(this.onUpdate.bind(this));
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate() {
      var now = Date.now();

      var value = this._fromValue + this._velocity / (1 - this._deceleration) * (1 - Math.exp(-(1 - this._deceleration) * (now - this._startTime)));

      this._onUpdate(value);

      if (Math.abs(this._lastValue - value) < 0.1) {
        this.__debouncedOnEnd({ finished: true });
        return;
      }

      this._lastValue = value;
      if (this.__active) {
        this._animationFrame = (0, _polyfillsRequestAnimationFrame2['default'])(this.onUpdate.bind(this));
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.__active = false;
      window.cancelAnimationFrame(this._animationFrame);
      this.__debouncedOnEnd({ finished: false });
    }
  }]);

  return DecayAnimation;
})(Animation);

function withDefault(value, defaultValue) {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return value;
}

var SpringAnimation = (function (_Animation3) {
  _inherits(SpringAnimation, _Animation3);

  function SpringAnimation(config) {
    _classCallCheck(this, SpringAnimation);

    _get(Object.getPrototypeOf(SpringAnimation.prototype), 'constructor', this).call(this);

    this._overshootClamping = withDefault(config.overshootClamping, false);
    this._restDisplacementThreshold = withDefault(config.restDisplacementThreshold, 0.001);
    this._restSpeedThreshold = withDefault(config.restSpeedThreshold, 0.001);
    this._initialVelocity = config.velocity;
    this._lastVelocity = withDefault(config.velocity, 0);
    this._toValue = config.toValue;

    var springConfig;
    if (config.bounciness !== undefined || config.speed !== undefined) {
      (0, _fbjsLibInvariant2['default'])(config.tension === undefined && config.friction === undefined, 'You can only define bounciness/speed or tension/friction but not both');
      springConfig = _SpringConfig2['default'].fromBouncinessAndSpeed(withDefault(config.bounciness, 8), withDefault(config.speed, 12));
    } else {
      springConfig = _SpringConfig2['default'].fromOrigamiTensionAndFriction(withDefault(config.tension, 40), withDefault(config.friction, 7));
    }
    this._tension = springConfig.tension;
    this._friction = springConfig.friction;
  }

  _createClass(SpringAnimation, [{
    key: 'start',
    value: function start(fromValue, onUpdate, onEnd, previousAnimation) {
      this.__active = true;
      this._startPosition = fromValue;
      this._lastPosition = this._startPosition;

      this._onUpdate = onUpdate;
      this.__onEnd = onEnd;
      this._lastTime = Date.now();

      if (previousAnimation instanceof SpringAnimation) {
        var internalState = previousAnimation.getInternalState();
        this._lastPosition = internalState.lastPosition;
        this._lastVelocity = internalState.lastVelocity;
        this._lastTime = internalState.lastTime;
      }
      if (this._initialVelocity !== undefined && this._initialVelocity !== null) {
        this._lastVelocity = this._initialVelocity;
      }
      this.onUpdate();
    }
  }, {
    key: 'getInternalState',
    value: function getInternalState() {
      return {
        lastPosition: this._lastPosition,
        lastVelocity: this._lastVelocity,
        lastTime: this._lastTime
      };
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate() {
      var position = this._lastPosition;
      var velocity = this._lastVelocity;

      var tempPosition = this._lastPosition;
      var tempVelocity = this._lastVelocity;

      // If for some reason we lost a lot of frames (e.g. process large payload or
      // stopped in the debugger), we only advance by 4 frames worth of
      // computation and will continue on the next frame. It's better to have it
      // running at faster speed than jumping to the end.
      var MAX_STEPS = 64;
      var now = Date.now();
      if (now > this._lastTime + MAX_STEPS) {
        now = this._lastTime + MAX_STEPS;
      }

      // We are using a fixed time step and a maximum number of iterations.
      // The following post provides a lot of thoughts into how to build this
      // loop: http://gafferongames.com/game-physics/fix-your-timestep/
      var TIMESTEP_MSEC = 1;
      var numSteps = Math.floor((now - this._lastTime) / TIMESTEP_MSEC);

      for (var i = 0; i < numSteps; ++i) {
        // Velocity is based on seconds instead of milliseconds
        var step = TIMESTEP_MSEC / 1000;

        // This is using RK4. A good blog post to understand how it works:
        // http://gafferongames.com/game-physics/integration-basics/
        var aVelocity = velocity;
        var aAcceleration = this._tension * (this._toValue - tempPosition) - this._friction * tempVelocity;
        var tempPosition = position + aVelocity * step / 2;
        var tempVelocity = velocity + aAcceleration * step / 2;

        var bVelocity = tempVelocity;
        var bAcceleration = this._tension * (this._toValue - tempPosition) - this._friction * tempVelocity;
        tempPosition = position + bVelocity * step / 2;
        tempVelocity = velocity + bAcceleration * step / 2;

        var cVelocity = tempVelocity;
        var cAcceleration = this._tension * (this._toValue - tempPosition) - this._friction * tempVelocity;
        tempPosition = position + cVelocity * step / 2;
        tempVelocity = velocity + cAcceleration * step / 2;

        var dVelocity = tempVelocity;
        var dAcceleration = this._tension * (this._toValue - tempPosition) - this._friction * tempVelocity;
        tempPosition = position + cVelocity * step / 2;
        tempVelocity = velocity + cAcceleration * step / 2;

        var dxdt = (aVelocity + 2 * (bVelocity + cVelocity) + dVelocity) / 6;
        var dvdt = (aAcceleration + 2 * (bAcceleration + cAcceleration) + dAcceleration) / 6;

        position += dxdt * step;
        velocity += dvdt * step;
      }

      this._lastTime = now;
      this._lastPosition = position;
      this._lastVelocity = velocity;

      this._onUpdate(position);
      if (!this.__active) {
        // a listener might have stopped us in _onUpdate
        return;
      }

      // Conditions for stopping the spring animation
      var isOvershooting = false;
      if (this._overshootClamping && this._tension !== 0) {
        if (this._startPosition < this._toValue) {
          isOvershooting = position > this._toValue;
        } else {
          isOvershooting = position < this._toValue;
        }
      }
      var isVelocity = Math.abs(velocity) <= this._restSpeedThreshold;
      var isDisplacement = true;
      if (this._tension !== 0) {
        isDisplacement = Math.abs(this._toValue - position) <= this._restDisplacementThreshold;
      }

      if (isOvershooting || isVelocity && isDisplacement) {
        if (this._tension !== 0) {
          // Ensure that we end up with a round value
          this._onUpdate(this._toValue);
        }

        this.__debouncedOnEnd({ finished: true });
        return;
      }
      this._animationFrame = (0, _polyfillsRequestAnimationFrame2['default'])(this.onUpdate.bind(this));
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.__active = false;
      window.cancelAnimationFrame(this._animationFrame);
      this.__debouncedOnEnd({ finished: false });
    }
  }]);

  return SpringAnimation;
})(Animation);

var _uniqueId = 1;

/**
 * Standard value for driving animations.  One `Animated.Value` can drive
 * multiple properties in a synchronized fashion, but can only be driven by one
 * mechanism at a time.  Using a new mechanism (e.g. starting a new animation,
 * or calling `setValue`) will stop any previous ones.
 */

var AnimatedValue = (function (_AnimatedWithChildren) {
  _inherits(AnimatedValue, _AnimatedWithChildren);

  function AnimatedValue(value) {
    _classCallCheck(this, AnimatedValue);

    _get(Object.getPrototypeOf(AnimatedValue.prototype), 'constructor', this).call(this);
    this._value = value;
    this._offset = 0;
    this._animation = null;
    this._listeners = {};
  }

  _createClass(AnimatedValue, [{
    key: '__detach',
    value: function __detach() {
      this.stopAnimation();
    }
  }, {
    key: '__getValue',
    value: function __getValue() {
      return this._value + this._offset;
    }

    /**
     * Directly set the value.  This will stop any animations running on the value
     * and udpate all the bound properties.
     */
  }, {
    key: 'setValue',
    value: function setValue(value) {
      if (this._animation) {
        this._animation.stop();
        this._animation = null;
      }
      this._updateValue(value);
    }

    /**
     * Sets an offset that is applied on top of whatever value is set, whether via
     * `setValue`, an animation, or `Animated.event`.  Useful for compensating
     * things like the start of a pan gesture.
     */
  }, {
    key: 'setOffset',
    value: function setOffset(offset) {
      this._offset = offset;
    }

    /**
     * Merges the offset value into the base value and resets the offset to zero.
     * The final output of the value is unchanged.
     */
  }, {
    key: 'flattenOffset',
    value: function flattenOffset() {
      this._value += this._offset;
      this._offset = 0;
    }

    /**
     * Adds an asynchronous listener to the value so you can observe updates from
     * animations or whathaveyou.  This is useful because there is no way to
     * syncronously read the value because it might be driven natively.
     */
  }, {
    key: 'addListener',
    value: function addListener(callback) {
      var id = String(_uniqueId++);
      this._listeners[id] = callback;
      return id;
    }
  }, {
    key: 'removeListener',
    value: function removeListener(id) {
      delete this._listeners[id];
    }
  }, {
    key: 'removeAllListeners',
    value: function removeAllListeners() {
      this._listeners = {};
    }

    /**
     * Stops any running animation or tracking.  `callback` is invoked with the
     * final value after stopping the animation, which is useful for updating
     * state to match the animation position with layout.
     */
  }, {
    key: 'stopAnimation',
    value: function stopAnimation(callback) {
      this.stopTracking();
      this._animation && this._animation.stop();
      this._animation = null;
      callback && callback(this.__getValue());
    }

    /**
     * Interpolates the value before updating the property, e.g. mapping 0-1 to
     * 0-10.
     */
  }, {
    key: 'interpolate',
    value: function interpolate(config) {
      return new AnimatedInterpolation(this, _Interpolation2['default'].create(config));
    }

    /**
     * Typically only used internally, but could be used by a custom Animation
     * class.
     */
  }, {
    key: 'animate',
    value: function animate(animation, callback) {
      var _this2 = this;

      var handle = _ReactInteractionManager2['default'].createInteractionHandle();
      var previousAnimation = this._animation;
      this._animation && this._animation.stop();
      this._animation = animation;
      animation.start(this._value, function (value) {
        _this2._updateValue(value);
      }, function (result) {
        _this2._animation = null;
        _ReactInteractionManager2['default'].clearInteractionHandle(handle);
        callback && callback(result);
      }, previousAnimation);
    }

    /**
     * Typically only used internally.
     */
  }, {
    key: 'stopTracking',
    value: function stopTracking() {
      this._tracking && this._tracking.__detach();
      this._tracking = null;
    }

    /**
     * Typically only used internally.
     */
  }, {
    key: 'track',
    value: function track(tracking) {
      this.stopTracking();
      this._tracking = tracking;
    }
  }, {
    key: '_updateValue',
    value: function _updateValue(value) {
      this._value = value;
      _flush(this);
      for (var key in this._listeners) {
        this._listeners[key]({ value: this.__getValue() });
      }
    }
  }]);

  return AnimatedValue;
})(AnimatedWithChildren);

/**
 * 2D Value for driving 2D animations, such as pan gestures.  Almost identical
 * API to normal `Animated.Value`, but multiplexed.  Contains two regular
 * `Animated.Value`s under the hood.  Example:
 *
 *```javascript
 *  class DraggableView extends React.Component {
 *    constructor(props) {
 *      super(props);
 *      this.state = {
 *        pan: new Animated.ValueXY(), // inits to zero
 *      };
 *      this.state.panResponder = PanResponder.create({
 *        onStartShouldSetPanResponder: () => true,
 *        onPanResponderMove: Animated.event([null, {
 *          dx: this.state.pan.x, // x,y are Animated.Value
 *          dy: this.state.pan.y,
 *        }]),
 *        onPanResponderRelease: () => {
 *          Animated.spring(
 *            this.state.pan,         // Auto-multiplexed
 *            {toValue: {x: 0, y: 0}} // Back to zero
 *          ).start();
 *        },
 *      });
 *    }
 *    render() {
 *      return (
 *        <Animated.View
 *          {...this.state.panResponder.panHandlers}
 *          style={this.state.pan.getLayout()}>
 *          {this.props.children}
 *        </Animated.View>
 *      );
 *    }
 *  }
 *```
 */

var AnimatedValueXY = (function (_AnimatedWithChildren2) {
  _inherits(AnimatedValueXY, _AnimatedWithChildren2);

  function AnimatedValueXY(valueIn) {
    _classCallCheck(this, AnimatedValueXY);

    _get(Object.getPrototypeOf(AnimatedValueXY.prototype), 'constructor', this).call(this);
    var value = valueIn || { x: 0, y: 0 }; // fixme: shouldn't need `: any`
    if (typeof value.x === 'number' && typeof value.y === 'number') {
      this.x = new AnimatedValue(value.x);
      this.y = new AnimatedValue(value.y);
    } else {
      (0, _fbjsLibInvariant2['default'])(value.x instanceof AnimatedValue && value.y instanceof AnimatedValue, 'AnimatedValueXY must be initalized with an object of numbers or ' + 'AnimatedValues.');
      this.x = value.x;
      this.y = value.y;
    }
    this._listeners = {};
  }

  _createClass(AnimatedValueXY, [{
    key: 'setValue',
    value: function setValue(value) {
      this.x.setValue(value.x);
      this.y.setValue(value.y);
    }
  }, {
    key: 'setOffset',
    value: function setOffset(offset) {
      this.x.setOffset(offset.x);
      this.y.setOffset(offset.y);
    }
  }, {
    key: 'flattenOffset',
    value: function flattenOffset() {
      this.x.flattenOffset();
      this.y.flattenOffset();
    }
  }, {
    key: '__getValue',
    value: function __getValue() {
      return {
        x: this.x.__getValue(),
        y: this.y.__getValue()
      };
    }
  }, {
    key: 'stopAnimation',
    value: function stopAnimation(callback) {
      this.x.stopAnimation();
      this.y.stopAnimation();
      callback && callback(this.__getValue());
    }
  }, {
    key: 'addListener',
    value: function addListener(callback) {
      var _this3 = this;

      var id = String(_uniqueId++);
      var jointCallback = function jointCallback(_ref) {
        var number = _ref.value;

        callback(_this3.__getValue());
      };
      this._listeners[id] = {
        x: this.x.addListener(jointCallback),
        y: this.y.addListener(jointCallback)
      };
      return id;
    }
  }, {
    key: 'removeListener',
    value: function removeListener(id) {
      this.x.removeListener(this._listeners[id].x);
      this.y.removeListener(this._listeners[id].y);
      delete this._listeners[id];
    }

    /**
     * Converts `{x, y}` into `{left, top}` for use in style, e.g.
     *
     *```javascript
     *  style={this.state.anim.getLayout()}
     *```
     */
  }, {
    key: 'getLayout',
    value: function getLayout() {
      return {
        left: this.x,
        top: this.y
      };
    }

    /**
     * Converts `{x, y}` into a useable translation transform, e.g.
     *
     *```javascript
     *  style={{
     *    transform: this.state.anim.getTranslateTransform()
     *  }}
     *```
     */
  }, {
    key: 'getTranslateTransform',
    value: function getTranslateTransform() {
      return [{ translateX: this.x }, { translateY: this.y }];
    }
  }]);

  return AnimatedValueXY;
})(AnimatedWithChildren);

var AnimatedInterpolation = (function (_AnimatedWithChildren3) {
  _inherits(AnimatedInterpolation, _AnimatedWithChildren3);

  function AnimatedInterpolation(parent, interpolation) {
    _classCallCheck(this, AnimatedInterpolation);

    _get(Object.getPrototypeOf(AnimatedInterpolation.prototype), 'constructor', this).call(this);
    this._parent = parent;
    this._interpolation = interpolation;
  }

  _createClass(AnimatedInterpolation, [{
    key: '__getValue',
    value: function __getValue() {
      var parentValue = this._parent.__getValue();
      (0, _fbjsLibInvariant2['default'])(typeof parentValue === 'number', 'Cannot interpolate an input which is not a number.');
      return this._interpolation(parentValue);
    }
  }, {
    key: 'interpolate',
    value: function interpolate(config) {
      return new AnimatedInterpolation(this, _Interpolation2['default'].create(config));
    }
  }, {
    key: '__attach',
    value: function __attach() {
      this._parent.__addChild(this);
    }
  }, {
    key: '__detach',
    value: function __detach() {
      this._parent.__removeChild(this);
    }
  }]);

  return AnimatedInterpolation;
})(AnimatedWithChildren);

var AnimatedTransform = (function (_AnimatedWithChildren4) {
  _inherits(AnimatedTransform, _AnimatedWithChildren4);

  function AnimatedTransform(transforms) {
    _classCallCheck(this, AnimatedTransform);

    _get(Object.getPrototypeOf(AnimatedTransform.prototype), 'constructor', this).call(this);
    this._transforms = transforms;
  }

  _createClass(AnimatedTransform, [{
    key: '__getValue',
    value: function __getValue() {
      // return this._transforms.map(transform => {
      //   var result = {};
      //   for (var key in transform) {
      //     var value = transform[key];
      //     if (value instanceof Animated) {
      //       result[key] = value.__getValue();
      //     } else {
      //       result[key] = value;
      //     }
      //   }
      //   return result;
      // });

      // NOTE: transform的处理在StyleSheet中
      return this._transforms;
    }
  }, {
    key: '__getAnimatedValue',
    value: function __getAnimatedValue() {
      return this._transforms.map(function (transform) {
        var result = {};
        for (var key in transform) {
          var value = transform[key];
          if (value instanceof Animated) {
            result[key] = value.__getAnimatedValue();
          } else {
            // All transform components needed to recompose matrix
            result[key] = value;
          }
        }
        return result;
      });
    }
  }, {
    key: '__attach',
    value: function __attach() {
      var _this4 = this;

      this._transforms.forEach(function (transform) {
        for (var key in transform) {
          var value = transform[key];
          if (value instanceof Animated) {
            value.__addChild(_this4);
          }
        }
      });
    }
  }, {
    key: '__detach',
    value: function __detach() {
      var _this5 = this;

      this._transforms.forEach(function (transform) {
        for (var key in transform) {
          var value = transform[key];
          if (value instanceof Animated) {
            value.__removeChild(_this5);
          }
        }
      });
    }
  }]);

  return AnimatedTransform;
})(AnimatedWithChildren);

var AnimatedStyle = (function (_AnimatedWithChildren5) {
  _inherits(AnimatedStyle, _AnimatedWithChildren5);

  function AnimatedStyle(style) {
    _classCallCheck(this, AnimatedStyle);

    _get(Object.getPrototypeOf(AnimatedStyle.prototype), 'constructor', this).call(this);
    style = (0, _ReactFlattenStyle2['default'])(style) || {};
    if (style.transform) {
      style = _extends({}, style, {
        transform: new AnimatedTransform(style.transform)
      });
    }
    this._style = style;
  }

  _createClass(AnimatedStyle, [{
    key: '__getValue',
    value: function __getValue() {
      var style = {};
      for (var key in this._style) {
        var value = this._style[key];
        if (value instanceof Animated) {
          style[key] = value.__getValue();
        } else {
          style[key] = value;
        }
      }
      return style;
    }
  }, {
    key: '__getAnimatedValue',
    value: function __getAnimatedValue() {
      var style = {};
      for (var key in this._style) {
        var value = this._style[key];
        if (value instanceof Animated) {
          style[key] = value.__getAnimatedValue();
        }
      }
      return style;
    }
  }, {
    key: '__attach',
    value: function __attach() {
      for (var key in this._style) {
        var value = this._style[key];
        if (value instanceof Animated) {
          value.__addChild(this);
        }
      }
    }
  }, {
    key: '__detach',
    value: function __detach() {
      for (var key in this._style) {
        var value = this._style[key];
        if (value instanceof Animated) {
          value.__removeChild(this);
        }
      }
    }
  }]);

  return AnimatedStyle;
})(AnimatedWithChildren);

var AnimatedProps = (function (_Animated2) {
  _inherits(AnimatedProps, _Animated2);

  function AnimatedProps(props, callback) {
    _classCallCheck(this, AnimatedProps);

    _get(Object.getPrototypeOf(AnimatedProps.prototype), 'constructor', this).call(this);
    if (props.style) {
      props = _extends({}, props, {
        style: new AnimatedStyle(props.style)
      });
    }
    this._props = props;
    this._callback = callback;
    this.__attach();
  }

  _createClass(AnimatedProps, [{
    key: '__getValue',
    value: function __getValue() {
      var props = {};
      for (var key in this._props) {
        var value = this._props[key];
        if (value instanceof Animated) {
          props[key] = value.__getValue();
        } else {
          props[key] = value;
        }
      }
      return props;
    }
  }, {
    key: '__getAnimatedValue',
    value: function __getAnimatedValue() {
      var props = {};
      for (var key in this._props) {
        var value = this._props[key];
        if (value instanceof Animated) {
          props[key] = value.__getAnimatedValue();
        }
      }
      return props;
    }
  }, {
    key: '__attach',
    value: function __attach() {
      for (var key in this._props) {
        var value = this._props[key];
        if (value instanceof Animated) {
          value.__addChild(this);
        }
      }
    }
  }, {
    key: '__detach',
    value: function __detach() {
      for (var key in this._props) {
        var value = this._props[key];
        if (value instanceof Animated) {
          value.__removeChild(this);
        }
      }
    }
  }, {
    key: 'update',
    value: function update() {
      this._callback();
    }
  }]);

  return AnimatedProps;
})(Animated);

function createAnimatedComponent(Component) {
  var refName = 'node';

  var AnimatedComponent = (function (_React$Component) {
    _inherits(AnimatedComponent, _React$Component);

    function AnimatedComponent() {
      _classCallCheck(this, AnimatedComponent);

      _get(Object.getPrototypeOf(AnimatedComponent.prototype), 'constructor', this).apply(this, arguments);
    }

    // NOTE: added for type check

    _createClass(AnimatedComponent, [{
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this._propsAnimated && this._propsAnimated.__detach();
      }
    }, {
      key: 'setNativeProps',
      value: function setNativeProps(props) {
        this.refs[refName].setNativeProps(props);
      }
    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        this.attachProps(this.props);
      }
    }, {
      key: 'attachProps',
      value: function attachProps(nextProps) {
        var _this6 = this;

        var oldPropsAnimated = this._propsAnimated;

        // The system is best designed when setNativeProps is implemented. It is
        // able to avoid re-rendering and directly set the attributes that
        // changed. However, setNativeProps can only be implemented on leaf
        // native components. If you want to animate a composite component, you
        // need to re-render it. In this case, we have a fallback that uses
        // forceUpdate.
        var callback = function callback() {
          if (_this6.refs[refName].setNativeProps) {
            var value = _this6._propsAnimated.__getAnimatedValue();
            _this6.refs[refName].setNativeProps(value);
          } else {
            _this6.forceUpdate();
          }
        };

        this._propsAnimated = new AnimatedProps(nextProps, callback);

        // When you call detach, it removes the element from the parent list
        // of children. If it goes to 0, then the parent also detaches itself
        // and so on.
        // An optimization is to attach the new elements and THEN detach the old
        // ones instead of detaching and THEN attaching.
        // This way the intermediate state isn't to go to 0 and trigger
        // this expensive recursive detaching to then re-attach everything on
        // the very next operation.
        oldPropsAnimated && oldPropsAnimated.__detach();
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        this.attachProps(nextProps);
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2['default'].createElement(Component, _extends({}, this._propsAnimated.__getValue(), {
          ref: refName
        }));
      }
    }]);

    return AnimatedComponent;
  })(_react2['default'].Component);

  AnimatedComponent.displayName = 'AnimatedComponent';

  AnimatedComponent.propTypes = {
    style: function style(props, propName, componentName) {
      // for (var key in ViewStylePropTypes) {
      //   if (!Component.propTypes[key] && props[key] !== undefined) {
      //     console.error(
      //       'You are setting the style `{ ' + key + ': ... }` as a prop. You ' +
      //       'should nest it in a style object. ' +
      //       'E.g. `{ style: { ' + key + ': ... } }`'
      //     );
      //   }
      // }
    }
  };

  return AnimatedComponent;
}

var AnimatedTracking = (function (_Animated3) {
  _inherits(AnimatedTracking, _Animated3);

  function AnimatedTracking(value, parent, animationClass, animationConfig, callback) {
    _classCallCheck(this, AnimatedTracking);

    _get(Object.getPrototypeOf(AnimatedTracking.prototype), 'constructor', this).call(this);
    this._value = value;
    this._parent = parent;
    this._animationClass = animationClass;
    this._animationConfig = animationConfig;
    this._callback = callback;
    this.__attach();
  }

  _createClass(AnimatedTracking, [{
    key: '__getValue',
    value: function __getValue() {
      return this._parent.__getValue();
    }
  }, {
    key: '__attach',
    value: function __attach() {
      this._parent.__addChild(this);
    }
  }, {
    key: '__detach',
    value: function __detach() {
      this._parent.__removeChild(this);
    }
  }, {
    key: 'update',
    value: function update() {
      this._value.animate(new this._animationClass(_extends({}, this._animationConfig, {
        toValue: this._animationConfig.toValue.__getValue()
      })), this._callback);
    }
  }]);

  return AnimatedTracking;
})(Animated);

var maybeVectorAnim = function maybeVectorAnim(value, config, anim) {
  if (value instanceof AnimatedValueXY) {
    var configX = _extends({}, config);
    var configY = _extends({}, config);
    for (var key in config) {
      var _config$key = config[key];
      var x = _config$key.x;
      var y = _config$key.y;

      if (x !== undefined && y !== undefined) {
        configX[key] = x;
        configY[key] = y;
      }
    }
    var aX = anim(value.x, configX);
    var aY = anim(value.y, configY);
    // We use `stopTogether: false` here because otherwise tracking will break
    // because the second animation will get stopped before it can update.
    return parallel([aX, aY], { stopTogether: false });
  }
  return null;
};

var spring = function spring(value, config) {
  return maybeVectorAnim(value, config, spring) || {
    start: function start(callback) {
      var singleValue = value;
      var singleConfig = config;
      singleValue.stopTracking();
      if (config.toValue instanceof Animated) {
        singleValue.track(new AnimatedTracking(singleValue, config.toValue, SpringAnimation, singleConfig, callback));
      } else {
        singleValue.animate(new SpringAnimation(singleConfig), callback);
      }
    },

    stop: function stop() {
      value.stopAnimation();
    }
  };
};

var timing = function timing(value, config) {
  return maybeVectorAnim(value, config, timing) || {
    start: function start(callback) {
      var singleValue = value;
      var singleConfig = config;
      singleValue.stopTracking();
      if (config.toValue instanceof Animated) {
        singleValue.track(new AnimatedTracking(singleValue, config.toValue, TimingAnimation, singleConfig, callback));
      } else {
        singleValue.animate(new TimingAnimation(singleConfig), callback);
      }
    },

    stop: function stop() {
      value.stopAnimation();
    }
  };
};

var decay = function decay(value, config) {
  return maybeVectorAnim(value, config, decay) || {
    start: function start(callback) {
      var singleValue = value;
      var singleConfig = config;
      singleValue.stopTracking();
      singleValue.animate(new DecayAnimation(singleConfig), callback);
    },

    stop: function stop() {
      value.stopAnimation();
    }
  };
};

var sequence = function sequence(animations) {
  var current = 0;
  return {
    start: function start(callback) {
      var onComplete = function onComplete(result) {
        if (!result.finished) {
          callback && callback(result);
          return;
        }

        current++;

        if (current === animations.length) {
          callback && callback(result);
          return;
        }

        animations[current].start(onComplete);
      };

      if (animations.length === 0) {
        callback && callback({ finished: true });
      } else {
        animations[current].start(onComplete);
      }
    },

    stop: function stop() {
      if (current < animations.length) {
        animations[current].stop();
      }
    }
  };
};

// If one is stopped, stop all.  default: true

var parallel = function parallel(animations, config) {
  var doneCount = 0;
  // Make sure we only call stop() at most once for each animation
  var hasEnded = {};
  var stopTogether = !(config && config.stopTogether === false);

  var result = {
    start: function start(callback) {
      if (doneCount === animations.length) {
        callback && callback({ finished: true });
        return;
      }

      animations.forEach(function (animation, idx) {
        var cb = function cb(endResult) {
          hasEnded[idx] = true;
          doneCount++;
          if (doneCount === animations.length) {
            doneCount = 0;
            callback && callback(endResult);
            return;
          }

          if (!endResult.finished && stopTogether) {
            result.stop();
          }
        };

        if (!animation) {
          cb({ finished: true });
        } else {
          animation.start(cb);
        }
      });
    },

    stop: function stop() {
      animations.forEach(function (animation, idx) {
        !hasEnded[idx] && animation.stop();
        hasEnded[idx] = true;
      });
    }
  };

  return result;
};

var delay = function delay(time) {
  // Would be nice to make a specialized implementation
  return timing(new AnimatedValue(0), { toValue: 0, delay: time, duration: 0 });
};

var stagger = function stagger(time, animations) {
  return parallel(animations.map(function (animation, i) {
    return sequence([delay(time * i), animation]);
  }));
};

var event = function event(argMapping, config) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var traverse = function traverse(recMapping, recEvt, key) {
      if (typeof recEvt === 'number') {
        (0, _fbjsLibInvariant2['default'])(recMapping instanceof AnimatedValue, 'Bad mapping of type ' + typeof recMapping + ' for key ' + key + ', event value must map to AnimatedValue');
        recMapping.setValue(recEvt);
        return;
      }
      (0, _fbjsLibInvariant2['default'])(typeof recMapping === 'object', 'Bad mapping of type ' + typeof recMapping + ' for key ' + key);
      (0, _fbjsLibInvariant2['default'])(typeof recEvt === 'object', 'Bad event of type ' + typeof recEvt + ' for key ' + key);
      for (var key in recMapping) {
        traverse(recMapping[key], recEvt[key], key);
      }
    };
    argMapping.forEach(function (mapping, idx) {
      traverse(mapping, args[idx], 'arg' + idx);
    });
    if (config && config.listener) {
      config.listener.apply(null, args);
    }
  };
};

/**
 * Animations are an important part of modern UX, and the `Animated`
 * library is designed to make them fluid, powerful, and easy to build and
 * maintain.
 *
 * The simplest workflow is to create an `Animated.Value`, hook it up to one or
 * more style attributes of an animated component, and then drive updates either
 * via animations, such as `Animated.timing`, or by hooking into gestures like
 * panning or scolling via `Animated.event`.  `Animated.Value` can also bind to
 * props other than style, and can be interpolated as well.  Here is a basic
 * example of a container view that will fade in when it's mounted:
 *
 *```javascript
 *  class FadeInView extends React.Component {
 *    constructor(props) {
 *      super(props);
 *      this.state = {
 *        fadeAnim: new Animated.Value(0), // init opacity 0
 *      };
 *    }
 *    componentDidMount() {
 *      Animated.timing(          // Uses easing functions
 *        this.state.fadeAnim,    // The value to drive
 *        {toValue: 1},           // Configuration
 *      ).start();                // Don't forget start!
 *    }
 *    render() {
 *      return (
 *        <Animated.View          // Special animatable View
 *          style={{opacity: this.state.fadeAnim}}> // Binds
 *          {this.props.children}
 *        </Animated.View>
 *      );
 *    }
 *  }
 *```
 *
 * Note that only animatable components can be animated.  `View`, `Text`, and
 * `Image` are already provided, and you can create custom ones with
 * `createAnimatedComponent`.  These special components do the magic of binding
 * the animated values to the properties, and do targetted native updates to
 * avoid the cost of the react render and reconciliation process on every frame.
 * They also handle cleanup on unmount so they are safe by default.
 *
 * Animations are heavily configurable.  Custom and pre-defined easing
 * functions, delays, durations, decay factors, spring constants, and more can
 * all be tweaked depending on the type of animation.
 *
 * A single `Animated.Value` can drive any number of properties, and each
 * property can be run through an interpolation first.  An interpolation maps
 * input ranges to output ranges, typically using a linear interpolation but
 * also supports easing functions.  By default, it will extrapolate the curve
 * beyond the ranges given, but you can also have it clamp the output value.
 *
 * For example, you may want to think about your `Animated.Value` as going from
 * 0 to 1, but animate the position from 150px to 0px and the opacity from 0 to
 * 1. This can easily be done by modifying `style` in the example above like so:
 *
 *```javascript
 *  style={{
 *    opacity: this.state.fadeAnim, // Binds directly
 *    transform: [{
 *      translateY: this.state.fadeAnim.interpolate({
 *        inputRange: [0, 1],
 *        outputRange: [150, 0]  // 0 : 150, 0.5 : 75, 1 : 0
 *      }),
 *    }],
 *  }}>
 *```
 *
 * Animations can also be combined in complex ways using composition functions
 * such as `sequence` and `parallel`, and can also be chained together simply
 * by setting the `toValue` of one animation to be another `Animated.Value`.
 *
 * `Animated.ValueXY` is handy for 2D animations, like panning, and there are
 * other helpful additions like `setOffset` and `getLayout` to aid with typical
 * interaction patterns, like drag-and-drop.
 *
 * You can see more example usage in `AnimationExample.js`, the Gratuitous
 * Animation App, and [Animations documentation guide](http://facebook.github.io/react-native/docs/animations.html).
 *
 * Note that `Animated` is designed to be fully serializable so that animations
 * can be run in a high performace way, independent of the normal JavaScript
 * event loop. This does influence the API, so keep that in mind when it seems a
 * little trickier to do something compared to a fully synchronous system.
 * Checkout `Animated.Value.addListener` as a way to work around some of these
 * limitations, but use it sparingly since it might have performance
 * implications in the future.
 */
module.exports = {
  /**
   * Standard value class for driving animations.  Typically initialized with
   * `new Animated.Value(0);`
   */
  Value: AnimatedValue,
  /**
   * 2D value class for driving 2D animations, such as pan gestures.
   */
  ValueXY: AnimatedValueXY,

  /**
   * Animates a value from an initial velocity to zero based on a decay
   * coefficient.
   */
  decay: decay,
  /**
   * Animates a value along a timed easing curve.  The `Easing` module has tons
   * of pre-defined curves, or you can use your own function.
   */
  timing: timing,
  /**
   * Spring animation based on Rebound and Origami.  Tracks velocity state to
   * create fluid motions as the `toValue` updates, and can be chained together.
   */
  spring: spring,

  /**
   * Starts an animation after the given delay.
   */
  delay: delay,
  /**
   * Starts an array of animations in order, waiting for each to complete
   * before starting the next.  If the current running animation is stopped, no
   * following animations will be started.
   */
  sequence: sequence,
  /**
   * Starts an array of animations all at the same time.  By default, if one
   * of the animations is stopped, they will all be stopped.  You can override
   * this with the `stopTogether` flag.
   */
  parallel: parallel,
  /**
   * Array of animations may run in parallel (overlap), but are started in
   * sequence with successive delays.  Nice for doing trailing effects.
   */
  stagger: stagger,

  /**
   *  Takes an array of mappings and extracts values from each arg accordingly,
   *  then calls `setValue` on the mapped outputs.  e.g.
   *
   *```javascript
   *  onScroll={this.AnimatedEvent(
   *    [{nativeEvent: {contentOffset: {x: this._scrollX}}}]
   *    {listener},          // Optional async listener
   *  )
   *  ...
   *  onPanResponderMove: this.AnimatedEvent([
   *    null,                // raw event arg ignored
   *    {dx: this._panX},    // gestureState arg
   *  ]),
   *```
   */
  event: event,

  /**
   * Make any React component Animatable.  Used to create `Animated.View`, etc.
   */
  createAnimatedComponent: createAnimatedComponent,

  __PropsOnlyForTests: AnimatedProps
};