import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { shallow } from "zustand/shallow";
import { Badge } from "../../components/Badge";
import { TouchableIcon } from "../../components/TouchableIcon";
import { Button } from "../../components/buttons/Button";
import { Checkbox } from "../../components/inputs/Checkbox";
import { Toggle } from "../../components/inputs/Toggle";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { HelpPopup } from "../../popups/HelpPopup";
import { useConfigStore } from "../../store/configStore/configStore";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { interpolate } from "../../utils/math/interpolate";
import { keys } from "../../utils/object/keys";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { isValidPaymentData } from "../../utils/paymentMethod/isValidPaymentData";
import { signAndEncrypt } from "../../utils/pgp/signAndEncrypt";
import {
  CLIENT_RATING_RANGE,
  SERVER_RATING_RANGE,
} from "../settings/profile/profileOverview/Rating";
import { useSyncWallet } from "../wallet/hooks/useSyncWallet";
import { NetworkFeeInfo } from "./NetworkFeeInfo";
import { PayoutWalletSelector } from "./PayoutWalletSelector";
import { AmountSelectorComponent } from "./components/AmountSelectorComponent";
import { FundMultipleOffers } from "./components/FundMultipleOffers";
import { MarketInfo } from "./components/MarketInfo";
import { PreferenceMethods } from "./components/PreferenceMethods";
import { PreferenceScreen } from "./components/PreferenceScreen";
import { Section } from "./components/Section";
import { usePostBuyOffer } from "./utils/usePostBuyOffer";
import { useRestrictSatsAmount } from "./utils/useRestrictSatsAmount";
import { useTradingAmountLimits } from "./utils/useTradingAmountLimits";

export function CreateBuyOffer() {
  const [isSliding, setIsSliding] = useState(false);

  return (
    <PreferenceScreen
      isSliding={isSliding}
      button={
        <>
          <FundWithPeachWallet />
          <PublishOfferButton />
        </>
      }
    >
      <PreferenceMarketInfo />
      <AmountSelector setIsSliding={setIsSliding} />
      <PreferenceMethods type="buy" />
      <CompetingOfferStats />
      <Section.Container style={tw`items-start`}>
        <FundMultipleOffers />
      </Section.Container>
      <InstantTrade />
      <PreferenceWalletSelector />
      <NetworkFeeInfo type="buy" />
    </PreferenceScreen>
  );
}

function PreferenceWalletSelector() {
  const [
    payoutToPeachWallet,
    payoutAddress,
    payoutAddressLabel,
    setPayoutToPeachWallet,
  ] = useSettingsStore(
    (state) => [
      state.payoutToPeachWallet,
      state.payoutAddress,
      state.payoutAddressLabel,
      state.setPayoutToPeachWallet,
    ],
    shallow,
  );
  const navigation = useStackNavigation();

  const onExternalWalletPress = () => {
    if (payoutAddress) {
      setPayoutToPeachWallet(false);
    } else {
      navigation.navigate("payoutAddress");
    }
  };

  const onPeachWalletPress = () => setPayoutToPeachWallet(true);
  return (
    <PayoutWalletSelector
      peachWalletSelected={payoutToPeachWallet}
      customAddress={payoutAddress}
      customAddressLabel={payoutAddressLabel}
      onPeachWalletPress={onPeachWalletPress}
      onExternalWalletPress={onExternalWalletPress}
    />
  );
}
function PreferenceMarketInfo() {
  const offerPreferenes = useOfferPreferences(
    (state) => ({
      buyAmountRange: state.buyAmountRange,
      meansOfPayment: state.meansOfPayment,
      maxPremium: state.filter.buyOffer.shouldApplyMaxPremium
        ? state.filter.buyOffer.maxPremium ?? undefined
        : undefined,
      minReputation: interpolate(
        state.filter.buyOffer.minReputation ?? 0,
        CLIENT_RATING_RANGE,
        SERVER_RATING_RANGE,
      ),
    }),
    shallow,
  );
  return <MarketInfo type="sellOffers" {...offerPreferenes} />;
}

