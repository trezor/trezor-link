'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _monkey_patch = require('./protobuf/monkey_patch');

var _defered = require('../defered');

var _parse_protocol = require('./protobuf/parse_protocol');

var _verify = require('./verify');

var _send = require('./send');

var _receive = require('./receive');

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

(0, _monkey_patch.patch)();

// eslint-disable-next-line quotes
var stringify = require('json-stable-stringify');

function stableStringify(devices) {
  if (devices == null) {
    return 'null';
  }

  var pureDevices = devices.map(function (device) {
    var path = device.path;
    var session = device.session == null ? null : device.session;
    return { path: path, session: session };
  });

  return stringify(pureDevices);
}

function compare(a, b) {
  if (!isNaN(parseInt(a.path))) {
    return parseInt(a.path) - parseInt(b.path);
  } else {
    return a.path < b.path ? -1 : a.path > b.path ? 1 : 0;
  }
}

var ITER_MAX = 60;
var ITER_DELAY = 500;

var LowlevelTransport = (_class = function () {

  // session => path


  // session => promise rejecting on release
  function LowlevelTransport(plugin) {
    _classCallCheck(this, LowlevelTransport);

    this.name = 'LowlevelTransport';
    this._lock = Promise.resolve();
    this.debug = false;
    this.deferedOnRelease = {};
    this.connections = {};
    this.reverse = {};
    this.configured = false;
    this._lastStringified = '';
    this.requestNeeded = false;

    this.plugin = plugin;
    this.version = plugin.version;
  }

  // path => session


  _createClass(LowlevelTransport, [{
    key: 'lock',
    value: function lock(fn) {
      var res = this._lock.then(function () {
        return fn();
      });
      this._lock = res.catch(function () {});
      return res;
    }
  }, {
    key: 'enumerate',
    value: function enumerate() {
      return this._silentEnumerate();
    }
  }, {
    key: '_silentEnumerate',
    value: function _silentEnumerate() {
      var _this = this;

      return this.lock(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var devices, devicesWithSessions;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.plugin.enumerate();

              case 2:
                devices = _context.sent;
                devicesWithSessions = devices.map(function (device) {
                  var session = _this.connections[device.path];
                  return {
                    path: device.path,
                    session: session
                  };
                });

                _this._releaseDisconnected(devicesWithSessions);
                return _context.abrupt('return', devicesWithSessions.sort(compare));

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      })));
    }
  }, {
    key: '_releaseDisconnected',
    value: function _releaseDisconnected(devices) {
      var _this2 = this;

      var connected = {};
      devices.forEach(function (device) {
        connected[device.path] = true;
      });
      Object.keys(this.connections).forEach(function (path) {
        if (connected[path] == null) {
          if (_this2.connections[path] != null) {
            _this2._releaseCleanup(_this2.connections[path]);
          }
        }
      });
    }
  }, {
    key: 'listen',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(old) {
        var oldStringified, last;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                oldStringified = stableStringify(old);
                last = old == null ? this._lastStringified : oldStringified;
                return _context2.abrupt('return', this._runIter(0, last));

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function listen(_x) {
        return _ref2.apply(this, arguments);
      }

      return listen;
    }()
  }, {
    key: '_runIter',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(iteration, oldStringified) {
        var devices, stringified;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._silentEnumerate();

              case 2:
                devices = _context3.sent;
                stringified = stableStringify(devices);

                if (!(stringified !== oldStringified || iteration === ITER_MAX)) {
                  _context3.next = 7;
                  break;
                }

                this._lastStringified = stringified;
                return _context3.abrupt('return', devices);

              case 7:
                _context3.next = 9;
                return (0, _defered.resolveTimeoutPromise)(ITER_DELAY, null);

              case 9:
                return _context3.abrupt('return', this._runIter(iteration + 1, stringified));

              case 10:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _runIter(_x2, _x3) {
        return _ref3.apply(this, arguments);
      }

      return _runIter;
    }()
  }, {
    key: '_checkAndReleaseBeforeAcquire',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(input) {
        var realPrevious, error;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                realPrevious = this.connections[input.path];

                if (!input.checkPrevious) {
                  _context4.next = 6;
                  break;
                }

                error = false;

                if (realPrevious == null) {
                  error = input.previous != null;
                } else {
                  error = input.previous !== realPrevious;
                }

                if (!error) {
                  _context4.next = 6;
                  break;
                }

                throw new Error('wrong previous session');

              case 6:
                if (!(realPrevious != null)) {
                  _context4.next = 9;
                  break;
                }

                _context4.next = 9;
                return this._realRelease(input.path, realPrevious);

              case 9:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function _checkAndReleaseBeforeAcquire(_x4) {
        return _ref4.apply(this, arguments);
      }

      return _checkAndReleaseBeforeAcquire;
    }()
  }, {
    key: 'acquire',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(input) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt('return', this.lock(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                  var session;
                  return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                      switch (_context5.prev = _context5.next) {
                        case 0:
                          _context5.next = 2;
                          return _this3._checkAndReleaseBeforeAcquire(input);

                        case 2:
                          _context5.next = 4;
                          return _this3.plugin.connect(input.path);

                        case 4:
                          session = _context5.sent;

                          _this3.connections[input.path] = session;
                          _this3.reverse[session] = input.path;
                          _this3.deferedOnRelease[session] = (0, _defered.create)();
                          return _context5.abrupt('return', session);

                        case 9:
                        case 'end':
                          return _context5.stop();
                      }
                    }
                  }, _callee5, _this3);
                }))));

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function acquire(_x5) {
        return _ref5.apply(this, arguments);
      }

      return acquire;
    }()
  }, {
    key: 'release',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(session) {
        var _this4 = this;

        var path;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                path = this.reverse[session];

                if (!(path == null)) {
                  _context7.next = 3;
                  break;
                }

                throw new Error('Trying to double release.');

              case 3:
                return _context7.abrupt('return', this.lock(function () {
                  return _this4._realRelease(path, session);
                }));

              case 4:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function release(_x6) {
        return _ref7.apply(this, arguments);
      }

      return release;
    }()
  }, {
    key: '_realRelease',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(path, session) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.plugin.disconnect(path, session);

              case 2:
                this._releaseCleanup(session);

              case 3:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function _realRelease(_x7, _x8) {
        return _ref8.apply(this, arguments);
      }

      return _realRelease;
    }()
  }, {
    key: '_releaseCleanup',
    value: function _releaseCleanup(session) {
      var path = this.reverse[session];
      delete this.reverse[session];
      delete this.connections[path];
      this.deferedOnRelease[session].reject(new Error('Device released or disconnected'));
      delete this.deferedOnRelease[session];
      return;
    }
  }, {
    key: 'configure',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(signedData) {
        var buffer, messages;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                buffer = (0, _verify.verifyHexBin)(signedData);
                messages = (0, _parse_protocol.parseConfigure)(buffer);

                this._messages = messages;
                this.configured = true;

              case 4:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function configure(_x9) {
        return _ref9.apply(this, arguments);
      }

      return configure;
    }()
  }, {
    key: '_sendLowlevel',
    value: function _sendLowlevel(session) {
      var _this5 = this;

      var path = this.reverse[session];
      return function (data) {
        return _this5.plugin.send(path, session, data);
      };
    }
  }, {
    key: '_receiveLowlevel',
    value: function _receiveLowlevel(session) {
      var _this6 = this;

      var path = this.reverse[session];
      return function () {
        return _this6.plugin.receive(path, session);
      };
    }
  }, {
    key: 'call',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(session, name, data) {
        var _this7 = this;

        var messages, doCall, mightlock;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                if (!(this._messages == null)) {
                  _context12.next = 2;
                  break;
                }

                throw new Error('Transport not configured.');

              case 2:
                if (!(this.reverse[session] == null)) {
                  _context12.next = 4;
                  break;
                }

                throw new Error('Trying to use device after release.');

              case 4:
                messages = this._messages;

                doCall = function () {
                  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                    var resPromise;
                    return regeneratorRuntime.wrap(function _callee11$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            resPromise = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                              var message;
                              return regeneratorRuntime.wrap(function _callee10$(_context10) {
                                while (1) {
                                  switch (_context10.prev = _context10.next) {
                                    case 0:
                                      _context10.next = 2;
                                      return (0, _send.buildAndSend)(messages, _this7._sendLowlevel(session), name, data);

                                    case 2:
                                      _context10.next = 4;
                                      return (0, _receive.receiveAndParse)(messages, _this7._receiveLowlevel(session));

                                    case 4:
                                      message = _context10.sent;
                                      return _context10.abrupt('return', message);

                                    case 6:
                                    case 'end':
                                      return _context10.stop();
                                  }
                                }
                              }, _callee10, _this7);
                            }))();
                            return _context11.abrupt('return', Promise.race([_this7.deferedOnRelease[session].rejectingPromise, resPromise]));

                          case 2:
                          case 'end':
                            return _context11.stop();
                        }
                      }
                    }, _callee11, _this7);
                  }));

                  return function doCall() {
                    return _ref11.apply(this, arguments);
                  };
                }();

                mightlock = this.plugin.allowsWriteAndEnumerate ? doCall() : this.lock(doCall);
                return _context12.abrupt('return', mightlock);

              case 8:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function call(_x10, _x11, _x12) {
        return _ref10.apply(this, arguments);
      }

      return call;
    }()
  }, {
    key: 'init',
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(debug) {
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                this.debug = !!debug;
                this.requestNeeded = this.plugin.requestNeeded;
                return _context13.abrupt('return', this.plugin.init(debug));

              case 3:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function init(_x13) {
        return _ref13.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'requestDevice',
    value: function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                return _context14.abrupt('return', this.plugin.requestDevice());

              case 1:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function requestDevice() {
        return _ref14.apply(this, arguments);
      }

      return requestDevice;
    }()
  }]);

  return LowlevelTransport;
}(), (_applyDecoratedDescriptor(_class.prototype, 'enumerate', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'enumerate'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'listen', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'listen'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'acquire', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'acquire'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'release', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'release'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'configure', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'configure'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'call', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'call'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'init', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'init'), _class.prototype)), _class);
exports.default = LowlevelTransport;
module.exports = exports['default'];