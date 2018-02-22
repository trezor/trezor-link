'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _debugDecorator = require('./debug-decorator');

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

var FallbackTransport = (_class = function () {

  // note: activeTransport is actually "?Transport", but
  // everywhere I am using it is in `async`, so error gets returned as Promise.reject
  function FallbackTransport(transports) {
    _classCallCheck(this, FallbackTransport);

    this.name = 'FallbackTransport';
    this.activeName = '';
    this.debug = false;
    this.requestNeeded = false;

    this.transports = transports;
  }

  // first one that inits successfuly is the final one; others won't even start initing


  _createClass(FallbackTransport, [{
    key: '_tryInitTransports',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var res, lastError, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, transport;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                res = [];
                lastError = null;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 5;
                _iterator = this.transports[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 21;
                  break;
                }

                transport = _step.value;
                _context.prev = 9;
                _context.next = 12;
                return transport.init(this.debug);

              case 12:
                res.push(transport);
                _context.next = 18;
                break;

              case 15:
                _context.prev = 15;
                _context.t0 = _context['catch'](9);

                lastError = _context.t0;

              case 18:
                _iteratorNormalCompletion = true;
                _context.next = 7;
                break;

              case 21:
                _context.next = 27;
                break;

              case 23:
                _context.prev = 23;
                _context.t1 = _context['catch'](5);
                _didIteratorError = true;
                _iteratorError = _context.t1;

              case 27:
                _context.prev = 27;
                _context.prev = 28;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 30:
                _context.prev = 30;

                if (!_didIteratorError) {
                  _context.next = 33;
                  break;
                }

                throw _iteratorError;

              case 33:
                return _context.finish(30);

              case 34:
                return _context.finish(27);

              case 35:
                if (!(res.length === 0)) {
                  _context.next = 37;
                  break;
                }

                throw lastError || new Error('No transport could be initialized.');

              case 37:
                return _context.abrupt('return', res);

              case 38:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 23, 27, 35], [9, 15], [28,, 30, 34]]);
      }));

      function _tryInitTransports() {
        return _ref.apply(this, arguments);
      }

      return _tryInitTransports;
    }()

    // first one that inits successfuly is the final one; others won't even start initing

  }, {
    key: '_tryConfigureTransports',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
        var lastError, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, transport;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                lastError = null;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context2.prev = 4;
                _iterator2 = this._availableTransports[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context2.next = 20;
                  break;
                }

                transport = _step2.value;
                _context2.prev = 8;
                _context2.next = 11;
                return transport.configure(data);

              case 11:
                return _context2.abrupt('return', transport);

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2['catch'](8);

                lastError = _context2.t0;

              case 17:
                _iteratorNormalCompletion2 = true;
                _context2.next = 6;
                break;

              case 20:
                _context2.next = 26;
                break;

              case 22:
                _context2.prev = 22;
                _context2.t1 = _context2['catch'](4);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t1;

              case 26:
                _context2.prev = 26;
                _context2.prev = 27;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 29:
                _context2.prev = 29;

                if (!_didIteratorError2) {
                  _context2.next = 32;
                  break;
                }

                throw _iteratorError2;

              case 32:
                return _context2.finish(29);

              case 33:
                return _context2.finish(26);

              case 34:
                throw lastError || new Error('No transport could be initialized.');

              case 35:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[4, 22, 26, 34], [8, 14], [27,, 29, 33]]);
      }));

      function _tryConfigureTransports(_x) {
        return _ref2.apply(this, arguments);
      }

      return _tryConfigureTransports;
    }()
  }, {
    key: 'init',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(debug) {
        var transports;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.debug = !!debug;

                // init ALL OF THEM
                _context3.next = 3;
                return this._tryInitTransports();

              case 3:
                transports = _context3.sent;

                this._availableTransports = transports;

                // a slight hack - configured is always false, so we force caller to call configure()
                // to find out the actual working transport (bridge falls on configure, not on info)
                this.version = transports[0].version;
                this.configured = false;

              case 7:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function init(_x2) {
        return _ref3.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'configure',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(signedData) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this._tryConfigureTransports(signedData);

              case 2:
                this.activeTransport = _context4.sent;

                this.configured = this.activeTransport.configured;
                this.version = this.activeTransport.version;
                this.activeName = this.activeTransport.name;
                this.requestNeeded = this.activeTransport.requestNeeded;

              case 7:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function configure(_x3) {
        return _ref4.apply(this, arguments);
      }

      return configure;
    }()

    // using async so I get Promise.recect on this.activeTransport == null (or other error), not Error

  }, {
    key: 'enumerate',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt('return', this.activeTransport.enumerate());

              case 1:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function enumerate() {
        return _ref5.apply(this, arguments);
      }

      return enumerate;
    }()
  }, {
    key: 'listen',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(old) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt('return', this.activeTransport.listen(old));

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function listen(_x4) {
        return _ref6.apply(this, arguments);
      }

      return listen;
    }()
  }, {
    key: 'acquire',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(input) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt('return', this.activeTransport.acquire(input));

              case 1:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function acquire(_x5) {
        return _ref7.apply(this, arguments);
      }

      return acquire;
    }()
  }, {
    key: 'release',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(session) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt('return', this.activeTransport.release(session));

              case 1:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function release(_x6) {
        return _ref8.apply(this, arguments);
      }

      return release;
    }()
  }, {
    key: 'call',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(session, name, data) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt('return', this.activeTransport.call(session, name, data));

              case 1:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function call(_x7, _x8, _x9) {
        return _ref9.apply(this, arguments);
      }

      return call;
    }()
  }, {
    key: 'requestDevice',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt('return', this.activeTransport.requestDevice());

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
  }]);

  return FallbackTransport;
}(), (_applyDecoratedDescriptor(_class.prototype, 'init', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'init'), _class.prototype)), _class);
exports.default = FallbackTransport;
module.exports = exports['default'];