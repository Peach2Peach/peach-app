import { act, render, renderHook } from "test-utils";
import { navigateMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { GlobalOverlay } from "../../../Overlay";
import { useOverlayEvents } from "./useOverlayEvents";

describe("useOverlayEvents", () => {
  it('should show the newBadge overlay on "user.badge.unlocked" event', async () => {
    const { result } = renderHook(useOverlayEvents);

    const badges = "fastTrader,superTrader";
    const data = { badges } as PNData;
    await act(() => {
      result.current["user.badge.unlocked"]?.(data);
    });

    const { getByText } = render(<GlobalOverlay />);
    expect(
      getByText(
        "Congrats, you unlocked the fast trader badge on your profile!",
      ),
    ).toBeTruthy();
  });
  it('should not navigate to newBadge screen on "user.badge.unlocked" event if no badges are provided', async () => {
    const { result } = renderHook(useOverlayEvents);

    const data = {} as PNData;
    await act(() => {
      result.current["user.badge.unlocked"]?.(data);
    });

    expect(navigateMock).not.toHaveBeenCalled();
  });
  it('should navigate to offerPublished screen on "offer.escrowFunded" event', async () => {
    const { result } = renderHook(useOverlayEvents);

    const offerId = "123";
    const data = { offerId } as PNData;
    await act(() => {
      result.current["offer.escrowFunded"]?.(data);
    });

    const { getByText } = render(<GlobalOverlay />);
    expect(getByText("offer published!")).toBeTruthy();
  });

  it('should not navigate to offerPublished screen on "offer.escrowFunded" event if offerId is not provided', async () => {
    const { result } = renderHook(useOverlayEvents);

    const data = {} as PNData;
    await act(() => {
      result.current["offer.escrowFunded"]?.(data);
    });

    expect(navigateMock).not.toHaveBeenCalled();
  });
  it('should navigate to paymentMade screen on "contract.paymentMade" event', async () => {
    const { result } = renderHook(useOverlayEvents);

    const contractId = "123-456";
    const data = { contractId } as PNData;
    await act(() => {
      result.current["contract.paymentMade"]?.(data);
    });

    const { getByText } = render(<GlobalOverlay />);
    expect(getByText("payment made!")).toBeTruthy();
  });

  it('should not navigate to offerPublished screen on "contract.paymentMade" event if offerId is not provided', async () => {
    const { result } = renderHook(useOverlayEvents);

    const data = {} as PNData;
    await act(() => {
      result.current["contract.paymentMade"]?.(data);
    });

    expect(navigateMock).not.toHaveBeenCalled();
  });
});
