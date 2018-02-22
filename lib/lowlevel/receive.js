"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.receiveAndParse = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// Logic of recieving data from trezor
// Logic of "call" is broken to two parts - sending and recieving

// If the whole message wasn't loaded in the first input, loads more inputs until everything is loaded.
// note: the return value is not at all important since it's still the same parsedinput
var receiveRest = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parsedInput, receiver) {
    var data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!parsedInput.isDone()) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return");

          case 2:
            _context.next = 4;
            return receiver();

          case 4:
            data = _context.sent;

            if (!(data == null)) {
              _context.next = 7;
              break;
            }

            throw new Error("Received no data.");

          case 7:

            parsedInput.append(data);
            return _context.abrupt("return", receiveRest(parsedInput, receiver));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function receiveRest(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Receives the whole message as a raw data buffer (but without headers or type info)


var receiveBuffer = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(receiver) {
    var data, partialInput;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return receiver();

          case 2:
            data = _context2.sent;
            partialInput = parseFirstInput(data);
            _context2.next = 6;
            return receiveRest(partialInput, receiver);

          case 6:
            return _context2.abrupt("return", partialInput);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function receiveBuffer(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

// Reads data from device and returns decoded message, that can be sent back to trezor.js
var receiveAndParse = exports.receiveAndParse = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(messages, receiver) {
    var received, typeId, buffer, decoder;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return receiveBuffer(receiver);

          case 2:
            received = _context3.sent;
            typeId = received.typeNumber;
            buffer = received.arrayBuffer();
            decoder = new _message_decoder.MessageDecoder(messages, typeId, buffer);
            return _context3.abrupt("return", {
              message: decoder.decodedJSON(),
              type: decoder.messageName()
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function receiveAndParse(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.receiveOne = receiveOne;

var _message_decoder = require("./protobuf/message_decoder.js");

var _protobufjsOldFixedWebpack = require("protobufjs-old-fixed-webpack");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MESSAGE_HEADER_BYTE = 0x23;

// input that might or might not be fully parsed yet

var PartiallyParsedInput = function () {
  // Expected length of the raq message, in bytes
  function PartiallyParsedInput(typeNumber, length) {
    _classCallCheck(this, PartiallyParsedInput);

    this.typeNumber = typeNumber;
    this.expectedLength = length;
    this.buffer = new _protobufjsOldFixedWebpack.ByteBuffer(length);
  }
  // Buffer with the beginning of message; can be non-complete and WILL be modified
  // during the object's lifetime

  // Message type number


  _createClass(PartiallyParsedInput, [{
    key: "isDone",
    value: function isDone() {
      return this.buffer.offset >= this.expectedLength;
    }
  }, {
    key: "append",
    value: function append(buffer) {
      this.buffer.append(buffer);
    }
  }, {
    key: "arrayBuffer",
    value: function arrayBuffer() {
      var byteBuffer = this.buffer;
      byteBuffer.reset();
      return byteBuffer.toArrayBuffer();
    }
  }]);

  return PartiallyParsedInput;
}();

// Parses first raw input that comes from Trezor and returns some information about the whole message.


function parseFirstInput(bytes) {
  // convert to ByteBuffer so it's easier to read
  var byteBuffer = _protobufjsOldFixedWebpack.ByteBuffer.concat([bytes]);

  // checking first two bytes
  var sharp1 = byteBuffer.readByte();
  var sharp2 = byteBuffer.readByte();
  if (sharp1 !== MESSAGE_HEADER_BYTE || sharp2 !== MESSAGE_HEADER_BYTE) {
    throw new Error("Didn't receive expected header signature.");
  }

  // reading things from header
  var type = byteBuffer.readUint16();
  var length = byteBuffer.readUint32();

  // creating a new buffer with the right size
  var res = new PartiallyParsedInput(type, length);
  res.append(byteBuffer);
  return res;
}function receiveOne(messages, data) {
  var byteBuffer = _protobufjsOldFixedWebpack.ByteBuffer.concat([data]);
  var typeId = byteBuffer.readUint16();
  byteBuffer.readUint32(); // length, ignoring
  var decoder = new _message_decoder.MessageDecoder(messages, typeId, byteBuffer.toArrayBuffer());
  return {
    message: decoder.decodedJSON(),
    type: decoder.messageName()
  };
}