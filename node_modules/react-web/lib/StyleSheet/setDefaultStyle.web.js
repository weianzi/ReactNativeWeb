/**
 * Copyright (c) 2015-present, Alibaba Group Holding Limited.
 * All rights reserved.
 *
 */
'use strict';

function appendSytle(_ref) {
  var reference = _ref.reference;
  var rootClassName = _ref.rootClassName;
  var viewClassName = _ref.viewClassName;

  var docEl = document.documentElement;
  var styleEl = document.createElement('style');
  docEl.firstElementChild.appendChild(styleEl);
  var rem = docEl.clientWidth / reference;

  var boxStyle = '\n  box-sizing: border-box;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  ';

  styleEl.innerHTML = '\n  html {\n    font-size: ' + rem + 'px!important;\n  }\n  body {\n    font-size: 14px;\n    margin: 0;\n  }\n  .' + rootClassName + ' {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    ' + boxStyle + '\n  }\n  .' + rootClassName + ' .' + viewClassName + ' {\n    position: relative;\n    ' + boxStyle + '\n  }\n  ';
}

function setDefaultStyle(options) {
  var metaEl = document.querySelector('meta[name="viewport"]');
  if (!metaEl) {
    return console.warn('Viewport meta not set');
  }

  window.addEventListener('resize', function () {
    appendSytle(options);
  }, false);

  appendSytle(options);
}

module.exports = setDefaultStyle;