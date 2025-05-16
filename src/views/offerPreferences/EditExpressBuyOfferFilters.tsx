import { createContext, useContext, useReducer, useState } from "react";
import { shallow } from "zustand/shallow";
import { Screen } from "../../components/Screen";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { useExpressBuyFilterPreferences } from "../../store/useExpressBuyFilterPreferences/useExpressBuyFilterPreferences";
import i18n from "../../utils/i18n";
import { ShowOffersButton } from "./ShowOffersButton";
import { AmountSelectorComponent } from "./components/AmountSelectorComponent";
import { PreferenceScreen } from "./components/PreferenceScreen";

interface Preferences {
  minAmount: number;
  maxAmount: number;
  maxPremium: number;
}

type PreferenceAction =
  | { type: "min_amount_changed"; minAmount: number }
  | { type: "max_amount_changed"; maxAmount: number }
  | { type: "max_premium_changed"; maxPremium: number };
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
    case "min_amount_changed": {
      return { ...state, minAmount: action.minAmount };
    }
    case "max_amount_changed": {
      return { ...state, maxAmount: action.maxAmount };
    }
    case "max_premium_changed": {
      return { ...state, maxPremium: action.maxPremium };
    }
    // case "reputation_toggled": {
    //   return {
    //     ...state,
    //     minReputation:
    //       state.minReputation === MIN_REPUTATION_FILTER
    //         ? null
    //         : MIN_REPUTATION_FILTER,
    //   };
    // }
    // case "max_premium_toggled": {
    //   return { ...state, maxPremium: state.maxPremium === null ? 0 : null };
    // }
    default: {
      return state;
    }
  }
}

export function EditExpressBuyOfferFilters() {
  return <ScreenContent />;
}

function ScreenContent() {
  useSettingsStore((state) => state.locale);
  const [isSliding, setIsSliding] = useState(false);

  const { minAmount, maxAmount, maxPremium } = useExpressBuyFilterPreferences(
    (state) => ({
      minAmount: state.minAmount,
      maxAmount: state.maxAmount,
      maxPremium: state.maxPremium,
    }),
    shallow,
  );

  const initialState: Preferences = {
    minAmount,
    maxAmount,
    maxPremium,
  };

  const reducer = useReducer(offerReducer, initialState);
  return (
    <PreferenceContext.Provider value={reducer}>
      <Screen header={i18n("EditExpressBuyOfferFilters")}>
        <PreferenceScreen isSliding={isSliding} button={<SaveFiltersButton />}>
          {/* <OfferMarketInfo /> */}
          {/* <OfferMethods /> */}
          <AmountSelector setIsSliding={setIsSliding} />
          {/* <CompetingOfferStats /> */}
          {/* <Filters /> */}
        </PreferenceScreen>
      </Screen>
    </PreferenceContext.Provider>
  );
}

// function OfferMarketInfo() {
//   const [{ amount, maxPremium, minReputation, meansOfPayment }] =
//     usePreferenceContext();
//   return (
//     <MarketInfo
//       type={"sellOffers"}
//       meansOfPayment={meansOfPayment}
//       maxPremium={maxPremium ?? undefined}
//       minReputation={
//         typeof minReputation === "number"
//           ? interpolate(minReputation, CLIENT_RATING_RANGE, SERVER_RATING_RANGE)
//           : undefined
//       }
//       buyAmountRange={amount}
//     />
//   );
// }

// function OfferMethods() {
//   const [{ meansOfPayment }] = usePreferenceContext();
//   const hasSelectedMethods = hasMopsConfigured(meansOfPayment);
//   const { isDarkMode } = useThemeStore();
//   const backgroundColor = isDarkMode
//     ? tw.color("card")
//     : tw.color("success-mild-1");
//   return (
//     <Section.Container style={{ backgroundColor }}>
//       {hasSelectedMethods ? (
//         <MeansOfPayment
//           meansOfPayment={meansOfPayment}
//           style={tw`self-stretch flex-1`}
//         />
//       ) : (
//         <Section.Title>
//           {i18n("offerPreferences.allPaymentMethods")}
//         </Section.Title>
//       )}
//     </Section.Container>
//   );
// }

