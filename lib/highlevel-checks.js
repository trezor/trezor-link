'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = info;
exports.version = version;
exports.devices = devices;
exports.acquire = acquire;
exports.call = call;
function info(res) {
  if (typeof res !== 'object' || res == null) {
    throw new Error('Wrong result type.');
  }
  var version = res.version;
  if (typeof version !== 'string') {
    throw new Error('Wrong result type.');
  }
  var configured = !!res.configured;
  return { version: version, configured: configured };
}

// input checks for high-level transports

function version(version) {
  if (typeof version !== 'string') {
    throw new Error('Wrong result type.');
  }
  return version.trim();
}

function devices(res) {
  if (typeof res !== 'object') {
    throw new Error('Wrong result type.');
  }
  if (!(res instanceof Array)) {
    throw new Error('Wrong result type.');
  }
  return res.map(function (o) {
    if (typeof o !== 'object' || o == null) {
      throw new Error('Wrong result type.');
    }
    var path = o.path;
    if (typeof path !== 'number' && typeof path !== 'string') {
      throw new Error('Wrong result type.');
    }
    var pathS = path.toString();
    var session = o.session;
    if (session == null) {
      return {
        path: pathS,
        session: null,
        product: o.product,
        vendor: o.vendor
      };
    } else {
      if (typeof session !== 'number' && typeof session !== 'string') {
        throw new Error('Wrong result type.');
      }
      return {
        path: pathS,
        session: session.toString(),
        product: o.product,
        vendor: o.vendor
      };
    }
  });
}

function acquire(res) {
  if (typeof res !== 'object' || res == null) {
    throw new Error('Wrong result type.');
  }
  var session = res.session;
  if (typeof session !== 'string' && typeof session !== 'number') {
    throw new Error('Wrong result type.');
  }
  return session.toString();
}

function call(res) {
  if (typeof res !== 'object' || res == null) {
    throw new Error('Wrong result type.');
  }
  var type = res.type;
  if (typeof type !== 'string') {
    throw new Error('Wrong result type.');
  }
  var message = res.message;
  if (typeof message !== 'object' || message == null) {
    throw new Error('Wrong result type.');
  }
  return { type: type, message: message };
}