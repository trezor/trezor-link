'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _messages = require('./messages');

var messages = _interopRequireWildcard(_messages);

var _highlevelChecks = require('../highlevel-checks');

var check = _interopRequireWildcard(_highlevelChecks);

var _debugDecorator = require('../debug-decorator');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

var EXTENSION_ID = 'jcjjhjgimijdkoamemaghajlhegmoclj';

function maybeParseInt(input) {
  if (input == null) {
    return null;
  }
  if (isNaN(input)) {
    return input;
  } else {
    var parsed = parseInt(input);
    if (isNaN(parsed)) {
      return input;
    }
    return parsed;
  }
}

var ChromeExtensionTransport = (_class = function () {
  function ChromeExtensionTransport(id) {
    _classCallCheck(this, ChromeExtensionTransport);

    this.name = 'ChromeExtensionTransport';
    this.version = '';
    this.configured = false;
    this.showUdevError = false;
    this.debug = false;
    this.requestNeeded = false;

    this.id = id == null ? EXTENSION_ID : id;
  }

  _createClass(ChromeExtensionTransport, [{
    key: '_send',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(message) {
        var res, udev;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return messages.send(this.id, message);

              case 2:
                res = _context.sent;
                _context.next = 5;
                return messages.send(this.id, { type: 'udevStatus' });

              case 5:
                udev = _context.sent;

                this.showUdevError = udev === 'display';
                return _context.abrupt('return', res);

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _send(_x) {
        return _ref.apply(this, arguments);
      }

      return _send;
    }()
  }, {
    key: 'ping',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this._send({ type: 'ping' });

              case 2:
                res = _context2.sent;

                if (!(res !== 'pong')) {
                  _context2.next = 5;
                  break;
                }

                throw new Error('Response to "ping" should be "pong".');

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function ping() {
        return _ref2.apply(this, arguments);
      }

      return ping;
    }()
  }, {
    key: 'info',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var infoS;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._send({ type: 'info' });

              case 2:
                infoS = _context3.sent;
                return _context3.abrupt('return', check.info(infoS));

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function info() {
        return _ref3.apply(this, arguments);
      }

      return info;
    }()
  }, {
    key: 'init',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(debug) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.debug = !!debug;
                _context4.next = 3;
                return this._silentInit();

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function init(_x2) {
        return _ref4.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: '_silentInit',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var info;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return messages.exists();

              case 2:
                _context5.next = 4;
                return this.ping();

              case 4:
                _context5.next = 6;
                return this.info();

              case 6:
                info = _context5.sent;

                this.version = info.version;
                this.configured = info.configured;

              case 9:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function _silentInit() {
        return _ref5.apply(this, arguments);
      }

      return _silentInit;
    }()
  }, {
    key: 'configure',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(config) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this._send({
                  type: 'configure',
                  body: config
                });

              case 2:
                _context6.next = 4;
                return this._silentInit();

              case 4:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function configure(_x3) {
        return _ref6.apply(this, arguments);
      }

      return configure;
    }()
  }, {
    key: 'listen',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(old) {
        var devicesS, devices;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this._send({
                  type: 'listen',
                  body: old == null ? null : old.map(function (device) {
                    // hack for old extension
                    var session = maybeParseInt(device.session);
                    var path = maybeParseInt(device.path);
                    var res = {
                      path: path,
                      // hack for old extension
                      product: 1,
                      vendor: 21324,
                      serialNumber: 0
                    };
                    // hack for old extension
                    if (session != null) {
                      res = _extends({ session: session }, res);
                    }
                    return res;
                  })
                });

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

      function listen(_x4) {
        return _ref7.apply(this, arguments);
      }

      return listen;
    }()
  }, {
    key: 'enumerate',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var devicesS, devices;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this._send({ type: 'enumerate' });

              case 2:
                devicesS = _context8.sent;
                devices = check.devices(devicesS);
                return _context8.abrupt('return', devices);

              case 5:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function enumerate() {
        return _ref8.apply(this, arguments);
      }

      return enumerate;
    }()
  }, {
    key: '_acquireMixed',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(input) {
        var checkPrevious;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                checkPrevious = input.checkPrevious;

                if (!checkPrevious) {
                  _context9.next = 5;
                  break;
                }

                return _context9.abrupt('return', this._send({
                  type: 'acquire',
                  body: {
                    path: maybeParseInt(input.path),
                    previous: maybeParseInt(input.previous)
                  }
                }));

              case 5:
                return _context9.abrupt('return', this._send({
                  type: 'acquire',
                  body: maybeParseInt(input.path)
                }));

              case 6:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function _acquireMixed(_x5) {
        return _ref9.apply(this, arguments);
      }

      return _acquireMixed;
    }()
  }, {
    key: 'acquire',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(input) {
        var acquireS;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this._acquireMixed(input);

              case 2:
                acquireS = _context10.sent;
                return _context10.abrupt('return', check.acquire(acquireS));

              case 4:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function acquire(_x6) {
        return _ref10.apply(this, arguments);
      }

      return acquire;
    }()
  }, {
    key: 'release',
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(session) {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this._send({
                  type: 'release',
                  body: maybeParseInt(session)
                });

              case 2:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function release(_x7) {
        return _ref11.apply(this, arguments);
      }

      return release;
    }()
  }, {
    key: 'call',
    value: function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(session, name, data) {
        var res;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return this._send({
                  type: 'call',
                  body: {
                    id: maybeParseInt(session),
                    type: name,
                    message: data
                  }
                });

              case 2:
                res = _context12.sent;
                return _context12.abrupt('return', check.call(res));

              case 4:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function call(_x8, _x9, _x10) {
        return _ref12.apply(this, arguments);
      }

      return call;
    }()
  }, {
    key: 'requestDevice',
    value: function requestDevice() {
      return Promise.reject();
    }
  }]);

  return ChromeExtensionTransport;
}(), (_applyDecoratedDescriptor(_class.prototype, 'init', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'init'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'configure', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'configure'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'listen', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'listen'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'enumerate', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'enumerate'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'acquire', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'acquire'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'release', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'release'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'call', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'call'), _class.prototype)), _class);
exports.default = ChromeExtensionTransport;
module.exports = exports['default'];