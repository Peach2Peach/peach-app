import { toMatchDiffSnapshot } from "snapshot-diff";
import { fireEvent, render, waitFor } from "test-utils";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { peachWallet, setPeachWallet } from "../../../utils/wallet/setWallet";
import { walletKeys } from "../hooks/useUTXOs";
import { AddressNavigation } from "./AddressNavigation";
expect.extend({ toMatchDiffSnapshot });

jest.useFakeTimers();

describe("AddressNavigation", () => {
  const index = 5;

  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
    if (!peachWallet) throw new Error("PeachWallet not set");
    peachWallet.initialized = true;
    queryClient.clear();
  });

  const getLastUnusedAddressMock = jest.fn().mockResolvedValue({
    address: "bcrt1qj9yqz9qzg9qz9qz9qz9qz9qz9qz9qz9qz9qz9",
    index: 5,
  });

  it("should render correctly", () => {
    if (!peachWallet) throw new Error("PeachWallet not set");
    peachWallet.getLastUnusedAddress = getLastUnusedAddressMock;
    const { toJSON } = render(
      <AddressNavigation index={1} setIndex={jest.fn()} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should update the index when the user clicks on the arrows", () => {
    if (!peachWallet) throw new Error("PeachWallet not set");
    peachWallet.getLastUnusedAddress = getLastUnusedAddressMock;
    const setIndexMock = jest.fn();
    const { UNSAFE_getByProps } = render(
      <AddressNavigation index={1} setIndex={setIndexMock} />,
    );
    const leftArrow = UNSAFE_getByProps({ id: "arrowLeftCircle" });
    const rightArrow = UNSAFE_getByProps({ id: "arrowRightCircle" });

    fireEvent.press(leftArrow);
    expect(setIndexMock).toHaveBeenCalledWith(0);

    fireEvent.press(rightArrow);
    expect(setIndexMock).toHaveBeenCalledWith(2);
  });
  it("should go to the last unused address when the user clicks on the chevrons", () => {
    if (!peachWallet) throw new Error("PeachWallet not set");
    peachWallet.getLastUnusedAddress = getLastUnusedAddressMock;
    const setIndexMock = jest.fn();
    const { UNSAFE_getByProps, rerender } = render(
      <AddressNavigation index={10} setIndex={setIndexMock} />,
    );
    const leftChevron = UNSAFE_getByProps({ id: "chevronsLeft" });

    fireEvent.press(leftChevron);
    expect(setIndexMock).toHaveBeenCalledWith(index);

    rerender(<AddressNavigation index={0} setIndex={setIndexMock} />);
    const rightChevron = UNSAFE_getByProps({ id: "chevronsRight" });
    fireEvent.press(rightChevron);
    expect(setIndexMock).toHaveBeenCalledWith(index);
  });
  it("should prefetch the next address when the user clicks on the right arrow", async () => {
    if (!peachWallet) throw new Error("PeachWallet not set");
    peachWallet.getLastUnusedAddress = getLastUnusedAddressMock;
    peachWallet.getAddressByIndex = jest.fn((i) =>
      Promise.resolve({ address: `address-${i}`, index: i, used: false }),
    );

    const { UNSAFE_getByProps } = render(
      <AddressNavigation index={1} setIndex={jest.fn()} />,
    );
    const rightArrow = UNSAFE_getByProps({ id: "arrowRightCircle" });
    fireEvent.press(rightArrow);
    const nextIndex = 3;

    await waitFor(() => {
      expect(
        queryClient.getQueryData(walletKeys.addressByIndex(nextIndex)),
      ).toStrictEqual({
        address: "address-3",
        index: nextIndex,
        used: false,
      });
    });
  });
  it("should prefetch the previous address when the user clicks on the left arrow", async () => {
    if (!peachWallet) throw new Error("PeachWallet not set");
    peachWallet.getLastUnusedAddress = getLastUnusedAddressMock;
    peachWallet.getAddressByIndex = jest.fn((i) =>
      Promise.resolve({ address: `address-${i}`, index: i, used: false }),
    );

    const { UNSAFE_getByProps } = render(
      <AddressNavigation index={3} setIndex={jest.fn()} />,
    );
    const leftArrow = UNSAFE_getByProps({ id: "arrowLeftCircle" });
    fireEvent.press(leftArrow);

    await waitFor(() => {
      expect(
        queryClient.getQueryData(walletKeys.addressByIndex(1)),
      ).toStrictEqual({
        address: "address-1",
        index: 1,
        used: false,
      });
    });
  });
  it("should only show the chevrons when the user is more than 2 addresses away from the last unused address", () => {
    if (!peachWallet) throw new Error("PeachWallet not set");
    peachWallet.getLastUnusedAddress = getLastUnusedAddressMock;
    const { toJSON, rerender } = render(
      <AddressNavigation index={5} setIndex={jest.fn()} />,
    );
    const withoutChevrons = toJSON();

    rerender(<AddressNavigation index={3} setIndex={jest.fn()} />);
    const withChevronsLeft = toJSON();

    rerender(<AddressNavigation index={7} setIndex={jest.fn()} />);
    const withChevronsRight = toJSON();

    expect(withoutChevrons).toMatchDiffSnapshot(withChevronsLeft);
    expect(withoutChevrons).toMatchDiffSnapshot(withChevronsRight);
  });
});