function AmountSelector({
  setIsSliding,
}: {
  setIsSliding: (isSliding: boolean) => void;
}) {
  const [{ minAmount, maxAmount, maxPremium }, dispatch] =
    usePreferenceContext();

  const handleAmountChange = (newAmount: [number, number]) => {
    dispatch({ type: "min_amount_changed", minAmount: newAmount[0] });
    dispatch({ type: "max_amount_changed", maxAmount: newAmount[1] });
  };
  const handleMaxPremiumChange = (newMaxPremium: number) => {
    dispatch({ type: "max_premium_changed", maxPremium: newMaxPremium });
  };
  return (
    <AmountSelectorComponent
      setIsSliding={setIsSliding}
      range={[minAmount, maxAmount]}
      setRange={handleAmountChange}
      maxPremium={maxPremium}
      setMaxPremium={handleMaxPremiumChange}
      showCompetingOffers={false}
    />
  );
}

// const ReputationFilter = memo(() => {
//   const [{ minReputation }, dispatch] = usePreferenceContext();
//   const handleToggle = () => dispatch({ type: "reputation_toggled" });

//   return (
//     <Checkbox
//       green
//       checked={minReputation === MIN_REPUTATION_FILTER}
//       onPress={handleToggle}
//       style={tw`self-stretch`}
//     >
//       {i18n("offerPreferences.filters.minReputation", "4.5")}
//     </Checkbox>
//   );
// });

// const defaultMaxPremium = 0;
// const MaxPremiumFilter = memo(() => {
//   const [{ maxPremium }, dispatch] = usePreferenceContext();

//   function handlePremiumChange(newPremium: number) {
//     dispatch({
//       type: "premium_changed",
//       premium: newPremium,
//     });
//   }

//   function handleToggle() {
//     dispatch({
//       type: "max_premium_toggled",
//     });
//   }

//   const onCheckboxPress = () => {
//     handleToggle();
//     if (maxPremium === null) {
//       handlePremiumChange(defaultMaxPremium);
//     }
//   };
//   const onPlusCirclePress = () => {
//     handlePremiumChange(
//       Math.min(
//         round((maxPremium || defaultMaxPremium) + 1, 2),
//         premiumBounds.max,
//       ),
//     );
//   };

//   const onMinusCirclePress = () => {
//     handlePremiumChange(
//       Math.max(
//         round((maxPremium || defaultMaxPremium) - 1, 2),
//         premiumBounds.min,
//       ),
//     );
//   };

//   const iconColor = tw.color("success-main");

//   return (
//     <View style={tw`flex-row items-center self-stretch justify-between`}>
//       <Checkbox green checked={maxPremium !== null} onPress={onCheckboxPress}>
//         {i18n("offerPreferences.filters.maxPremium")}
//       </Checkbox>
//       <View style={tw`flex-row items-center gap-10px`}>
//         <TouchableIcon
//           id="minusCircle"
//           iconColor={iconColor}
//           onPress={onMinusCirclePress}
//         />
//         <PremiumTextInput
//           premium={maxPremium || defaultMaxPremium}
//           setPremium={handlePremiumChange}
//         />
//         <TouchableIcon
//           id="plusCircle"
//           iconColor={iconColor}
//           onPress={onPlusCirclePress}
//         />
//       </View>
//     </View>
//   );
// });

// function Filters() {
//   return (
//     <FilterContainer
//       filters={
//         <>
//           <MaxPremiumFilter />
//           <ReputationFilter />
//         </>
//       }
//     />
//   );
// }

function SaveFiltersButton() {
  const navigation = useStackNavigation();
  const onPress = () => {
    navigation.goBack();
  };

  return (
    <ShowOffersButton onPress={onPress} disabled={false} loading={false} />
  );
}
