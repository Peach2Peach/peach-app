import { networks } from "liquidjs-lib";
import { act, renderHook } from "test-utils";
import { OfferPaymentData } from "../../../../peach-api/src/@types/offer";
import { MeansOfPayment } from "../../../../peach-api/src/@types/payment";
import { account1 } from "../../../../tests/unit/data/accountData";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { useAccountStore } from "../../../utils/account/account";
import { peachAPI } from "../../../utils/peachAPI";
import { PeachLiquidJSWallet } from "../../../utils/wallet/PeachLiquidJSWallet";
import { setLiquidWallet } from "../../../utils/wallet/setWallet";
import { usePostBuyOffer } from "./usePostBuyOffer";

jest.useFakeTimers();

const postBuyOfferSpy = jest.spyOn(peachAPI.private.offer, "postBuyOffer");

describe("usePostBuyOffer", () => {
  const amount: [number, number] = [100000, 1000000];
  const meansOfPayment: MeansOfPayment = { EUR: ["revolut"] };
  const paymentData: OfferPaymentData = { revolut: { hashes: ["hash"] } };
  const maxPremium = 12;
  const minReputation = 1;
  beforeEach(() => {
    setLiquidWallet(
      new PeachLiquidJSWallet({
        wallet: createTestWallet(),
        network: networks.regtest,
      }),
    );
  });
  it("should post a buy offer", async () => {
    useSettingsStore.getState().setPayoutToPeachWallet(true);
    useSettingsStore
      .getState()
      .setPayoutAddress("bcrt1qj8f2z28wvqtamu7khkmhw7z025gdwr7e7n6e2n");
    useSettingsStore
      .getState()
      .setPayoutAddressSignature(
        "H2i3dzh/dYWjpsRJmrl1C9ZKMkg1PitsM/zdh7RIQ6PrLTaYa4Wmm0fKRsLAhaDIqwg1C51StxG5JMj3sF6Yqkc=",
      );
    useAccountStore
      .getState()
      .setAccount({ ...account1, publicKey: "033110c3" });

    const { result } = renderHook(usePostBuyOffer, {
      initialProps: {
        amount,
        meansOfPayment,
        paymentData,
        maxPremium,
        minReputation,
      },
    });
    await act(async () => {
      await result.current.mutate();
    });
    expect(postBuyOfferSpy).toHaveBeenCalledWith({
      amount: [100000, 1000000],
      maxPremium: 12,
      meansOfPayment: {
        EUR: ["revolut"],
      },
      message:
        "I confirm that only I, peach033110c3, control the address bcrt1qj8f2z28wvqtamu7khkmhw7z025gdwr7e7n6e2n",
      messageLiquid:
        "I confirm that only I, peach033110c3, control the address ert1qvd76ucxafly399qewresqmj8ud0f639fep0raj",
      messageSignature:
        "H2i3dzh/dYWjpsRJmrl1C9ZKMkg1PitsM/zdh7RIQ6PrLTaYa4Wmm0fKRsLAhaDIqwg1C51StxG5JMj3sF6Yqkc=",
      messageSignatureLiquid:
        "AkgwRQIhAOo12C78D4/BUXAsyZelXPSIAU4XzbgUtIAcqQDxNxPXAiBEDa+i+EucRviEZV6Y/h3+WuJ9AjeGphqlmVZAbjkVZAEhAq3a8m+TRA3erLfC62GNKPOr+lblNlMt8mJAwMLA+IdU",
      minReputation: 1,
      paymentData: {
        revolut: {
          hashes: ["hash"],
        },
      },
      releaseAddress: "bcrt1qj8f2z28wvqtamu7khkmhw7z025gdwr7e7n6e2n",
      releaseAddressLiquid: "ert1qvd76ucxafly399qewresqmj8ud0f639fep0raj",
      type: "bid",
    });
    jest.runAllTimers();
  });
});