function AmountSelector({
  setIsSliding,
}: {
  setIsSliding: (isSliding: boolean) => void;
}) {
  const [buyAmountRange, setBuyAmountRange] = useOfferPreferences(
    (state) => [state.buyAmountRange, state.setBuyAmountRange],
    shallow,
  );

  return (
    <AmountSelectorComponent
      setIsSliding={setIsSliding}
      range={buyAmountRange}
      setRange={setBuyAmountRange}
    />
  );
}

function FundWithPeachWallet() {
  const [fundWithPeachWallet, setFundWithPeachWallet] = useOfferPreferences(
    (state) => [state.fundWithPeachWallet, state.setFundWithPeachWallet],
    shallow,
  );
  const toggle = () => setFundWithPeachWallet(!fundWithPeachWallet);
  return (
    <Section.Container style={tw`flex-row justify-between `}>
      <Checkbox
        checked={fundWithPeachWallet}
        onPress={toggle}
        style={tw`flex-1`}
      >
        fund with Peach wallet
      </Checkbox>
    </Section.Container>
  );
}

function PublishOfferButton() {
  const {
    amountRange,
    meansOfPayment,
    paymentData,
    maxPremium,
    minReputation,
    instantTrade,
    instantTradeCriteria,
    originalPaymentData,
    multi,
  } = useOfferPreferences(
    (state) => ({
      amountRange: state.buyAmountRange,
      meansOfPayment: state.meansOfPayment,
      paymentData: state.paymentData,
      maxPremium: state.filter.buyOffer.shouldApplyMaxPremium
        ? state.filter.buyOffer.maxPremium
        : null,
      minReputation: interpolate(
        state.filter.buyOffer.minReputation || 0,
        CLIENT_RATING_RANGE,
        SERVER_RATING_RANGE,
      ),
      instantTrade: state.instantTrade,
      instantTradeCriteria: state.instantTradeCriteria,
      originalPaymentData: state.originalPaymentData,
      multi: state.multi,
    }),
    shallow,
  );

  const methodsAreValid =
    originalPaymentData.length && originalPaymentData.every(isValidPaymentData);
  const [minAmount, maxAmount] = useTradingAmountLimits("buy");
  const restrictAmount = useRestrictSatsAmount("buy");
  const setBuyAmountRange = useOfferPreferences(
    (state) => state.setBuyAmountRange,
  );
  const rangeIsWithinLimits =
    amountRange[0] >= minAmount && amountRange[1] <= maxAmount;
  if (!rangeIsWithinLimits) {
    setBuyAmountRange([
      restrictAmount(amountRange[0]),
      restrictAmount(amountRange[1]),
    ]);
  }
  const rangeIsValid = rangeIsWithinLimits && amountRange[0] <= amountRange[1];
  const formValid = methodsAreValid && rangeIsValid;
  const payoutToPeachWallet = useSettingsStore(
    (state) => state.payoutToPeachWallet,
  );
  const { isLoading: isSyncingWallet } = useSyncWallet({
    enabled: payoutToPeachWallet,
  });

  const peachPGPPublicKey = useConfigStore((state) => state.peachPGPPublicKey);
  const getPaymentData = () => {
    if (instantTrade) {
      return keys(paymentData).reduce(
        async (accPromise: Promise<OfferPaymentData>, paymentMethod) => {
          const acc = await accPromise;
          const originalData = originalPaymentData.find(
            (e) => e.type === paymentMethod,
          );
          if (originalData) {
            const cleanedData = cleanPaymentData(originalData);
            const { encrypted, signature } = await signAndEncrypt(
              JSON.stringify(cleanedData),
              peachPGPPublicKey,
            );
            return {
              ...acc,
              [paymentMethod]: {
                ...paymentData[paymentMethod],
                encrypted,
                signature,
              },
            };
          }
          return acc;
        },
        Promise.resolve({}),
      );
    }
    return Promise.resolve(paymentData);
  };
  const { mutate: publishOffer, isPending: isPublishing } = usePostBuyOffer({
    amount: amountRange,
    meansOfPayment,
    maxPremium,
    minReputation,
    instantTradeCriteria: instantTrade ? instantTradeCriteria : undefined,
  });

  const onPress = async () => {
    if (!formValid || isSyncingWallet) return;
    if (multi !== undefined) {
      const paymentDataPromises = [];
      for (let i: number = 0; i < multi; i++) {
        paymentDataPromises.push(getPaymentData());
      }
      const paymentDataResults = await Promise.all(paymentDataPromises);
      paymentDataResults.forEach((paymentData) => publishOffer(paymentData));
    } else publishOffer(await getPaymentData());
  };
  const keyboardIsOpen = useKeyboard();
  if (keyboardIsOpen) return null;

  return (
    <Button
      style={tw`self-center px-5 py-3 bg-success-main min-w-166px`}
      onPress={onPress}
      disabled={!formValid || isSyncingWallet}
      loading={isPublishing || isSyncingWallet}
    >
      create offer
    </Button>
  );
}

