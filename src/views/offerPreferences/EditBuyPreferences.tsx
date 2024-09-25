import { useQueryClient } from "@tanstack/react-query";
import { createContext, memo, useContext, useReducer, useState } from "react";
import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { premiumBounds } from "../../components/PremiumInput";
import { PremiumTextInput } from "../../components/PremiumTextInput";
import { Screen } from "../../components/Screen";
import { TouchableIcon } from "../../components/TouchableIcon";
import { Checkbox } from "../../components/inputs/Checkbox";
import { MeansOfPayment } from "../../components/offer/MeansOfPayment";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { PatchBuyOfferData, usePatchBuyOffer } from "../../hooks/usePatchOffer";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useIsMyAddress } from "../../hooks/wallet/useIsMyAddress";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { getMessageToSignForAddress } from "../../utils/account/getMessageToSignForAddress";
import i18n from "../../utils/i18n";
import { interpolate } from "../../utils/math/interpolate";
import { round } from "../../utils/math/round";
import { hasMopsConfigured } from "../../utils/offer/hasMopsConfigured";
import { isBuyOffer } from "../../utils/offer/isBuyOffer";
import { cutOffAddress } from "../../utils/string/cutOffAddress";
import { isValidBitcoinSignature } from "../../utils/validation/isValidBitcoinSignature";
import { getNetwork } from "../../utils/wallet/getNetwork";
import { peachWallet } from "../../utils/wallet/setWallet";
import { usePatchReleaseAddress } from "../contract/components/usePatchReleaseAddress";
import { LoadingScreen } from "../loading/LoadingScreen";
import { matchesKeys } from "../search/hooks/useOfferMatches";
import {
  CLIENT_RATING_RANGE,
  SERVER_RATING_RANGE,
} from "../settings/profile/profileOverview/Rating";
import { PayoutWalletSelector } from "./PayoutWalletSelector";
import { ShowOffersButton } from "./ShowOffersButton";
import { AmountSelectorComponent } from "./components/AmountSelectorComponent";
import { BuyBitcoinHeader } from "./components/BuyBitcoinHeader";
import { FilterContainer } from "./components/FilterContainer";
import { MIN_REPUTATION_FILTER } from "./components/MIN_REPUTATION_FILTER";
import { MarketInfo } from "./components/MarketInfo";
import { PreferenceScreen } from "./components/PreferenceScreen";
import { Section } from "./components/Section";
import { useTradingAmountLimits } from "./utils/useTradingAmountLimits";

type Preferences = Pick<
  BuyOffer,
  "amount" | "maxPremium" | "minReputation" | "meansOfPayment"
>;

type PreferenceAction =
  | { type: "amount_changed"; amount: BuyOffer["amount"] }
  | { type: "premium_changed"; premium: BuyOffer["maxPremium"] }
  | { type: "reputation_toggled" }
  | { type: "max_premium_toggled" };
const PreferenceContext = createContext<
  [Preferences, React.Dispatch<PreferenceAction>] | null
>(null);
const usePreferenceContext = () => {
  const context = useContext(PreferenceContext);
  if (!context) {
    throw new Error(
      "usePreferenceContext must be used within a PreferenceContextProvider",
    );
  }
  return context;
};

function offerReducer(state: Preferences, action: PreferenceAction) {
  switch (action.type) {
    case "amount_changed": {
      return { ...state, amount: action.amount };
    }
    case "premium_changed": {
      return { ...state, maxPremium: action.premium };
    }
    case "reputation_toggled": {
      return {
        ...state,
        minReputation:
          state.minReputation === MIN_REPUTATION_FILTER
            ? null
            : MIN_REPUTATION_FILTER,
      };
    }
    case "max_premium_toggled": {
      return { ...state, maxPremium: state.maxPremium === null ? 0 : null };
    }
    default: {
      return state;
    }
  }
}

export function EditBuyPreferences() {
  const { offerId } = useRoute<"editBuyPreferences">().params;
  const { offer, isLoading } = useOfferDetail(offerId);

  if (isLoading || !offer) return <LoadingScreen />;
  if (!isBuyOffer(offer)) throw new Error("Offer is not a buy offer");

  return <ScreenContent offer={offer} />;
}

function initializer(offer: BuyOffer) {
  const minReputation =
    typeof offer?.minReputation === "number"
      ? interpolate(
          offer.minReputation,
          SERVER_RATING_RANGE,
          CLIENT_RATING_RANGE,
        )
      : null;
  const maxPremium = offer?.maxPremium ?? null;
  const { amount, meansOfPayment } = offer;
  return { amount, meansOfPayment, minReputation, maxPremium };
}

