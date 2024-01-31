export default {
  AES: {
    encrypt: jest.fn((str) => "encrypted" + str),
    decrypt: jest.fn(
      (str) =>
        "decrypted" +
        (str.includes("encrypted") ? str.split("encrypted")[1] : str),
    ),
  },
  enc: {
    Utf8: "utf-8",
  },
};