function CompetingOfferStats() {
  const text = tw`text-center text-success-dark-2`;

  return (
    <Section.Container style={tw`gap-1 py-0`}>
      <PeachText style={text}>
        {i18n("offerPreferences.competingSellOffers", "x")}
      </PeachText>
      <PeachText style={text}>
        {i18n("offerPreferences.premiumOfCompletedTrades", "9")}
      </PeachText>
    </Section.Container>
  );
}

function InstantTrade() {
  const [
    enableInstantTrade,
    toggle,
    criteria,
    toggleMinTrades,
    toggleBadge,
    toggleMinReputation,
  ] = useOfferPreferences(
    (state) => [
      state.instantTrade,
      state.toggleInstantTrade,
      state.instantTradeCriteria,
      state.toggleMinTrades,
      state.toggleBadge,
      state.toggleMinReputation,
    ],
    shallow,
  );
  const [hasSeenPopup, setHasSeenPopup] = useOfferPreferences(
    (state) => [
      state.hasSeenInstantTradePopup,
      state.setHasSeenInstantTradePopup,
    ],
    shallow,
  );
  const setPopup = useSetPopup();
  const onHelpIconPress = () => {
    setPopup(<HelpPopup id="instantTradeBuy" />);
    setHasSeenPopup(true);
  };

  const onToggle = () => {
    if (!hasSeenPopup) {
      onHelpIconPress();
    }
    toggle();
  };

  return (
    <Section.Container style={tw`bg-success-mild-1`}>
      <View style={tw`flex-row items-center self-stretch justify-between`}>
        <Toggle onPress={onToggle} enabled={enableInstantTrade} green />
        <Section.Title>
          {i18n("offerPreferences.feature.instantTrade")}
        </Section.Title>
        <TouchableIcon
          id="helpCircle"
          iconColor={tw.color("info-light")}
          onPress={onHelpIconPress}
        />
      </View>
      {enableInstantTrade && (
        <>
          <Checkbox
            checked={criteria.minTrades !== 0}
            style={tw`self-stretch`}
            onPress={toggleMinTrades}
            green
          >
            {i18n("offerPreferences.filters.noNewUsers")}
          </Checkbox>
          <Checkbox
            checked={criteria.minReputation !== 0}
            style={tw`self-stretch`}
            onPress={toggleMinReputation}
            green
          >
            {i18n("offerPreferences.filters.minReputation", "4.5")}
          </Checkbox>
          <View style={tw`flex-row items-start self-stretch gap-10px`}>
            <TouchableOpacity onPress={() => toggleBadge("superTrader")}>
              <Badge
                badgeName="superTrader"
                isUnlocked={criteria.badges.includes("superTrader")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleBadge("fastTrader")}>
              <Badge
                badgeName="fastTrader"
                isUnlocked={criteria.badges.includes("fastTrader")}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </Section.Container>
  );
}
