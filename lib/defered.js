"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.resolveTimeoutPromise = resolveTimeoutPromise;
exports.rejectTimeoutPromise = rejectTimeoutPromise;
function create() {
  var localResolve = function localResolve(t) {};
  var localReject = function localReject(e) {};

  var promise = new Promise(function (resolve, reject) {
    localResolve = resolve;
    localReject = reject;
  });
  var rejectingPromise = promise.then(function () {
    throw new Error("Promise is always rejecting");
  });
  rejectingPromise.catch(function () {});

  return {
    resolve: localResolve,
    reject: localReject,
    promise: promise,
    rejectingPromise: rejectingPromise
  };
}

function resolveTimeoutPromise(delay, result) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(result);
    }, delay);
  });
}

function rejectTimeoutPromise(delay, error) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(error);
    }, delay);
  });
}