function ScreenContent({ offer }: { offer: BuyOffer }) {
  const [isSliding, setIsSliding] = useState(false);
  const reducer = useReducer(offerReducer, offer, initializer);
  return (
    <PreferenceContext.Provider value={reducer}>
      <Screen header={<BuyBitcoinHeader />}>
        <PreferenceScreen isSliding={isSliding} button={<PatchOfferButton />}>
          <OfferMarketInfo />
          <OfferMethods />
          <AmountSelector setIsSliding={setIsSliding} />
          <Filters />
          <OfferWalletSelector
            offerId={offer.id}
            releaseAddress={offer.releaseAddress}
          />
        </PreferenceScreen>
      </Screen>
    </PreferenceContext.Provider>
  );
}

function OfferWalletSelector({
  offerId,
  releaseAddress,
}: {
  offerId: string;
  releaseAddress: string;
}) {
  const navigation = useStackNavigation();
  const [
    payoutAddress,
    payoutAddressLabel,
    messageSignature,
    setPayoutToPeachWallet,
  ] = useSettingsStore(
    (state) => [
      state.payoutAddress,
      state.payoutAddressLabel,
      state.payoutAddressSignature,
      state.setPayoutToPeachWallet,
    ],
    shallow,
  );
  const addressIsInPeachWallet = useIsMyAddress(releaseAddress);
  const { mutate: patchPayoutAddress } = usePatchReleaseAddress(offerId);

  const customAddress =
    addressIsInPeachWallet === false ? releaseAddress : payoutAddress;
  const customAddressLabel =
    releaseAddress === payoutAddress
      ? payoutAddressLabel
      : addressIsInPeachWallet === false
        ? cutOffAddress(releaseAddress)
        : "";

  const publicKey = useAccountStore((state) => state.account.publicKey);
  const onPeachWalletPress = async () => {
    if (addressIsInPeachWallet) return;
    if (!peachWallet) throw new Error("Peach wallet not defined");
    const { address: peachWalletAddress, index } =
      await peachWallet.getAddress();
    const message = getMessageToSignForAddress(publicKey, peachWalletAddress);
    const signature = peachWallet.signMessage(message, index);
    patchPayoutAddress(
      { releaseAddress: peachWalletAddress, messageSignature: signature },
      { onSuccess: () => setPayoutToPeachWallet(true) },
    );
  };

  const onExternalWalletPress = () => {
    if (!addressIsInPeachWallet) return;
    if (!payoutAddress || !payoutAddressLabel) {
      navigation.navigate("patchPayoutAddress", { offerId });
      return;
    }
    const message = getMessageToSignForAddress(publicKey, payoutAddress);
    if (
      !messageSignature ||
      !isValidBitcoinSignature({
        message,
        address: payoutAddress,
        signature: messageSignature,
        network: getNetwork(),
      })
    ) {
      navigation.navigate("signMessage", {
        address: payoutAddress,
        addressLabel: payoutAddressLabel,
        offerId,
      });
    } else {
      patchPayoutAddress({ releaseAddress: payoutAddress, messageSignature });
    }
  };

  return (
    <PayoutWalletSelector
      peachWalletSelected={!!addressIsInPeachWallet}
      customAddress={customAddress}
      customAddressLabel={customAddressLabel}
      onPeachWalletPress={onPeachWalletPress}
      onExternalWalletPress={onExternalWalletPress}
    />
  );
}

function OfferMarketInfo() {
  const [{ amount, maxPremium, minReputation, meansOfPayment }] =
    usePreferenceContext();
  return (
    <MarketInfo
      type={"sellOffers"}
      meansOfPayment={meansOfPayment}
      maxPremium={maxPremium ?? undefined}
      minReputation={
        typeof minReputation === "number"
          ? interpolate(minReputation, CLIENT_RATING_RANGE, SERVER_RATING_RANGE)
          : undefined
      }
      buyAmountRange={amount}
    />
  );
}

function OfferMethods() {
  const [{ meansOfPayment }] = usePreferenceContext();
  const hasSelectedMethods = hasMopsConfigured(meansOfPayment);
  const backgroundColor = tw.color("success-mild-1");
  return (
    <Section.Container style={{ backgroundColor }}>
      {hasSelectedMethods ? (
        <MeansOfPayment
          meansOfPayment={meansOfPayment}
          style={tw`self-stretch flex-1`}
        />
      ) : (
        <Section.Title>
          {i18n("offerPreferences.allPaymentMethods")}
        </Section.Title>
      )}
    </Section.Container>
  );
}

