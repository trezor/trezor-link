"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debugInOut = debugInOut;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*  weak */

function debugInOut(target, name, descriptor) {
  var original = descriptor.value;
  descriptor.value = function () {
    var debug = this.debug || name === "init" && arguments[0];
    var objName = this.name;
    var argsArr = Array.prototype.slice.call(arguments);
    if (debug) {
      var _console;

      (_console = console).log.apply(_console, ["[trezor-link] Calling " + objName + "." + name + "("].concat(_toConsumableArray(argsArr.map(function (f) {
        if (typeof f === "string") {
          if (f.length > 1000) {
            return f.substring(0, 1000) + "...";
          }
        }
        return f;
      })), [")"]));
    }
    // assuming that the function is a promise
    var resP = original.apply(this, arguments);
    return resP.then(function (res) {
      if (debug) {
        if (res == null) {
          console.log("[trezor-link] Done " + objName + "." + name);
        } else {
          console.log("[trezor-link] Done " + objName + "." + name + ", result ", res);
        }
      }
      return res;
    }, function (err) {
      if (debug) {
        console.error("[trezor-link] Error in " + objName + "." + name, err);
      }
      throw err;
    });
  };

  return descriptor;
}