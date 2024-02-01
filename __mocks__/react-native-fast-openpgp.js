import * as accountData from "../tests/unit/data/accountData";

export default {
  decrypt: jest.fn(),
  decryptSymmetric: jest.fn(),
  encrypt: jest.fn(),
  encryptSymmetric: jest.fn(),
  generate: jest.fn(() => accountData.account1.pgp),
  sign: jest.fn(),
  verify: jest.fn(),
};
