import { isValidLiquidSignature } from "./isValidLiquidSignature";

describe("isValidLiquidSignature", () => {
  const address = "ert1qgt4a6p3z8nr2a9snvlmd7vl0vqytq2l7v2a9d2";
  const message =
    "I confirm that only I, peach03a9ea8d, control the address ert1qgt4a6p3z8nr2a9snvlmd7vl0vqytq2l7v2a9d2";
  const signature =
    "AkgwRQIhAN9nPRxEqB8SH5pbwoD8WZZq1md9l4kJ/FIGa7sS3PvdAiBw315LVlVnNLQCERvbkVx9WAC89sDe5jg3hm7ufU1tpgEhAr5fdDxsMbdileAzBBGjGrb9Ezbck/ePg+zLF9SyAC0w";

  it("returns true if release address + signature are valid", () => {
    expect(
      isValidLiquidSignature({ message, address, signature }),
    ).toBeTruthy();
  });
  it("returns false if release address + signature are not valid or missing", () => {
    const invalidMessageSignature =
      "IMIMxJ4/S1jbozu6licyV3U32mMJw40P936PCpM+2o5LG0SJCKhKdpsjZtFMj92IqdI09CnF9yDSkenUsEO3y/s=";
    const otherAddress = "ert1qu2nmgsdxc0tszsngksqe6nkzcuk67y0uugl2y2";
    const otherMessage =
      "I confirm that only I, peach03a9ea8d, control the address ert1qu2nmgsdxc0tszsngksqe6nkzcuk67y0uugl2y2";
    expect(
      isValidLiquidSignature({
        message,
        address: otherAddress,
        signature: invalidMessageSignature,
      }),
    ).toBeFalsy();
    expect(
      isValidLiquidSignature({ message, address, signature: "" }),
    ).toBeFalsy();
    expect(
      isValidLiquidSignature({ message, address: otherAddress, signature }),
    ).toBeFalsy();
    expect(
      isValidLiquidSignature({ message: otherMessage, address, signature }),
    ).toBeFalsy();
  });
});