function AmountSelector({
  setIsSliding,
}: {
  setIsSliding: (isSliding: boolean) => void;
}) {
  const [{ amount }, dispatch] = usePreferenceContext();
  const handleAmountChange = (newAmount: [number, number]) =>
    dispatch({ type: "amount_changed", amount: newAmount });

  return (
    <AmountSelectorComponent
      setIsSliding={setIsSliding}
      range={amount}
      setRange={handleAmountChange}
    />
  );
}

const ReputationFilter = memo(() => {
  const [{ minReputation }, dispatch] = usePreferenceContext();
  const handleToggle = () => dispatch({ type: "reputation_toggled" });

  return (
    <Checkbox
      green
      checked={minReputation === MIN_REPUTATION_FILTER}
      onPress={handleToggle}
      style={tw`self-stretch`}
    >
      {i18n("offerPreferences.filters.minReputation", "4.5")}
    </Checkbox>
  );
});

const defaultMaxPremium = 0;
const MaxPremiumFilter = memo(() => {
  const [{ maxPremium }, dispatch] = usePreferenceContext();

  function handlePremiumChange(newPremium: number) {
    dispatch({
      type: "premium_changed",
      premium: newPremium,
    });
  }

  function handleToggle() {
    dispatch({
      type: "max_premium_toggled",
    });
  }

  const onCheckboxPress = () => {
    handleToggle();
    if (maxPremium === null) {
      handlePremiumChange(defaultMaxPremium);
    }
  };
  const onPlusCirclePress = () => {
    handlePremiumChange(
      Math.min(
        round((maxPremium || defaultMaxPremium) + 1, 2),
        premiumBounds.max,
      ),
    );
  };

  const onMinusCirclePress = () => {
    handlePremiumChange(
      Math.max(
        round((maxPremium || defaultMaxPremium) - 1, 2),
        premiumBounds.min,
      ),
    );
  };

  const iconColor = tw.color("success-main");

  return (
    <View style={tw`flex-row items-center self-stretch justify-between`}>
      <Checkbox green checked={maxPremium !== null} onPress={onCheckboxPress}>
        {i18n("offerPreferences.filters.maxPremium")}
      </Checkbox>
      <View style={tw`flex-row items-center gap-10px`}>
        <TouchableIcon
          id="minusCircle"
          iconColor={iconColor}
          onPress={onMinusCirclePress}
        />
        <PremiumTextInput
          premium={maxPremium || defaultMaxPremium}
          setPremium={handlePremiumChange}
        />
        <TouchableIcon
          id="plusCircle"
          iconColor={iconColor}
          onPress={onPlusCirclePress}
        />
      </View>
    </View>
  );
});

function Filters() {
  return (
    <FilterContainer
      filters={
        <>
          <MaxPremiumFilter />
          <ReputationFilter />
        </>
      }
    />
  );
}

function PatchOfferButton() {
  const [preferences] = usePreferenceContext();
  const { maxPremium } = preferences;
  const minReputation = interpolate(
    preferences.minReputation || 0,
    CLIENT_RATING_RANGE,
    SERVER_RATING_RANGE,
  );

  const { offerId } = useRoute<"editBuyPreferences">().params;
  const { offer } = useOfferDetail(offerId);
  if (offer && !isBuyOffer(offer)) throw new Error("Offer is not a buy offer");

  const rangeHasChanged =
    offer?.amount[0] !== preferences.amount[0] ||
    offer?.amount[1] !== preferences.amount[1];
  const [min, max] = useTradingAmountLimits("buy");
  const rangeIsWithinLimits =
    preferences.amount[0] >= min && preferences.amount[1] <= max;

  const rangeIsValid =
    preferences.amount[0] <= preferences.amount[1] &&
    (!rangeHasChanged || rangeIsWithinLimits);
  const formValid = rangeIsValid;

  const { mutate: patchOffer, isPending: isPatching } = usePatchBuyOffer();
  const navigation = useStackNavigation();
  const queryClient = useQueryClient();
  const onPress = () => {
    const newData: PatchBuyOfferData = { maxPremium, minReputation };
    if (rangeHasChanged) {
      newData.amount = preferences.amount;
    }
    patchOffer(
      { offerId, newData },
      {
        onSuccess: () => navigation.goBack(),
        onSettled: () =>
          queryClient.invalidateQueries({
            queryKey: matchesKeys.matchesForOffer(offerId),
          }),
      },
    );
  };
  return (
    <ShowOffersButton
      onPress={onPress}
      disabled={!formValid}
      loading={isPatching}
    />
  );
}
