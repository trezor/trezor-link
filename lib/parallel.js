'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _debugDecorator = require('./debug-decorator');

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

function compare(a, b) {
  if (!isNaN(parseInt(a.path))) {
    return parseInt(a.path) - parseInt(b.path);
  } else {
    return a.path < b.path ? -1 : a.path > b.path ? 1 : 0;
  }
}

var ParallelTransport = (_class = function () {
  function ParallelTransport(transports) {
    _classCallCheck(this, ParallelTransport);

    this.name = 'ParallelTransport';
    this.debug = false;
    this.requestNeeded = false;

    this.transports = transports;
  }

  _createClass(ParallelTransport, [{
    key: '_prepend',
    value: function _prepend(name, devices) {
      return devices.map(function (device) {
        return {
          path: name + '-' + device.path,
          session: device.session == null ? null : name + '-' + device.session
        };
      });
    }
  }, {
    key: '_filter',
    value: function _filter(name, devices) {
      var _this = this;

      return devices.filter(function (device) {
        return _this._parseName(device.path).name === name;
      }).map(function (device) {
        return _extends({}, device, {
          path: _this._parseName(device.path).rest,
          session: device.session == null ? device.session : _this._parseName(device.session).rest
        });
      });
    }
  }, {
    key: '_antiFilter',
    value: function _antiFilter(name, devices) {
      var _this2 = this;

      return devices.filter(function (device) {
        return _this2._parseName(device.path).name !== name;
      });
    }
  }, {
    key: 'enumerate',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var res, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name, devices;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                res = [];
                // eslint-disable-next-line prefer-const

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 4;
                _iterator = Object.keys(this.transports)[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 15;
                  break;
                }

                name = _step.value;
                _context.next = 10;
                return this.transports[name].enumerate();

              case 10:
                devices = _context.sent;

                res.push.apply(res, _toConsumableArray(this._prepend(name, devices)));

              case 12:
                _iteratorNormalCompletion = true;
                _context.next = 6;
                break;

              case 15:
                _context.next = 21;
                break;

              case 17:
                _context.prev = 17;
                _context.t0 = _context['catch'](4);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 21:
                _context.prev = 21;
                _context.prev = 22;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 24:
                _context.prev = 24;

                if (!_didIteratorError) {
                  _context.next = 27;
                  break;
                }

                throw _iteratorError;

              case 27:
                return _context.finish(24);

              case 28:
                return _context.finish(21);

              case 29:
                return _context.abrupt('return', res.sort(compare));

              case 30:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 17, 21, 29], [22,, 24, 28]]);
      }));

      function enumerate() {
        return _ref.apply(this, arguments);
      }

      return enumerate;
    }()
  }, {
    key: 'listen',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(old) {
        var _this3 = this;

        var actualOld, promises, _ref4, name, devices, antiFiltered, prepended;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(old == null)) {
                  _context3.next = 6;
                  break;
                }

                _context3.next = 3;
                return this.enumerate();

              case 3:
                _context3.t0 = _context3.sent;
                _context3.next = 7;
                break;

              case 6:
                _context3.t0 = old;

              case 7:
                actualOld = _context3.t0;
                promises = Object.keys(this.transports).map(function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(name) {
                    var oldFiltered, devices;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            oldFiltered = _this3._filter(name, actualOld);
                            _context2.next = 3;
                            return _this3.transports[name].listen(oldFiltered);

                          case 3:
                            devices = _context2.sent;
                            return _context2.abrupt('return', { name: name, devices: devices });

                          case 5:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this3);
                  }));

                  return function (_x2) {
                    return _ref3.apply(this, arguments);
                  };
                }());
                _context3.next = 11;
                return Promise.race(promises);

              case 11:
                _ref4 = _context3.sent;
                name = _ref4.name;
                devices = _ref4.devices;
                antiFiltered = this._antiFilter(name, actualOld);
                prepended = this._prepend(name, devices);
                return _context3.abrupt('return', antiFiltered.concat(prepended).sort(compare));

              case 17:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function listen(_x) {
        return _ref2.apply(this, arguments);
      }

      return listen;
    }()
  }, {
    key: '_parseName',
    value: function _parseName(input) {
      if (input == null) {
        throw new Error('Wrong input');
      }

      var _input$split = input.split('-'),
          _input$split2 = _toArray(_input$split),
          name = _input$split2[0],
          restArray = _input$split2.slice(1);

      if (restArray.length === 0) {
        throw new Error('Input has to contain transport name.');
      }
      var transport = this.transports[name];
      if (transport == null) {
        throw new Error('Input has to contain valid transport name.');
      }
      var rest = restArray.join('-');

      return {
        transport: transport,
        name: name,
        rest: rest
      };
    }
  }, {
    key: 'acquire',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(input) {
        var path, previous, newInput, res;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                path = this._parseName(input.path);
                previous = input.previous == null ? null : this._parseName(input.previous);

                if (!(previous != null && path.name !== previous.name)) {
                  _context4.next = 4;
                  break;
                }

                throw new Error('Session transport has to equal path transport.');

              case 4:
                newInput = {
                  path: path.rest,
                  previous: previous == null ? null : previous.rest,
                  checkPrevious: input.checkPrevious
                };
                _context4.next = 7;
                return path.transport.acquire(newInput);

              case 7:
                res = _context4.sent;
                return _context4.abrupt('return', path.name + '-' + res);

              case 9:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function acquire(_x3) {
        return _ref5.apply(this, arguments);
      }

      return acquire;
    }()
  }, {
    key: 'release',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(session) {
        var sessionP;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                sessionP = this._parseName(session);
                return _context5.abrupt('return', sessionP.transport.release(sessionP.rest));

              case 2:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function release(_x4) {
        return _ref6.apply(this, arguments);
      }

      return release;
    }()
  }, {
    key: '_checkConfigured',
    value: function _checkConfigured() {
      // configured is true if all of the transports are configured
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(this.transports)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var name = _step2.value;

          var transport = this.transports[name];
          if (!transport.configured) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return true;
    }
  }, {
    key: 'configure',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(signedData) {
        var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, name, transport;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                // eslint-disable-next-line prefer-const
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context6.prev = 3;
                _iterator3 = Object.keys(this.transports)[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context6.next = 13;
                  break;
                }

                name = _step3.value;
                transport = this.transports[name];
                _context6.next = 10;
                return transport.configure(signedData);

              case 10:
                _iteratorNormalCompletion3 = true;
                _context6.next = 5;
                break;

              case 13:
                _context6.next = 19;
                break;

              case 15:
                _context6.prev = 15;
                _context6.t0 = _context6['catch'](3);
                _didIteratorError3 = true;
                _iteratorError3 = _context6.t0;

              case 19:
                _context6.prev = 19;
                _context6.prev = 20;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 22:
                _context6.prev = 22;

                if (!_didIteratorError3) {
                  _context6.next = 25;
                  break;
                }

                throw _iteratorError3;

              case 25:
                return _context6.finish(22);

              case 26:
                return _context6.finish(19);

              case 27:
                this.configured = this._checkConfigured();

              case 28:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[3, 15, 19, 27], [20,, 22, 26]]);
      }));

      function configure(_x5) {
        return _ref7.apply(this, arguments);
      }

      return configure;
    }()
  }, {
    key: 'call',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(session, name, data) {
        var sessionP;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                sessionP = this._parseName(session);
                return _context7.abrupt('return', sessionP.transport.call(sessionP.rest, name, data));

              case 2:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function call(_x6, _x7, _x8) {
        return _ref8.apply(this, arguments);
      }

      return call;
    }()

    // resolves when the transport can be used; rejects when it cannot

  }, {
    key: 'init',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(debug) {
        var version, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, name, transport;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                this.debug = !!debug;
                version = '';
                // eslint-disable-next-line prefer-const

                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context8.prev = 5;
                _iterator4 = Object.keys(this.transports)[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                  _context8.next = 17;
                  break;
                }

                name = _step4.value;
                transport = this.transports[name];
                _context8.next = 12;
                return transport.init(debug);

              case 12:
                version = version + (name + ':' + transport.version + ';');
                if (transport.requestNeeded) {
                  this.requestNeeded = transport.requestNeeded;
                }

              case 14:
                _iteratorNormalCompletion4 = true;
                _context8.next = 7;
                break;

              case 17:
                _context8.next = 23;
                break;

              case 19:
                _context8.prev = 19;
                _context8.t0 = _context8['catch'](5);
                _didIteratorError4 = true;
                _iteratorError4 = _context8.t0;

              case 23:
                _context8.prev = 23;
                _context8.prev = 24;

                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }

              case 26:
                _context8.prev = 26;

                if (!_didIteratorError4) {
                  _context8.next = 29;
                  break;
                }

                throw _iteratorError4;

              case 29:
                return _context8.finish(26);

              case 30:
                return _context8.finish(23);

              case 31:
                this.version = version;
                this.configured = this._checkConfigured();

              case 33:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this, [[5, 19, 23, 31], [24,, 26, 30]]);
      }));

      function init(_x9) {
        return _ref9.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'requestDevice',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        var _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, name, transport;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _iteratorNormalCompletion5 = true;
                _didIteratorError5 = false;
                _iteratorError5 = undefined;
                _context9.prev = 3;
                _iterator5 = Object.keys(this.transports)[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                  _context9.next = 13;
                  break;
                }

                name = _step5.value;
                transport = this.transports[name];

                if (!transport.requestNeeded) {
                  _context9.next = 10;
                  break;
                }

                return _context9.abrupt('return', transport.requestDevice());

              case 10:
                _iteratorNormalCompletion5 = true;
                _context9.next = 5;
                break;

              case 13:
                _context9.next = 19;
                break;

              case 15:
                _context9.prev = 15;
                _context9.t0 = _context9['catch'](3);
                _didIteratorError5 = true;
                _iteratorError5 = _context9.t0;

              case 19:
                _context9.prev = 19;
                _context9.prev = 20;

                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                  _iterator5.return();
                }

              case 22:
                _context9.prev = 22;

                if (!_didIteratorError5) {
                  _context9.next = 25;
                  break;
                }

                throw _iteratorError5;

              case 25:
                return _context9.finish(22);

              case 26:
                return _context9.finish(19);

              case 27:
                return _context9.abrupt('return', Promise.reject());

              case 28:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this, [[3, 15, 19, 27], [20,, 22, 26]]);
      }));

      function requestDevice() {
        return _ref10.apply(this, arguments);
      }

      return requestDevice;
    }()
  }]);

  return ParallelTransport;
}(), (_applyDecoratedDescriptor(_class.prototype, 'enumerate', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'enumerate'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'listen', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'listen'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'acquire', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'acquire'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'release', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'release'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'configure', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'configure'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'call', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'call'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'init', [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, 'init'), _class.prototype)), _class);
exports.default = ParallelTransport;
module.exports = exports['default'];