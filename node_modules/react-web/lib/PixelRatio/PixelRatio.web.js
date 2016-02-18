/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @providesModule ReactPixelRatio
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ReactDimensions = require('ReactDimensions');

/**
 * PixelRatio class gives access to the device pixel density.
 *
 * There are a few use cases for using PixelRatio:
 *
 * ### Displaying a line that's as thin as the device permits
 *
 * A width of 1 is actually pretty thick on devices with high pixel density
 * (such as iPhone 4+ and many Android devices), we can make one that's
 * thinner using a width of `1 / PixelRatio.get()`.
 * It's a technique that works on all the devices independent of their
 * pixel density.
 *
 * ```
 * style={{ borderWidth: 1 / PixelRatio.get() }}
 * ```
 *
 * ### Fetching a correctly sized image
 *
 * You should get a higher resolution image if you are on a high pixel density
 * device. A good rule of thumb is to multiply the size of the image you display
 * by the pixel ratio.
 *
 * ```
 * var image = getImage({
 *   width: PixelRatio.getPixelSizeForLayoutSize(200),
 *   height: PixelRatio.getPixelSizeForLayoutSize(100),
 * });
 * <Image source={image} style={{width: 200, height: 100}} />
 * ```
 */

var _ReactDimensions2 = _interopRequireDefault(_ReactDimensions);

var PixelRatio = (function () {
  function PixelRatio() {
    _classCallCheck(this, PixelRatio);
  }

  _createClass(PixelRatio, null, [{
    key: 'get',

    /**
     * Returns the device pixel density. Some examples:
     *
     *   - PixelRatio.get() === 1
     *     - mdpi Android devices (160 dpi)
     *   - PixelRatio.get() === 1.5
     *     - hdpi Android devices (240 dpi)
     *   - PixelRatio.get() === 2
     *     - iPhone 4, 4S
     *     - iPhone 5, 5c, 5s
     *     - iPhone 6
     *     - xhdpi Android devices (320 dpi)
     *   - PixelRatio.get() === 3
     *     - iPhone 6 plus
     *     - xxhdpi Android devices (480 dpi)
     *   - PixelRatio.get() === 3.5
     *     - Nexus 6
     */
    value: function get() {
      return _ReactDimensions2['default'].get('window').scale;
    }

    /**
     * Returns the scaling factor for font sizes. This is the ratio that is used to calculate the
     * absolute font size, so any elements that heavily depend on that should use this to do
     * calculations.
     *
     * If a font scale is not set, this returns the device pixel ratio.
     *
     * Currently this is only implemented on Android and reflects the user preference set in
     * Settings > Display > Font size, on iOS it will always return the default pixel ratio.
     * @platform android
     */
  }, {
    key: 'getFontScale',
    value: function getFontScale() {
      return _ReactDimensions2['default'].get('window').fontScale || PixelRatio.get();
    }

    /**
     * Converts a layout size (dp) to pixel size (px).
     *
     * Guaranteed to return an integer number.
     */
  }, {
    key: 'getPixelSizeForLayoutSize',
    value: function getPixelSizeForLayoutSize(layoutSize) {
      return Math.round(layoutSize * PixelRatio.get());
    }

    // No-op for iOS, but used on the web. Should not be documented.
  }, {
    key: 'startDetecting',
    value: function startDetecting() {}
  }]);

  return PixelRatio;
})();

module.exports = PixelRatio;