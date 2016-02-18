/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule NavigationRouteStack
 * 
 */
'use strict';
/* eslint new-cap: 0*/

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _immutable = require('immutable');

var _fbjsLibInvariant = require('fbjs/lib/invariant');

var _fbjsLibInvariant2 = _interopRequireDefault(_fbjsLibInvariant);

function isRouteEmpty(route) {
  return route === undefined || route === null || route === '' || false;
}

var _nextID = 0;

var RouteNode = function RouteNode(route) {
  _classCallCheck(this, RouteNode);

  // Key value gets bigger incrementally. Developer can compare the
  // keys of two routes then know which route is added to the stack
  // earlier.
  this.key = String(_nextID++);

  this.value = route;
};

var StackDiffRecord = (0, _immutable.Record)({
  key: null,
  route: null,
  index: null
});

/**
 * The immutable route stack.
 */

var RouteStack = (function () {
  function RouteStack(index, routeNodes) {
    _classCallCheck(this, RouteStack);

    (0, _fbjsLibInvariant2['default'])(routeNodes.size > 0, 'size must not be empty');

    (0, _fbjsLibInvariant2['default'])(index > -1 && index <= routeNodes.size - 1, 'index out of bound');

    this._routeNodes = routeNodes;
    this._index = index;
  }

  /**
   * The first class data structure for NavigationContext to manage the navigation
   * stack of routes.
   */

  /* $FlowFixMe - get/set properties not yet supported */

  _createClass(RouteStack, [{
    key: 'toArray',
    value: function toArray() {
      var result = [];
      var ii = 0;
      var nodes = this._routeNodes;
      while (ii < nodes.size) {
        result.push(nodes.get(ii).value);
        ii++;
      }
      return result;
    }
  }, {
    key: 'get',
    value: function get(index) {
      if (index < 0 || index > this._routeNodes.size - 1) {
        return null;
      }
      return this._routeNodes.get(index).value;
    }

    /**
     * Returns the key associated with the route.
     * When a route is added to a stack, the stack creates a key for this route.
     * The key will persist until the initial stack and its derived stack
     * no longer contains this route.
     */
  }, {
    key: 'keyOf',
    value: function keyOf(route) {
      if (isRouteEmpty(route)) {
        return null;
      }
      var index = this.indexOf(route);
      return index > -1 ? this._routeNodes.get(index).key : null;
    }
  }, {
    key: 'indexOf',
    value: function indexOf(route) {
      if (isRouteEmpty(route)) {
        return -1;
      }

      var finder = function finder(node) {
        return node.value === route;
      };

      return this._routeNodes.findIndex(finder, this);
    }
  }, {
    key: 'slice',
    value: function slice(begin, end) {
      var routeNodes = this._routeNodes.slice(begin, end);
      var index = Math.min(this._index, routeNodes.size - 1);
      return this._update(index, routeNodes);
    }

    /**
     * Returns a new stack with the provided route appended,
     * starting at this stack size.
     */
  }, {
    key: 'push',
    value: function push(route) {
      var _this = this;

      (0, _fbjsLibInvariant2['default'])(!isRouteEmpty(route), 'Must supply route to push');

      (0, _fbjsLibInvariant2['default'])(this._routeNodes.indexOf(route) === -1, 'route must be unique');

      // When pushing, removes the rest of the routes past the current index.
      var routeNodes = this._routeNodes.withMutations(function (list) {
        list.slice(0, _this._index + 1).push(new RouteNode(route));
      });

      return this._update(routeNodes.size - 1, routeNodes);
    }

    /**
     * Returns a new stack a size ones less than this stack,
     * excluding the last index in this stack.
     */
  }, {
    key: 'pop',
    value: function pop() {
      (0, _fbjsLibInvariant2['default'])(this._routeNodes.size > 1, 'shoud not pop routeNodes stack to empty');

      // When popping, removes the rest of the routes past the current index.
      var routeNodes = this._routeNodes.slice(0, this._index);
      return this._update(routeNodes.size - 1, routeNodes);
    }
  }, {
    key: 'jumpToIndex',
    value: function jumpToIndex(index) {
      (0, _fbjsLibInvariant2['default'])(index > -1 && index < this._routeNodes.size, 'index out of bound');

      return this._update(index, this._routeNodes);
    }

    /**
     * Replace a route in the navigation stack.
     *
     * `index` specifies the route in the stack that should be replaced.
     * If it's negative, it counts from the back.
     */
  }, {
    key: 'replaceAtIndex',
    value: function replaceAtIndex(index, route) {
      (0, _fbjsLibInvariant2['default'])(!isRouteEmpty(route), 'Must supply route to replace');

      if (this.get(index) === route) {
        return this;
      }

      (0, _fbjsLibInvariant2['default'])(this.indexOf(route) === -1, 'route must be unique');

      if (index < 0) {
        index += this._routeNodes.size;
      }

      (0, _fbjsLibInvariant2['default'])(index > -1 && index < this._routeNodes.size, 'index out of bound');

      var routeNodes = this._routeNodes.set(index, new RouteNode(route));
      return this._update(index, routeNodes);
    }

    // Iterations
  }, {
    key: 'forEach',
    value: function forEach(callback, context) {
      var ii = 0;
      var nodes = this._routeNodes;
      while (ii < nodes.size) {
        var node = nodes.get(ii);
        callback.call(context, node.value, ii, node.key);
        ii++;
      }
    }
  }, {
    key: 'mapToArray',
    value: function mapToArray(callback, context) {
      var result = [];
      this.forEach(function (route, index, key) {
        result.push(callback.call(context, route, index, key));
      });
      return result;
    }

    /**
     * Returns a Set excluding any routes contained within the stack given.
     */
  }, {
    key: 'subtract',
    value: function subtract(stack) {
      var items = [];
      this._routeNodes.forEach(function (node, index) {
        if (!stack._routeNodes.contains(node)) {
          items.push(new StackDiffRecord({
            route: node.value,
            index: index,
            key: node.key
          }));
        }
      });
      return new _immutable.Set(items);
    }
  }, {
    key: '_update',
    value: function _update(index, routeNodes) {
      if (this._index === index && this._routeNodes === routeNodes) {
        return this;
      }
      return new RouteStack(index, routeNodes);
    }
  }, {
    key: 'size',
    get: function get() {
      return this._routeNodes.size;
    }

    /* $FlowFixMe - get/set properties not yet supported */
  }, {
    key: 'index',
    get: function get() {
      return this._index;
    }
  }]);

  return RouteStack;
})();

var NavigationRouteStack = (function (_RouteStack) {
  _inherits(NavigationRouteStack, _RouteStack);

  function NavigationRouteStack(index, routeNodes) {
    _classCallCheck(this, NavigationRouteStack);

    // For now, `RouteStack` internally,  uses an immutable `List` to keep
    // track of routeNodes. Since using `List` is really just the implementation
    // detail, we don't want to accept `routeNodes` as `list` from constructor
    // for developer.
    var nodes = routeNodes.map(function (route) {
      (0, _fbjsLibInvariant2['default'])(!isRouteEmpty(route), 'route must not be mepty');
      return new RouteNode(route);
    });

    _get(Object.getPrototypeOf(NavigationRouteStack.prototype), 'constructor', this).call(this, index, new _immutable.List(nodes));
  }

  return NavigationRouteStack;
})(RouteStack);

module.exports = NavigationRouteStack;