
/*global chrome:false*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var exists = exports.exists = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(typeof chrome === 'undefined')) {
              _context.next = 2;
              break;
            }

            throw new Error('Global chrome does not exist; probably not running chrome');

          case 2:
            if (!(typeof chrome.runtime === 'undefined')) {
              _context.next = 4;
              break;
            }

            throw new Error('Global chrome.runtime does not exist; probably not running chrome');

          case 4:
            if (!(typeof chrome.runtime.sendMessage === 'undefined')) {
              _context.next = 6;
              break;
            }

            throw new Error('Global chrome.runtime.sendMessage does not exist; probably not whitelisted website in extension manifest');

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function exists() {
    return _ref.apply(this, arguments);
  };
}();

exports.send = send;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function send(extensionId, message) {
  return new Promise(function (resolve, reject) {
    var callback = function callback(response) {
      if (response === undefined) {
        console.error('[trezor.js] [chrome-messages] Chrome runtime error', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
        return;
      }
      if (typeof response !== 'object' || response == null) {
        reject(new Error('Response is not an object.'));
        return;
      }
      if (response.type === 'response') {
        resolve(response.body);
      } else if (response.type === 'error') {
        console.error('[trezor.js] [chrome-messages] Error received', response);
        reject(new Error(response.message));
      } else {
        console.error('[trezor.js] [chrome-messages] Unknown response type ', JSON.stringify(response.type));
        reject(new Error('Unknown response type ' + JSON.stringify(response.type)));
      }
    };

    if (chrome.runtime.id === extensionId) {
      // extension sending to itself
      // (only for including trezor.js in the management part of the extension)
      chrome.runtime.sendMessage(message, {}, callback);
    } else {
      // either another extension, or not sent from extension at all
      // (this will be run most probably)
      chrome.runtime.sendMessage(extensionId, message, {}, callback);
    }
  });
}