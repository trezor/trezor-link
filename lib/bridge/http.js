'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var request = exports.request = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
    var fetchOptions, res, resText, resJson;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fetchOptions = {
              method: options.method,
              body: wrapBody(options.body)
            };

            // this is just for flowtype

            if (options.skipContentTypeHeader == null || options.skipContentTypeHeader === false) {
              fetchOptions = _extends({}, fetchOptions, {
                headers: {
                  'Content-Type': contentType(options.body == null ? '' : options.body)
                }
              });
            }
            console.log("BEFORE FETCH ", options.url);
            _context.next = 5;
            return _fetch(options.url, fetchOptions);

          case 5:
            res = _context.sent;

            console.log("AFTER FETCH ", options.url);
            _context.next = 9;
            return res.text();

          case 9:
            resText = _context.sent;

            console.log("AFTER AWAIT TEXT ", options.url);

            if (!res.ok) {
              _context.next = 15;
              break;
            }

            return _context.abrupt('return', parseResult(resText));

          case 15:
            resJson = parseResult(resText);

            if (!((typeof resJson === 'undefined' ? 'undefined' : _typeof(resJson)) === 'object' && resJson != null && resJson.error != null)) {
              _context.next = 20;
              break;
            }

            throw new Error(resJson.error);

          case 20:
            throw new Error(resText);

          case 21:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function request(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.setFetch = setFetch;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// slight hack to make Flow happy, but to allow Node to set its own fetch
// Request, RequestOptions and Response are built-in types of Flow for fetch API
var _fetch = typeof window === 'undefined' ? function () {
  return Promise.reject();
} : window.fetch;

function setFetch(fetch) {
  _fetch = fetch;
}

function contentType(body) {
  if (typeof body === 'string') {
    if (body === '') {
      return 'text/plain';
    }
    return 'application/octet-stream';
  } else {
    return 'application/json';
  }
}

function wrapBody(body) {
  if (typeof body === 'string') {
    return body;
  } else {
    return JSON.stringify(body);
  }
}

function parseResult(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}