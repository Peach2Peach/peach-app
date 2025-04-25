import {
  revolutData,
  validSEPAData,
  validSEPADataHashes,
} from "../../../../../tests/unit/data/paymentData";
import { useConfigStore } from "../../../configStore/configStore";
import { useOfferPreferences } from "../../../offerPreferenes";
import { defaultPreferences } from "../../../offerPreferenes/useOfferPreferences";
import { usePaymentDataStore } from "../../../usePaymentDataStore";
import { migrateSettings } from "./migrateSettings";

describe("migrateSettings", () => {
  beforeEach(() => {
    useOfferPreferences.setState(defaultPreferences);
    usePaymentDataStore.getState().reset();
    useConfigStore.getState().setPaymentMethods([
      {
        id: "sepa",
        anonymous: false,
        currencies: ["EUR", "CHF"],
        fields: { mandatory: [[["iban", "bic"]]], optional: ["reference"] },
      },
    ]);
  });
  it("should migrate from version 0", () => {
    const persistedState = {
      lastBackupDate: "2021-07-12T13:00:00.000Z",
      preferredPaymentMethods: {
        sepa: validSEPAData.id,
        revolut: revolutData.id,
      },
      premium: 1,
      minBuyAmount: 100,
      maxBuyAmount: 1000,
      sellAmount: 100,
    };
    usePaymentDataStore.getState().addPaymentData(validSEPAData);
    const migratedState = migrateSettings(persistedState, 0);
    expect(migratedState).toEqual({
      analyticsPopupSeen: false,
      appVersion: undefined,
      country: undefined,
      derivationPath: undefined,
      displayCurrency: undefined,
      enableAnalytics: false,
      fcmToken: undefined,
      feeRate: undefined,
      lastFileBackupDate: "2021-07-12T13:00:00.000Z",
      lastSeedBackupDate: undefined,
      locale: undefined,
      nodeURL: undefined,
      payoutAddress: undefined,
      payoutAddressLabel: undefined,
      payoutAddressSignature: undefined,
      payoutToPeachWallet: true,
      peachWalletActive: undefined,
      pgpPublished: undefined,
      refundToPeachWallet: true,
      returnAddress: undefined,
      shouldShowBackupOverlay: undefined,
      showBackupReminder: undefined,
      usedReferralCode: undefined,
    });
    expect(useOfferPreferences.getState()).toEqual(
      expect.objectContaining({
        buyAmountRange: [
          persistedState.minBuyAmount,
          persistedState.maxBuyAmount,
        ],
        meansOfPayment: {
          EUR: ["sepa"],
        },
        originalPaymentData: [validSEPAData],
        paymentData: {
          sepa: {
            country: undefined,
            hashes: validSEPADataHashes,
          },
        },
        preferredPaymentMethods: {
          sepa: validSEPAData.id,
        },
        premium: 1,
        sellAmount: persistedState.sellAmount,
      }),
    );
  });

  it("should migrate from version 1", () => {
    const persistedState = {
      meansOfPayment: {
        EUR: ["sepa"],
      },
      preferredPaymentMethods: {
        sepa: validSEPAData.id,
        revolut: revolutData.id,
      },
      premium: 1,
      minBuyAmount: 100,
      maxBuyAmount: 1000,
      sellAmount: 100,
    };
    usePaymentDataStore.getState().addPaymentData(validSEPAData);
    const migratedState = migrateSettings(persistedState, 1);
    expect(migratedState).toEqual({
      analyticsPopupSeen: false,
      appVersion: undefined,
      country: undefined,
      derivationPath: undefined,
      displayCurrency: undefined,
      enableAnalytics: false,
      fcmToken: undefined,
      feeRate: undefined,
      lastFileBackupDate: undefined,
      lastSeedBackupDate: undefined,
      locale: undefined,
      nodeURL: undefined,
      payoutAddress: undefined,
      payoutAddressLabel: undefined,
      payoutAddressSignature: undefined,
      payoutToPeachWallet: true,
      peachWalletActive: undefined,
      pgpPublished: undefined,
      refundToPeachWallet: true,
      returnAddress: undefined,
      shouldShowBackupOverlay: undefined,
      showBackupReminder: undefined,
      usedReferralCode: undefined,
    });
    expect(useOfferPreferences.getState()).toEqual(
      expect.objectContaining({
        buyAmountRange: [
          persistedState.minBuyAmount,
          persistedState.maxBuyAmount,
        ],
        meansOfPayment: {
          EUR: ["sepa"],
        },
        originalPaymentData: [validSEPAData],
        paymentData: {
          sepa: {
            country: undefined,
            hashes: validSEPADataHashes,
          },
        },
        preferredPaymentMethods: {
          sepa: validSEPAData.id,
        },
        premium: 1,
        sellAmount: 100,
      }),
    );
  });

  it("should migrate from version 2", () => {
    const persistedState = {
      appVersion: "1.0.0",
      analyticsPopupSeen: true,
      enableAnalytics: true,
      locale: "en",
      returnAddress: "0x123456789",
      payoutAddress: "0x123456789",
      payoutAddressLabel: "My address",
      payoutAddressSignature: "0x123456789",
      derivationPath: "m/44'/60'/0'/0",
      displayCurrency: "EUR",
      country: "DE",
      pgpPublished: true,
      fcmToken: "123456789",
      lastFileBackupDate: 123456789,
      lastSeedBackupDate: 123456789,
      showBackupReminder: true,
      shouldShowBackupOverlay: {
        completedBuyOffer: true,
        refundedEscrow: true,
        bitcoinReceived: true,
      },
      peachWalletActive: true,
      nodeURL: "https://node.url",
      feeRate: "fastestFee",
      usedReferralCode: true,
      lastBackupDate: 123456789,
    };
    const migratedState = migrateSettings(persistedState, 2);
    expect(migratedState).toEqual({
      ...persistedState,
      enableAnalytics: false,
      analyticsPopupSeen: false,
      payoutAddress: undefined,
      payoutAddressLabel: undefined,
      payoutAddressSignature: undefined,
      payoutToPeachWallet: false,
      peachWalletActive: true,
      pgpPublished: true,
      refundAddress: "0x123456789",
      refundAddressLabel: "My address",
      refundToPeachWallet: true,
      shouldShowBackupOverlay: true,
    });
    expect(migratedState).not.toHaveProperty("lastBackupDate");
  });
});
