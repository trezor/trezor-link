'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _monkey_patch = require('./protobuf/monkey_patch');

var _defered = require('../defered');

var _parse_protocol = require('./protobuf/parse_protocol');

var _verify = require('./verify');

var _send = require('./send');

var _receive = require('./receive');

var _debugDecorator = require('../debug-decorator');

var _sharedConnectionWorker = require('./sharedConnectionWorker');

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

var LowlevelTransportWithSharedConnections = (_class = function () {

  // path => promise rejecting on release
  function LowlevelTransportWithSharedConnections(plugin, sharedWorkerFactory) {
    _classCallCheck(this, LowlevelTransportWithSharedConnections);

    this.name = 'LowlevelTransportWithSharedConnections';
    this.debug = false;
    this.deferedOnRelease = {};
    this.configured = false;
    this._lastStringified = '';
    this.requestNeeded = false;
    this.latestId = 0;
    this.defereds = {};

    this.plugin = plugin;
    this.version = plugin.version;
    this._sharedWorkerFactory = sharedWorkerFactory;
    if (!this.plugin.allowsWriteAndEnumerate) {
      // This should never happen anyway
      throw new Error('Plugin with shared connections cannot disallow write and enumerate');
    }
  }

  _createClass(LowlevelTransportWithSharedConnections, [{
    key: 'enumerate',
    value: function enumerate() {
      return this._silentEnumerate();
    }
  }, {
    key: '_silentEnumerate',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var devices, sessionsM, sessions, devicesWithSessions;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.plugin.enumerate();

              case 2:
                devices = _context.sent;
                _context.next = 5;
                return this.sendToWorker({ type: 'get-sessions-and-disconnect', devices: devices });

              case 5:
                sessionsM = _context.sent;

                if (!(sessionsM.type !== 'sessions')) {
                  _context.next = 8;
                  break;
                }

                throw new Error('Wrong reply');

              case 8:
                sessions = sessionsM.sessions;
                devicesWithSessions = devices.map(function (device) {
                  var session = sessions[device.path];
                  return {
                    path: device.path,
                    session: session
                  };
                });


                this._releaseDisconnected(devicesWithSessions);
                return _context.abrupt('return', devicesWithSessions.sort(compare));

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _silentEnumerate() {
        return _ref.apply(this, arguments);
      }

      return _silentEnumerate;
    }()
  }, {
    key: '_releaseDisconnected',
    value: function _releaseDisconnected(devices) {
      var _this = this;

      var connected = {};
      devices.forEach(function (device) {
        if (device.session != null) {
          connected[device.session] = true;
        }
      });
      Object.keys(this.deferedOnRelease).forEach(function (session) {
        if (connected[session] == null) {
          _this._releaseCleanup(session);
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
    key: 'acquire',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(input) {
        var messBack, messBack2, session;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.sendToWorker(_extends({ type: 'acquire-intent' }, input));

              case 2:
                messBack = _context4.sent;

                if (!(messBack.type === 'wrong-previous-session')) {
                  _context4.next = 5;
                  break;
                }

                throw new Error('wrong previous session');

              case 5:
                _context4.prev = 5;
                _context4.next = 8;
                return this.plugin.connect(input.path);

              case 8:
                _context4.next = 15;
                break;

              case 10:
                _context4.prev = 10;
                _context4.t0 = _context4['catch'](5);
                _context4.next = 14;
                return this.sendToWorker({ type: 'acquire-failed' });

              case 14:
                throw _context4.t0;

              case 15:
                _context4.next = 17;
                return this.sendToWorker({ type: 'acquire-done' });

              case 17:
                messBack2 = _context4.sent;

                if (!(messBack2.type !== 'session-number')) {
                  _context4.next = 20;
                  break;
                }

                throw new Error('Strange reply.');

              case 20:
                session = messBack2.number;


                this.deferedOnRelease[session] = (0, _defered.create)();
                return _context4.abrupt('return', session);

              case 23:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[5, 10]]);
      }));

      function acquire(_x4) {
        return _ref4.apply(this, arguments);
      }

      return acquire;
    }()
  }, {
    key: 'release',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(session) {
        var messback, path;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.sendToWorker({ type: 'release-intent', session: session });

              case 2:
                messback = _context5.sent;

                if (!(messback.type === 'double-release')) {
                  _context5.next = 5;
                  break;
                }

                throw new Error('Trying to double release.');

              case 5:
                if (!(messback.type !== 'path')) {
                  _context5.next = 7;
                  break;
                }

                throw new Error('Strange reply.');

              case 7:
                path = messback.path;


                this._releaseCleanup(session);
                _context5.prev = 9;
                _context5.next = 12;
                return this.plugin.disconnect(path);

              case 12:
                _context5.next = 16;
                break;

              case 14:
                _context5.prev = 14;
                _context5.t0 = _context5['catch'](9);

              case 16:
                _context5.next = 18;
                return this.sendToWorker({ type: 'release-done' });

              case 18:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[9, 14]]);
      }));

      function release(_x5) {
        return _ref5.apply(this, arguments);
      }

      return release;
    }()
  }, {
    key: '_releaseCleanup',
    value: function _releaseCleanup(session) {
      if (this.deferedOnRelease[session] != null) {
        this.deferedOnRelease[session].reject(new Error('Device released or disconnected'));
        delete this.deferedOnRelease[session];
      }
    }
  }, {
    key: 'configure',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(signedData) {
        var buffer, messages;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                buffer = (0, _verify.verifyHexBin)(signedData);
                messages = (0, _parse_protocol.parseConfigure)(buffer);

                this._messages = messages;
                this.configured = true;

              case 4:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function configure(_x6) {
        return _ref6.apply(this, arguments);
      }

      return configure;
    }()
  }, {
    key: '_sendLowlevel',
    value: function _sendLowlevel(path) {
      var _this2 = this;

      return function (data) {
        return _this2.plugin.send(path, data);
      };
    }
  }, {
    key: '_receiveLowlevel',
    value: function _receiveLowlevel(path) {
      var _this3 = this;

      return function () {
        return _this3.plugin.receive(path);
      };
    }
  }, {
    key: 'call',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(session, name, data) {
        var _this4 = this;

        var sessionsM, messages, path_, path, resPromise;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.sendToWorker({ type: 'get-sessions' });

              case 2:
                sessionsM = _context8.sent;

                if (!(this._messages == null)) {
                  _context8.next = 5;
                  break;
                }

                throw new Error('Transport not configured.');

              case 5:
                messages = this._messages;

                if (!(sessionsM.type !== 'sessions')) {
                  _context8.next = 8;
                  break;
                }

                throw new Error('Wrong reply');

              case 8:
                path_ = null;

                Object.keys(sessionsM.sessions).forEach(function (kpath) {
                  if (sessionsM.sessions[kpath] === session) {
                    path_ = kpath;
                  }
                });

                if (!(path_ == null)) {
                  _context8.next = 12;
                  break;
                }

                throw new Error('Session not available.');

              case 12:
                path = path_;
                resPromise = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                  var message;
                  return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          _context7.next = 2;
                          return (0, _send.buildAndSend)(messages, _this4._sendLowlevel(path), name, data);

                        case 2:
                          _context7.next = 4;
                          return (0, _receive.receiveAndParse)(messages, _this4._receiveLowlevel(path));

                        case 4:
                          message = _context7.sent;
                          return _context7.abrupt('return', message);

                        case 6:
                        case 'end':
                          return _context7.stop();
                      }
                    }
                  }, _callee7, _this4);
                }))();
                return _context8.abrupt('return', Promise.race([this.deferedOnRelease[session].rejectingPromise, resPromise]));

              case 15:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function call(_x7, _x8, _x9) {
        return _ref7.apply(this, arguments);
      }

      return call;
    }()
  }, {
    key: 'init',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(debug) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                this.debug = !!debug;
                this.requestNeeded = this.plugin.requestNeeded;
                _context9.next = 4;
                return this.plugin.init(debug);

              case 4:
                // create the worker ONLY when the plugin is successfully inited
                if (this._sharedWorkerFactory != null) {
                  this.sharedWorker = this._sharedWorkerFactory();
                  if (this.sharedWorker != null) {
                    this.sharedWorker.port.onmessage = function (e) {
                      // $FlowIssue
                      _this5.receiveFromWorker(e.data);
                    };
                  }
                }

              case 5:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function init(_x10) {
        return _ref9.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'requestDevice',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt('return', this.plugin.requestDevice());

              case 1:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function requestDevice() {
        return _ref10.apply(this, arguments);
      }

      return requestDevice;
    }()
  }, {
    key: 'sendToWorker',
    value: function sendToWorker(message) {
      var _this6 = this;

      this.latestId++;
      var id = this.latestId;
      this.defereds[id] = (0, _defered.create)();

      // when shared worker is not loaded as a shared loader, use it as a module instead
      if (this.sharedWorker != null) {
        this.sharedWorker.port.postMessage({ id: id, message: message });
      } else {
        (0, _sharedConnectionWorker.postModuleMessage)({ id: id, message: message }, function (m) {
          return _this6.receiveFromWorker(m);
        });
      }

      return this.defereds[id].promise;
    }
  }, {
    key: 'receiveFromWorker',
    value: function receiveFromWorker(m) {
      this.defereds[m.id].resolve(m.message);
      delete this.defereds[m.id];
    }
  }]);

  return LowlevelTransportWithSharedConnections;
}(), (_applyDecoratedDescriptor(_class.prototype, 'enumerate', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'enumerate'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'listen', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'listen'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'acquire', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'acquire'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'release', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'release'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'configure', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'configure'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'call', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'call'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'init', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'init'), _class.prototype)), _class);
exports.default = LowlevelTransportWithSharedConnections;
module.exports = exports['default'];