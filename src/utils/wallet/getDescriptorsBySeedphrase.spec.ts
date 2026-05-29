// @ts-nocheck
import { Descriptor } from "bdk-rn";
import { getDescriptorsBySeedphrase } from "./getDescriptorsBySeedphrase";

jest.mock("./getDescriptorSecretKey");
const getDescriptorSecretKeyMock = jest.requireMock(
  "./getDescriptorSecretKey",
).getDescriptorSecretKey;

describe("getDescriptorsBySeedphrase", () => {
  const seedphrase = "mom mom mom mom mom mom mom mom mom mom mom mom";
  const network = "bitcoin";
  it("should return external and internal descriptors", () => {
    getDescriptorSecretKeyMock.mockReturnValue({});
    const newBip84Spy = jest
      .spyOn(Descriptor, "newBip84")
      .mockImplementation(() => ({}) as any);
    const { externalDescriptor, internalDescriptor } =
      getDescriptorsBySeedphrase({ seedphrase, network });
    expect(externalDescriptor).toBeDefined();
    expect(internalDescriptor).toBeDefined();
    expect(newBip84Spy).toHaveBeenCalled();
  });
});
