if (typeof Buffer === "undefined") global.Buffer = require("buffer").Buffer;

// The `buffer` polyfill only re-applies the Buffer prototype in `slice`, so
// `subarray` hands back a plain Uint8Array here. bitcoinjs-lib rejects those
// ("expected property ... of type ?Buffer, got Uint8Array") and `Buffer.equals`
// throws on them, which breaks every taproot code path. Restore the prototype
// the same way `slice` does.
const bufferSubarray = Buffer.prototype.subarray;
Buffer.prototype.subarray = function subarray(...args) {
  const result = bufferSubarray.apply(this, args);
  Object.setPrototypeOf(result, Buffer.prototype);
  return result;
};
if (typeof __dirname === "undefined") global.__dirname = "/";
if (typeof __filename === "undefined") global.__filename = "";
if (typeof process === "undefined") {
  global.process = require("process");
} else {
  const bProcess = require("process");
  for (const p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}

process.browser = false;
