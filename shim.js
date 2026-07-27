if (typeof Buffer === "undefined") global.Buffer = require("buffer").Buffer;
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

// Hermes has no TextEncoder. @brandonblack/musig's secp256k1 adapter needs one
// to hash BIP340/BIP327 tag strings. Tags are ASCII, but encode full UTF-8 so
// the polyfill stays correct for any other consumer.
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = class TextEncoder {
    get encoding() {
      return "utf-8";
    }

    encode(input = "") {
      const str = String(input);
      const bytes = [];
      for (let i = 0; i < str.length; i++) {
        let codePoint = str.codePointAt(i);
        if (codePoint > 0xffff) i++; // surrogate pair consumed
        if (codePoint < 0x80) {
          bytes.push(codePoint);
        } else if (codePoint < 0x800) {
          bytes.push(0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f));
        } else if (codePoint < 0x10000) {
          bytes.push(
            0xe0 | (codePoint >> 12),
            0x80 | ((codePoint >> 6) & 0x3f),
            0x80 | (codePoint & 0x3f),
          );
        } else {
          bytes.push(
            0xf0 | (codePoint >> 18),
            0x80 | ((codePoint >> 12) & 0x3f),
            0x80 | ((codePoint >> 6) & 0x3f),
            0x80 | (codePoint & 0x3f),
          );
        }
      }
      return Uint8Array.from(bytes);
    }
  };
}
