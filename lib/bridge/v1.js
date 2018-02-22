'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _semverCompare = require('semver-compare');

var _semverCompare2 = _interopRequireDefault(_semverCompare);

var _http = require('./http');

var _highlevelChecks = require('../highlevel-checks');

var check = _interopRequireWildcard(_highlevelChecks);

var _debugDecorator = require('../debug-decorator');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var DEFAULT_URL = 'https://localback.net:21324';
var DEFAULT_VERSION_URL = 'https://wallet.trezor.io/data/bridge/latest.txt';

var BridgeTransport = (_class = function () {
  function BridgeTransport(url, newestVersionUrl) {
    _classCallCheck(this, BridgeTransport);

    this.name = 'BridgeTransport';
    this.version = '';
    this.configured = false;
    this.debug = false;
    this.requestNeeded = false;

    this.url = url == null ? DEFAULT_URL : url;
    this.newestVersionUrl = newestVersionUrl == null ? DEFAULT_VERSION_URL : newestVersionUrl;
  }

  _createClass(BridgeTransport, [{
    key: '_post',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _http.request)(_extends({}, options, { method: 'POST', url: this.url + options.url }));

              case 2:
                return _context.abrupt('return', _context.sent);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _post(_x) {
        return _ref.apply(this, arguments);
      }

      return _post;
    }()
  }, {
    key: '_get',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(options) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _http.request)(_extends({}, options, { method: 'GET', url: this.url + options.url }));

              case 2:
                return _context2.abrupt('return', _context2.sent);

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _get(_x2) {
        return _ref2.apply(this, arguments);
      }

      return _get;
    }()
  }, {
    key: 'init',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(debug) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.debug = !!debug;
                _context3.next = 3;
                return this._silentInit();

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function init(_x3) {
        return _ref3.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: '_silentInit',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var infoS, info, newVersion;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _http.request)({
                  url: this.url,
                  method: 'GET'
                });

              case 2:
                infoS = _context4.sent;
                info = check.info(infoS);

                this.version = info.version;
                this.configured = info.configured;
                _context4.t0 = check;
                _context4.next = 9;
                return (0, _http.request)({
                  url: this.newestVersionUrl + '?' + Date.now(),
                  method: 'GET'
                });

              case 9:
                _context4.t1 = _context4.sent;
                newVersion = _context4.t0.version.call(_context4.t0, _context4.t1);

                this.isOutdated = (0, _semverCompare2.default)(this.version, newVersion) < 0;

              case 12:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function _silentInit() {
        return _ref4.apply(this, arguments);
      }

      return _silentInit;
    }()
  }, {
    key: 'configure',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(config) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this._post({
                  url: '/configure',
                  body: config
                });

              case 2:
                _context5.next = 4;
                return this._silentInit();

              case 4:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function configure(_x4) {
        return _ref5.apply(this, arguments);
      }

      return configure;
    }()
  }, {
    key: 'listen',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(old) {
        var devicesS, devices;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return old == null ? this._get({ url: '/listen' }) : this._post({
                  url: '/listen',
                  body: old.map(function (device) {
                    return _extends({}, device, {
                      // hack for old trezord
                      product: 1,
                      vendor: 21324
                    });
                  })
                });

              case 2:
                devicesS = _context6.sent;
                devices = check.devices(devicesS);
                return _context6.abrupt('return', devices);

              case 5:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function listen(_x5) {
        return _ref6.apply(this, arguments);
      }

      return listen;
    }()
  }, {
    key: 'enumerate',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var devicesS, devices;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this._get({ url: '/enumerate' });

              case 2:
                devicesS = _context7.sent;
                devices = check.devices(devicesS);
                return _context7.abrupt('return', devices);

              case 5:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function enumerate() {
        return _ref7.apply(this, arguments);
      }

      return enumerate;
    }()
  }, {
    key: '_acquireMixed',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(input) {
        var checkPrevious, previousStr, _url;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                checkPrevious = input.checkPrevious && (0, _semverCompare2.default)(this.version, '1.1.3') >= 0;

                if (!checkPrevious) {
                  _context8.next = 7;
                  break;
                }

                previousStr = input.previous == null ? 'null' : input.previous;
                _url = '/acquire/' + input.path + '/' + previousStr;
                return _context8.abrupt('return', this._post({ url: _url }));

              case 7:
                return _context8.abrupt('return', this._post({ url: '/acquire/' + input.path }));

              case 8:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function _acquireMixed(_x6) {
        return _ref8.apply(this, arguments);
      }

      return _acquireMixed;
    }()
  }, {
    key: 'acquire',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(input) {
        var acquireS;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this._acquireMixed(input);

              case 2:
                acquireS = _context9.sent;
                return _context9.abrupt('return', check.acquire(acquireS));

              case 4:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function acquire(_x7) {
        return _ref9.apply(this, arguments);
      }

      return acquire;
    }()
  }, {
    key: 'release',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(session) {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this._post({ url: '/release/' + session });

              case 2:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function release(_x8) {
        return _ref10.apply(this, arguments);
      }

      return release;
    }()
  }, {
    key: 'call',
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(session, name, data) {
        var res;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this._post({
                  url: '/call/' + session,
                  body: {
                    type: name,
                    message: data
                  }
                });

              case 2:
                res = _context11.sent;
                return _context11.abrupt('return', check.call(res));

              case 4:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function call(_x9, _x10, _x11) {
        return _ref11.apply(this, arguments);
      }

      return call;
    }()
  }, {
    key: 'requestDevice',
    value: function requestDevice() {
      return Promise.reject();
    }
  }], [{
    key: 'setFetch',
    value: function setFetch(fetch) {
      (0, _http.setFetch)(fetch);
    }
  }]);

  return BridgeTransport;
}(), (_applyDecoratedDescriptor(_class.prototype, 'init', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'init'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'configure', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'configure'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'listen', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'listen'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'enumerate', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'enumerate'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'acquire', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'acquire'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'release', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'release'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'call', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'call'), _class.prototype)), _class);
exports.default = BridgeTransport;
module.exports = exports['default'];