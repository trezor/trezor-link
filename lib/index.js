'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _v = require('./bridge/v1');

var _v2 = _interopRequireDefault(_v);

var _v3 = require('./bridge/v2');

var _v4 = _interopRequireDefault(_v3);

var _withSharedConnections = require('./lowlevel/withSharedConnections');

var _withSharedConnections2 = _interopRequireDefault(_withSharedConnections);

var _extension = require('./extension');

var _extension2 = _interopRequireDefault(_extension);

var _parallel = require('./parallel');

var _parallel2 = _interopRequireDefault(_parallel);

var _fallback = require('./fallback');

var _fallback2 = _interopRequireDefault(_fallback);

var _webusb = require('./lowlevel/webusb');

var _webusb2 = _interopRequireDefault(_webusb);

require('whatwg-fetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof window === 'undefined') {
  // eslint-disable-next-line quotes
  var _fetch = require('node-fetch');
  _v2.default.setFetch(_fetch);
  _v4.default.setFetch(_fetch);
} else {
  _v2.default.setFetch(fetch);
  _v4.default.setFetch(fetch);
}

// export is empty, you can import by "trezor-link/parallel", "trezor-link/lowlevel", "trezor-link/bridge"

exports.default = {
  BridgeV1: _v2.default,
  BridgeV2: _v4.default,
  Extension: _extension2.default,
  Parallel: _parallel2.default,
  Fallback: _fallback2.default,
  Lowlevel: _withSharedConnections2.default,
  WebUsb: _webusb2.default
};
module.exports = exports['default'];