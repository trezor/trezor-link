"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildAndSend = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// Sends more buffers to device.
var sendBuffers = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(sender, buffers) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, buffer;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // eslint-disable-next-line prefer-const
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 3;
            _iterator = buffers[Symbol.iterator]();

          case 5:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 12;
              break;
            }

            buffer = _step.value;
            _context.next = 9;
            return sender(buffer);

          case 9:
            _iteratorNormalCompletion = true;
            _context.next = 5;
            break;

          case 12:
            _context.next = 18;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](3);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 18:
            _context.prev = 18;
            _context.prev = 19;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 21:
            _context.prev = 21;

            if (!_didIteratorError) {
              _context.next = 24;
              break;
            }

            throw _iteratorError;

          case 24:
            return _context.finish(21);

          case 25:
            return _context.finish(18);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[3, 14, 18, 26], [19,, 21, 25]]);
  }));

  return function sendBuffers(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// already built PB message


// Sends message to device.
// Resolves iff everything gets sent
var buildAndSend = exports.buildAndSend = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(messages, sender, name, data) {
    var buffers;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            buffers = buildBuffers(messages, name, data);
            return _context2.abrupt("return", sendBuffers(sender, buffers));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function buildAndSend(_x3, _x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.buildOne = buildOne;

var _protobufjsOldFixedWebpack = require("protobufjs-old-fixed-webpack");

var ProtoBuf = _interopRequireWildcard(_protobufjsOldFixedWebpack);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Logic of sending data to trezor
//
// Logic of "call" is broken to two parts - sending and recieving

var HEADER_SIZE = 1 + 1 + 4 + 2;
var MESSAGE_HEADER_BYTE = 0x23;
var BUFFER_SIZE = 63;
var BuiltMessage = function () {
  function BuiltMessage(messages, // Builders, generated by reading config
  name, // Name of the message
  data // data as "pure" object, from trezor.js
  ) {
    _classCallCheck(this, BuiltMessage);

    var Builder = messages.messagesByName[name];
    if (Builder == null) {
      throw new Error("The message name " + name + " is not found.");
    }

    // cleans up stuff from angular and remove "null" that crashes in builder
    cleanupInput(data);

    if (data) {
      this.message = new Builder(data);
    } else {
      this.message = new Builder();
    }

    this.type = messages.messageTypes["MessageType_" + name];
  }

  // encodes into "raw" data, but it can be too long and needs to be split into
  // smaller buffers


  _createClass(BuiltMessage, [{
    key: "_encodeLong",
    value: function _encodeLong(addTrezorHeaders) {
      var headerSize = HEADER_SIZE; // should be 8
      var bytes = new Uint8Array(this.message.encodeAB());
      var fullSize = (addTrezorHeaders ? headerSize : headerSize - 2) + bytes.length;

      var encodedByteBuffer = new _protobufjsOldFixedWebpack.ByteBuffer(fullSize);

      // first encode header

      if (addTrezorHeaders) {
        // 2*1 byte
        encodedByteBuffer.writeByte(MESSAGE_HEADER_BYTE);
        encodedByteBuffer.writeByte(MESSAGE_HEADER_BYTE);
      }

      // 2 bytes
      encodedByteBuffer.writeUint16(this.type);

      // 4 bytes (so 8 in total)
      encodedByteBuffer.writeUint32(bytes.length);

      // then put in the actual message
      encodedByteBuffer.append(bytes);

      // and convert to uint8 array
      // (it can still be too long to send though)
      var encoded = new Uint8Array(encodedByteBuffer.buffer);

      return encoded;
    }

    // encodes itself and splits into "nice" chunks

  }, {
    key: "encode",
    value: function encode() {
      var bytes = this._encodeLong(true);

      var result = [];
      var size = BUFFER_SIZE;

      // How many pieces will there actually be
      var count = Math.floor((bytes.length - 1) / size) + 1;

      // slice and dice
      for (var i = 0; i < count; i++) {
        var slice = bytes.subarray(i * size, (i + 1) * size);
        var newArray = new Uint8Array(size);
        newArray.set(slice);
        result.push(newArray.buffer);
      }

      return result;
    }

    // encodes itself into one long arraybuffer

  }, {
    key: "encodeOne",
    value: function encodeOne() {
      var bytes = this._encodeLong(false);
      return new Buffer([].concat(_toConsumableArray(bytes)));
    }
  }]);

  return BuiltMessage;
}();

// Removes $$hashkey from angular and remove nulls


function cleanupInput(message) {
  delete message.$$hashKey;

  for (var key in message) {
    var value = message[key];
    if (value == null) {
      delete message[key];
    } else {
      if (Array.isArray(value)) {
        value.forEach(function (i) {
          if (typeof i === "object") {
            cleanupInput(i);
          }
        });
      }
      if (typeof value === "object") {
        cleanupInput(value);
      }
    }
  }
}

// Builds buffers to send.
// messages: Builders, generated by reading config
// name: Name of the message
// data: Data to serialize, exactly as given by trezor.js
// Returning buffers that will be sent to Trezor
function buildBuffers(messages, name, data) {
  var message = new BuiltMessage(messages, name, data);
  var encoded = message.encode();
  return encoded;
}

// Sends message to device.
// Resolves iff everything gets sent
function buildOne(messages, name, data) {
  var message = new BuiltMessage(messages, name, data);
  return message.encodeOne();
}