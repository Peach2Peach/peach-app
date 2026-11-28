import { NETWORK } from "@env";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { getMainAccount } from "./getMainAccount";
import {
  getProvenPgpPublicKeys,
  getRecipientPgpPublicKeys,
} from "./getProvenPgpPublicKeys";
import { signMessageWithWallet } from "./signMessageWithWallet";

// a real key and proof, as returned by GET /v1/contract/{id}
const realUserId =
  "025b80418caa3c8728326fb4d8aea67fe0cd7614b8bdd496acd7d17729e6cd703b";
const realKey = {
  publicKey:
    "-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nmDMEAAAAABYJKwYBBAHaRw8BAQdAye12CJ2jnJi/aOGjfBXZwYJgo6vf/BQCJAFG\ndUHBEI+0AIiUBBMWCgA8FiEEQRATO1nqcAN3QzotMSKK1aZuPcsFAgAAAAACGwMF\nCwkIBwIDIgIBBhUKCQgLAgQWAgMBAh4HAheAAAoJEDEiitWmbj3LwC4BAJvTBbC6\nqBUO16gtZ+JbmDlDFDbEshxxjz/+yzJ+8XGCAP4vrJlq1vY2mg0E9mv/W48V7cBE\nC+BLb3vD0/UnxLwVDbg4BAAAAAASCisGAQQBl1UBBQEBB0C9gWUnDyWgk+2KdWnt\nLlUqvLVJzzOxz/pLQ+5Vje1XWwMBCAeIeAQYFgoAIBYhBEEQEztZ6nADd0M6LTEi\nitWmbj3LBQIAAAAAAhsMAAoJEDEiitWmbj3LXdIA/iC885ldWKsQHZpoGJ5G/NEv\nvkh7IdwsWEdheDnaq6/SAP4sWGLJGNew0tktIQwkBwKki5X4JaOQKTcnrUG6LY7Y\nCw==\n=Yppm\n-----END PGP PUBLIC KEY BLOCK-----\n",
  proof:
    "2cbe71c592a04bd083864979805545e487fbcd2ba207b3ae6faeb589833307a8511951e0c511d7c761e77946c80c66ce2246bf9fe010229b04ddb16f36e62e06",
};

const wallet = createTestWallet();
const userId = getMainAccount(wallet, NETWORK).publicKey.toString("hex");
const prove = (publicKey: string) => ({
  publicKey,
  proof: signMessageWithWallet(publicKey, wallet),
});

describe("getProvenPgpPublicKeys", () => {
  it("accepts a real key and proof from the server", () => {
    expect(
      getProvenPgpPublicKeys({ userId: realUserId, pgpPublicKeys: [realKey] }),
    ).toEqual([realKey]);
  });

  it("rejects a real proof when the key string was altered", () => {
    expect(
      getProvenPgpPublicKeys({
        userId: realUserId,
        pgpPublicKeys: [{ ...realKey, publicKey: realKey.publicKey.trim() }],
      }),
    ).toEqual([]);
  });

  it("rejects a real proof for another user", () => {
    expect(
      getProvenPgpPublicKeys({ userId, pgpPublicKeys: [realKey] }),
    ).toEqual([]);
  });

  it("keeps only the proven keys", () => {
    const proven = prove("provenKey");
    expect(
      getProvenPgpPublicKeys({
        userId,
        pgpPublicKeys: [
          proven,
          // a proof made for another key
          { publicKey: "injectedKey", proof: proven.proof },
          { publicKey: "noProof", proof: "" },
          { publicKey: "garbageProof", proof: "abcd" },
        ],
      }),
    ).toEqual([proven]);
  });
});

describe("getRecipientPgpPublicKeys", () => {
  it("joins only the proven keys of every user", () => {
    expect(
      getRecipientPgpPublicKeys([
        {
          id: userId,
          pgpPublicKeys: [
            prove("keyA"),
            { publicKey: "injected", proof: "abcd" },
          ],
        },
        { id: realUserId, pgpPublicKeys: [realKey] },
      ]),
    ).toBe(`keyA\n${realKey.publicKey}`);
  });

  it("throws when a user has no proven key", () => {
    expect(() =>
      getRecipientPgpPublicKeys([
        { id: userId, pgpPublicKeys: [prove("keyA")] },
        {
          id: realUserId,
          pgpPublicKeys: [{ publicKey: "injected", proof: "abcd" }],
        },
      ]),
    ).toThrow("NO_PROVEN_PGP_PUBLIC_KEY");
  });
});
