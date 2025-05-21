import { shallow } from "zustand/shallow";
import { Screen } from "../../components/Screen";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { useExpressBuyFilterPreferences } from "../../store/useExpressBuyFilterPreferences/useExpressBuyFilterPreferences";
import i18n from "../../utils/i18n";
import { AmountSelectorComponent } from "./components/AmountSelectorComponent";
import { useTradingAmountLimits } from "./utils/useTradingAmountLimits";

export function EditExpressBuyOfferFilters() {
  const [minAmountLimit, maxAmountLimit] = useTradingAmountLimits("buy");
  const { minAmount, maxAmount, setMinAmount, setMaxAmount } =
    useExpressBuyFilterPreferences(
      (state) => ({
        minAmount: state.minAmount,
        maxAmount: state.maxAmount,
        setMinAmount: state.setMinAmount,
        setMaxAmount: state.setMaxAmount,
      }),
      shallow,
    );
  const rangeIsWithinLimits =
    minAmount >= minAmountLimit && maxAmount <= maxAmountLimit;
  if (!rangeIsWithinLimits) {
    setMinAmount(minAmountLimit);
    setMaxAmount(maxAmountLimit);
  }

  return <ScreenContent />;
}

function ScreenContent() {
  useSettingsStore((state) => state.locale);

  return (
    <Screen header={i18n("offer.expressBuy.filter.edit.title")}>
      {/* <OfferMarketInfo /> */}
      {/* <OfferMethods /> */}
      <AmountSelector setIsSliding={() => {}} />
      {/* <CompetingOfferStats /> */}
      {/* <Filters /> */}
    </Screen>
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
  const {
    minAmount,
    maxAmount,
    maxPremium,
    setMinAmount,
    setMaxAmount,
    setMaxPremium,
  } = useExpressBuyFilterPreferences(
    (state) => ({
      minAmount: state.minAmount,
      maxAmount: state.maxAmount,
      maxPremium: state.maxPremium,
      setMinAmount: state.setMinAmount,
      setMaxAmount: state.setMaxAmount,
      setMaxPremium: state.setMaxPremium,
    }),
    shallow,
  );

  const handleAmountChange = (newAmount: [number, number]) => {
    setMinAmount(newAmount[0]);
    setMaxAmount(newAmount[1]);
  };

  return (
    <AmountSelectorComponent
      setIsSliding={setIsSliding}
      range={[minAmount, maxAmount]}
      setRange={handleAmountChange}
      maxPremium={maxPremium}
      setMaxPremium={setMaxPremium}
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
