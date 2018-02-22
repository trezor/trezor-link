'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _debugDecorator = require('../debug-decorator');

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

var TREZOR_DESCS = [
// TREZOR v1
{ vendorId: 0x534c, productId: 0x0001 },
// TREZOR v2 Bootloader
{ vendorId: 0x1209, productId: 0x53c0 },
// TREZOR v2 Firmware
{ vendorId: 0x1209, productId: 0x53c1 }];

var CONFIGURATION_ID = 1;
var INTERFACE_ID = 0;
var ENDPOINT_ID = 1;

var WebUsbPlugin = (_class = function () {
  function WebUsbPlugin() {
    _classCallCheck(this, WebUsbPlugin);

    this.name = 'WebUsbPlugin';
    this.version = "1.0.8";
    this.debug = false;
    this.allowsWriteAndEnumerate = true;
    this.configurationId = CONFIGURATION_ID;
    this.interfaceId = INTERFACE_ID;
    this.endpointId = ENDPOINT_ID;
    this._lastDevices = [];
    this.requestNeeded = true;
  }

  _createClass(WebUsbPlugin, [{
    key: 'init',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(debug) {
        var usb;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.debug = !!debug;
                // $FlowIssue
                usb = navigator.usb;

                if (!(usb == null)) {
                  _context.next = 6;
                  break;
                }

                throw new Error('WebUSB is not available on this browser.');

              case 6:
                this.usb = usb;

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init(_x) {
        return _ref.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: '_listDevices',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var bootloaderId, devices;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                bootloaderId = 0;
                _context2.next = 3;
                return this.usb.getDevices();

              case 3:
                devices = _context2.sent;

                this._lastDevices = devices.filter(function (dev) {
                  var isTrezor = TREZOR_DESCS.some(function (desc) {
                    return dev.vendorId === desc.vendorId && dev.productId === desc.productId;
                  });
                  return isTrezor;
                }).map(function (device) {
                  // path is just serial number
                  // more bootloaders => number them, hope for the best
                  var serialNumber = device.serialNumber;
                  var path = serialNumber == null || serialNumber === '' ? 'bootloader' : serialNumber;
                  if (path === 'bootloader') {
                    bootloaderId++;
                    path = path + bootloaderId;
                  }
                  return { path: path, device: device };
                });
                return _context2.abrupt('return', this._lastDevices);

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _listDevices() {
        return _ref2.apply(this, arguments);
      }

      return _listDevices;
    }()
  }, {
    key: 'enumerate',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._listDevices();

              case 2:
                _context3.t0 = function (info) {
                  return { path: info.path };
                };

                return _context3.abrupt('return', _context3.sent.map(_context3.t0));

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function enumerate() {
        return _ref3.apply(this, arguments);
      }

      return enumerate;
    }()
  }, {
    key: '_findDevice',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(path) {
        var deviceO;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                deviceO = this._lastDevices.find(function (d) {
                  return d.path === path;
                });

                if (!(deviceO == null)) {
                  _context4.next = 3;
                  break;
                }

                throw new Error('Action was interrupted.');

              case 3:
                return _context4.abrupt('return', deviceO.device);

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function _findDevice(_x2) {
        return _ref4.apply(this, arguments);
      }

      return _findDevice;
    }()
  }, {
    key: 'send',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(path, data) {
        var device, newArray;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this._findDevice(path);

              case 2:
                device = _context5.sent;
                newArray = new Uint8Array(64);

                newArray[0] = 63;
                newArray.set(new Uint8Array(data), 1);

                if (device.opened) {
                  _context5.next = 9;
                  break;
                }

                _context5.next = 9;
                return this.connect(path);

              case 9:
                return _context5.abrupt('return', device.transferOut(this.endpointId, newArray).then(function () {}));

              case 10:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function send(_x3, _x4) {
        return _ref5.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: 'receive',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(path) {
        var device, res;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this._findDevice(path);

              case 2:
                device = _context6.sent;
                _context6.prev = 3;

                if (device.opened) {
                  _context6.next = 7;
                  break;
                }

                _context6.next = 7;
                return this.connect(path);

              case 7:
                _context6.next = 9;
                return device.transferIn(this.endpointId, 64);

              case 9:
                res = _context6.sent;
                return _context6.abrupt('return', res.data.buffer.slice(1));

              case 13:
                _context6.prev = 13;
                _context6.t0 = _context6['catch'](3);

                if (!(_context6.t0.message === 'Device unavailable.')) {
                  _context6.next = 19;
                  break;
                }

                throw new Error('Action was interrupted.');

              case 19:
                throw _context6.t0;

              case 20:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[3, 13]]);
      }));

      function receive(_x5) {
        return _ref6.apply(this, arguments);
      }

      return receive;
    }()
  }, {
    key: 'connect',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(path) {
        var _this = this;

        var _loop, i, _ret;

        return regeneratorRuntime.wrap(function _callee7$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(i) {
                  return regeneratorRuntime.wrap(function _loop$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          if (!(i > 0)) {
                            _context7.next = 3;
                            break;
                          }

                          _context7.next = 3;
                          return new Promise(function (resolve) {
                            return setTimeout(function () {
                              return resolve();
                            }, i * 200);
                          });

                        case 3:
                          _context7.prev = 3;
                          _context7.next = 6;
                          return _this._connectIn(path);

                        case 6:
                          _context7.t0 = _context7.sent;
                          return _context7.abrupt('return', {
                            v: _context7.t0
                          });

                        case 10:
                          _context7.prev = 10;
                          _context7.t1 = _context7['catch'](3);

                          if (!(i === 4)) {
                            _context7.next = 14;
                            break;
                          }

                          throw _context7.t1;

                        case 14:
                        case 'end':
                          return _context7.stop();
                      }
                    }
                  }, _loop, _this, [[3, 10]]);
                });
                i = 0;

              case 2:
                if (!(i < 5)) {
                  _context8.next = 10;
                  break;
                }

                return _context8.delegateYield(_loop(i), 't0', 4);

              case 4:
                _ret = _context8.t0;

                if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
                  _context8.next = 7;
                  break;
                }

                return _context8.abrupt('return', _ret.v);

              case 7:
                i++;
                _context8.next = 2;
                break;

              case 10:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee7, this);
      }));

      function connect(_x6) {
        return _ref7.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: '_connectIn',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(path) {
        var device;
        return regeneratorRuntime.wrap(function _callee8$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this._findDevice(path);

              case 2:
                device = _context9.sent;
                _context9.next = 5;
                return device.open();

              case 5:
                _context9.next = 7;
                return device.selectConfiguration(this.configurationId);

              case 7:
                _context9.next = 9;
                return device.reset();

              case 9:
                _context9.next = 11;
                return device.claimInterface(this.interfaceId);

              case 11:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee8, this);
      }));

      function _connectIn(_x7) {
        return _ref8.apply(this, arguments);
      }

      return _connectIn;
    }()
  }, {
    key: 'disconnect',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(path) {
        var device;
        return regeneratorRuntime.wrap(function _callee9$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this._findDevice(path);

              case 2:
                device = _context10.sent;
                _context10.next = 5;
                return device.releaseInterface(this.interfaceId);

              case 5:
                _context10.next = 7;
                return device.close();

              case 7:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee9, this);
      }));

      function disconnect(_x8) {
        return _ref9.apply(this, arguments);
      }

      return disconnect;
    }()
  }, {
    key: 'requestDevice',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        return regeneratorRuntime.wrap(function _callee10$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.usb.requestDevice({ filters: TREZOR_DESCS });

              case 2:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee10, this);
      }));

      function requestDevice() {
        return _ref10.apply(this, arguments);
      }

      return requestDevice;
    }()
  }]);

  return WebUsbPlugin;
}(), (_applyDecoratedDescriptor(_class.prototype, 'init', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'init'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'connect', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'connect'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'disconnect', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'disconnect'), _class.prototype)), _class);
exports.default = WebUsbPlugin;
module.exports = exports['default'];