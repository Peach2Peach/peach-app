import { useQuery } from "@tanstack/react-query";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { useBitcoinPrices } from "../hooks/useBitcoinPrices";
import { useIsMediumScreen } from "../hooks/useIsMediumScreen";
import {
  defaultPreferences,
  useOfferPreferences,
} from "../store/offerPreferenes/useOfferPreferences";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { round } from "../utils/math/round";
import { peachAPI } from "../utils/peachAPI";
import { thousands } from "../utils/string/thousands";
import { usePaymentMethods } from "../views/addPaymentMethod/usePaymentMethodInfo";
import { useTradingAmountLimits } from "../views/offerPreferences/utils/useTradingAmountLimits";
import { Drawer } from "./Drawer";
import { PeachScrollView } from "./PeachScrollView";
import { Section } from "./Section";
import { SelectionList } from "./SelectionList";
import { TouchableIcon } from "./TouchableIcon";
import { Button } from "./buttons/Button";
import { PeachText } from "./text/PeachText";
import { HorizontalLine } from "./ui/HorizontalLine";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type FilterSection =
  | "sortBy"
  | "paymentMethods"
  | "currencies"
  | "amount"
  | "price";

export function ExpressSellAdvancedFilters({ isOpen, onClose }: Props) {
  const [expandedSection, setExpandedSection] = useState<FilterSection | null>(
    null,
  );

  const toggleSection = (section: FilterSection) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const selectedPaymentMethods = useOfferPreferences(
    (state) => state.expressSellFilterByPaymentMethodList,
  );
  const selectedCurrencies = useOfferPreferences(
    (state) => state.expressSellFilterByCurrencyList,
  );

  const filterSections = [
    {
      id: "sortBy" as const,
      label: i18n("sortBy"),
      content: <SortByList />,
    },
    {
      id: "paymentMethods" as const,
      label: selectedPaymentMethods.length ? (
        <PeachText
          style={tw`text-base font-extrabold tracking-widest uppercase grow font-baloo`}
        >
          {i18n("settings.paymentMethods")}{" "}
          <PeachText
            style={tw`text-base font-normal text-info-main font-baloo`}
          >
            ({selectedPaymentMethods.length})
          </PeachText>
        </PeachText>
      ) : (
        i18n("settings.paymentMethods")
      ),
      content: <PaymentMethodsList />,
    },
    {
      id: "currencies" as const,
      label: selectedCurrencies.length ? (
        <PeachText
          style={tw`text-base font-extrabold tracking-widest uppercase grow font-baloo`}
        >
          {i18n("currencies")}{" "}
          <PeachText
            style={tw`text-base font-normal text-info-main font-baloo`}
          >
            ({selectedCurrencies.length})
          </PeachText>
        </PeachText>
      ) : (
        i18n("currencies")
      ),
      content: <CurrenciesList />,
    },
    {
      id: "amount" as const,
      label: i18n("amount"),
      content: <AmountSelection />,
    },
    { id: "price" as const, label: i18n("price"), content: <PriceSection /> },
  ];

  const HEADER_AND_PADDING = 120;
  const DRAWER_HEIGHT_LARGE = 600;
  const DRAWER_HEIGHT_SMALL = 450;
  const isMediumScreen = useIsMediumScreen();
  const DRAWER_HEIGHT = isMediumScreen
    ? DRAWER_HEIGHT_LARGE
    : DRAWER_HEIGHT_SMALL;
  const SCROLL_HEIGHT = DRAWER_HEIGHT - HEADER_AND_PADDING;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={i18n("advancedFilters")}>
      <>
        <HorizontalLine />
        <View style={tw`gap-4`}>
          <PeachScrollView
            style={{ height: SCROLL_HEIGHT }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`grow`}
            contentStyle={tw`grow`}
          >
            <View style={tw`gap-4 pt-4 grow`}>
              {filterSections.map(
                (section: {
                  id: FilterSection;
                  label: string | ReactNode;
                  content: ReactNode;
                }) => (
                  <Section
                    key={section.id}
                    section={section}
                    isExpanded={expandedSection === section.id}
                    toggleSection={toggleSection}
                  >
                    {section.content}
                  </Section>
                ),
              )}
            </View>
          </PeachScrollView>
          <ResetAllButton />
        </View>
      </>
    </Drawer>
  );
}

function SortByList() {
  const selectedSorter = useOfferPreferences(
    (state) => state.expressSellOffersSorter,
  );
  const setSorter = useOfferPreferences(
    (state) => state.setExpressSellOffersSorter,
  );
  const list = [
    "bestReputation",
    "highestAmount",
    "lowestAmount",
    "highestPremium",
  ] as const;

  const items = list.map((item) => ({
    text: (
      <PeachText style={tw`input-title`}>
        {i18n(`offer.sorting.${item}`)}
      </PeachText>
    ),
    onPress: () => setSorter(item),
    isSelected: selectedSorter === item,
  }));

  return <SelectionList type="radioButton" items={items} />;
}

function PaymentMethodsList() {
  const { data: paymentMethods } = usePaymentMethods();
  const selectedPaymentMethods = useOfferPreferences(
    (state) => state.expressSellFilterByPaymentMethodList,
  );
  const setExpressSellFilterByPaymentMethodList = useOfferPreferences(
    (state) => state.setExpressSellFilterByPaymentMethodList,
  );
  const onTogglePaymentMethod = useCallback(
    (paymentMethod: PaymentMethod) => {
      const isSelected = selectedPaymentMethods.some(
        (pm) => pm === paymentMethod,
      );
      if (isSelected) {
        setExpressSellFilterByPaymentMethodList(
          selectedPaymentMethods.filter((pm) => pm !== paymentMethod),
        );
      } else {
        setExpressSellFilterByPaymentMethodList([
          ...selectedPaymentMethods,
          paymentMethod,
        ]);
      }
    },
    [selectedPaymentMethods, setExpressSellFilterByPaymentMethodList],
  );

  const { data: buyOfferPaymentMethods } = useQuery({
    queryKey: ["peach069expressBuyOffers", "stats", "paymentMethods"],
    queryFn: async () => {
      const { result } = await peachAPI.private.peach069.getBuyOffers({});
      return result?.stats.paymentMethods;
    },
  });

  const items = useMemo(() => {
    if (!paymentMethods) return [];

    return paymentMethods
      .map((paymentMethod) => {
        const numberOfOffers = buyOfferPaymentMethods?.[paymentMethod.id] || 0;
        return {
          paymentMethod,
          numberOfOffers,
        };
      })
      .sort((a, b) => b.numberOfOffers - a.numberOfOffers) // Sort by offer count descending
      .map(({ paymentMethod, numberOfOffers }) => ({
        text: (
          <View style={tw`flex-row items-center gap-6px shrink`}>
            <PeachText style={tw`input-title shrink`}>
              {i18n(`paymentMethod.${paymentMethod.id}`)}
            </PeachText>
            <PeachText style={tw`body-m text-black-50 shrink`}>
              ({numberOfOffers} offer{numberOfOffers === 1 ? "" : "s"})
            </PeachText>
          </View>
        ),
        onPress: () => onTogglePaymentMethod(paymentMethod.id),
        isSelected: selectedPaymentMethods.some(
          (pm) => pm === paymentMethod.id,
        ),
      }));
  }, [
    paymentMethods,
    buyOfferPaymentMethods,
    selectedPaymentMethods,
    onTogglePaymentMethod,
  ]);

  if (!paymentMethods) return null;
  return <SelectionList type="checkbox" items={items} />;
}

function CurrenciesList() {
  const selectedCurrencies = useOfferPreferences(
    (state) => state.expressSellFilterByCurrencyList,
  );
  const setExpressSellFilterByCurrencyList = useOfferPreferences(
    (state) => state.setExpressSellFilterByCurrencyList,
  );

  const handleToggleCurrency = useCallback(
    (currency: Currency) => {
      const isSelected = selectedCurrencies.includes(currency);
      if (isSelected) {
        setExpressSellFilterByCurrencyList(
          selectedCurrencies.filter((c) => c !== currency),
        );
      } else {
        setExpressSellFilterByCurrencyList([...selectedCurrencies, currency]);
      }
    },
    [selectedCurrencies, setExpressSellFilterByCurrencyList],
  );
  const { data: paymentMethods } = usePaymentMethods();

  const allCurrencies = useMemo(
    () =>
      paymentMethods
        ? Array.from(new Set(paymentMethods.flatMap((info) => info.currencies)))
        : undefined,
    [paymentMethods],
  );

  const { data: buyOfferCurrencies } = useQuery({
    queryKey: ["peach069expressBuyOffers", "stats", "currencies"],
    queryFn: async () => {
      const { result } = await peachAPI.private.peach069.getBuyOffers({});
      return result?.stats.currencies;
    },
  });

  const items = useMemo(() => {
    if (!allCurrencies) return [];

    return allCurrencies
      .map((currency) => {
        const numberOfOffers = buyOfferCurrencies?.[currency] || 0;
        return {
          currency,
          numberOfOffers,
        };
      })
      .sort((a, b) => b.numberOfOffers - a.numberOfOffers) // Sort by offer count descending
      .map(({ currency, numberOfOffers }) => ({
        text: (
          <View style={tw`flex-row items-center gap-6px shrink`}>
            <PeachText style={tw`input-title shrink`}>
              {`${i18n(`currency.${currency}`)} (${currency})`}
            </PeachText>
            <PeachText style={tw`body-m text-black-50 shrink`}>
              ({numberOfOffers} offer{numberOfOffers === 1 ? "" : "s"})
            </PeachText>
          </View>
        ),
        onPress: () => handleToggleCurrency(currency),
        isSelected: selectedCurrencies.includes(currency),
      }));
  }, [
    allCurrencies,
    selectedCurrencies,
    handleToggleCurrency,
    buyOfferCurrencies,
  ]);

  if (!allCurrencies) return null;
  return <SelectionList type="checkbox" items={items} />;
}

function AmountSelection() {
  const [expressSellFilterByAmountRange, setExpressSellFilterByAmountRange] =
    useOfferPreferences(
      (state) => [
        state.expressSellFilterByAmountRange,
        state.setExpressSellFilterByAmountRange,
      ],
      shallow,
    );
  const [minLimit, maxLimit] = useTradingAmountLimits("buy");

  // Local state for immediate UI updates during dragging
  const [localRange, setLocalRange] = useState(expressSellFilterByAmountRange);
  const [isDragging, setIsDragging] = useState(false);

  // Use local state during dragging, store state otherwise
  const [minAmount, maxAmount] = isDragging
    ? localRange
    : expressSellFilterByAmountRange;

  const AMOUNT_RANGE = maxLimit - minLimit;
  const THUMB_SIZE = 24;
  const TRACK_HEIGHT = 10;
  const TRACK_PADDING = 22;
  const VISUAL_CLEARANCE = 8; // Extra spacing between sliders

  const DEFAULT_TRACK_WIDTH = 300;
  const [trackWidth, setTrackWidth] = useState(DEFAULT_TRACK_WIDTH);

  // Calculate positions based on values
  const getPositionFromValue = (value: number) => {
    const effectiveTrackWidth = trackWidth - THUMB_SIZE;
    const percentage = (value - minLimit) / AMOUNT_RANGE;
    return percentage * effectiveTrackWidth;
  };

  const minPosition = getPositionFromValue(minAmount);
  const maxPosition = getPositionFromValue(maxAmount);

  const onDrag =
    (type: "min" | "max") => (event: { nativeEvent: { pageX: number } }) => {
      // This approach mimics the working AmountSelectorComponent
      const { pageX } = event.nativeEvent;

      // Calculate position relative to track start and center the thumb on the click point
      let newPosition = pageX - THUMB_SIZE * 2;

      // Bounds checking
      newPosition = Math.max(0, Math.min(trackWidth, newPosition));

      // Calculate new value from position
      const percentage = newPosition / (trackWidth - THUMB_SIZE);
      let newValue = Math.round(minLimit + percentage * AMOUNT_RANGE);

      // Calculate minimum separation based on thumb size to prevent visual overlap
      const minSeparationPixels = THUMB_SIZE + VISUAL_CLEARANCE;
      const minSeparationValue =
        (minSeparationPixels / (trackWidth - THUMB_SIZE)) * AMOUNT_RANGE;

      // Update local state during dragging (no store updates)
      if (type === "min") {
        newValue = Math.min(newValue, maxAmount - minSeparationValue);
        newValue = Math.max(minLimit, newValue);
        setLocalRange([newValue, maxAmount]);
      } else {
        newValue = Math.max(newValue, minAmount + minSeparationValue);
        newValue = Math.min(maxLimit, newValue);
        setLocalRange([minAmount, newValue]);
      }
    };

  // Handle drag start
  const onDragStart =
    (type: "min" | "max") => (event: { nativeEvent: { pageX: number } }) => {
      setIsDragging(true);
      onDrag(type)(event); // Process the initial touch
    };

  // Handle drag end - update store with final values
  const onDragEnd = () => {
    setIsDragging(false);
    setExpressSellFilterByAmountRange(localRange);
  };

  const { fiatPrice: minFiatPrice, displayCurrency } =
    useBitcoinPrices(minAmount);
  const { fiatPrice: maxFiatPrice } = useBitcoinPrices(maxAmount);

  return (
    <View style={tw`pb-4 gap-10px`}>
      <PeachText style={tw`subtitle-1`}>Amount to sell</PeachText>
      <View style={tw`gap-6 px-2`}>
        <View style={tw`gap-2`}>
          <View style={tw`flex-row items-center justify-between gap-4`}>
            <View
              style={tw`flex-1 px-2 py-2 border rounded-full border-black-10 bg-backgroundLight-light`}
            >
              <PeachText style={tw`text-center`}>
                {thousands(Math.round(minAmount))}
              </PeachText>
            </View>
            <View style={tw`w-2 h-px bg-black-65`} />
            <View
              style={tw`flex-1 px-2 py-2 border rounded-full border-black-10 bg-backgroundLight-light`}
            >
              <PeachText style={tw`text-center`}>
                {thousands(Math.round(maxAmount))}
              </PeachText>
            </View>
          </View>
          <PeachText style={tw`text-xs font-normal tracking-normal font-baloo`}>
            {i18n("currentMarketValue")}
          </PeachText>
          <View style={tw`flex-row items-center justify-between gap-4`}>
            <View
              style={tw`flex-1 px-2 py-2 border rounded-full border-black-10 bg-backgroundLight-light`}
            >
              <PeachText
                style={tw`text-center`}
              >{`${thousands(minFiatPrice)} ${displayCurrency}`}</PeachText>
            </View>
            <View style={tw`w-2 h-px bg-black-65`} />
            <View
              style={tw`flex-1 px-2 py-2 border rounded-full border-black-10 bg-backgroundLight-light`}
            >
              <PeachText
                style={tw`text-center`}
              >{`${thousands(maxFiatPrice)} ${displayCurrency}`}</PeachText>
            </View>
          </View>
        </View>

        {/* Track container with full width */}
        <View
          style={[
            tw`relative flex-row items-center bg-primary-background-dark-color rounded-2xl`,
            {
              height: TRACK_HEIGHT,
              paddingHorizontal: TRACK_PADDING,
            },
          ]}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setTrackWidth(width);
          }}
        >
          <View
            style={[
              tw`bg-primary-main`,
              {
                left: minPosition,
                width: maxPosition - minPosition,
                height: TRACK_HEIGHT,
              },
            ]}
          />

          {/* Min value slider */}
          <View
            style={[
              tw`absolute items-center justify-center border-4 rounded-full border-primary-mild-1`,
              {
                left: minPosition,
              },
            ]}
            onStartShouldSetResponder={() => true}
            onResponderTerminationRequest={() => false}
            onResponderMove={onDrag("min")}
            onTouchStart={onDragStart("min")}
            onTouchEnd={onDragEnd}
          >
            <View
              style={tw`w-6 h-6 border-4 rounded-full bg-primary-main border-backgroundLight-light`}
            />
          </View>

          {/* Max value slider */}
          <View
            style={[
              tw`absolute items-center justify-center border-4 rounded-full border-primary-mild-1`,
              {
                left: maxPosition,
              },
            ]}
            onStartShouldSetResponder={() => true}
            onResponderTerminationRequest={() => false}
            onResponderMove={onDrag("max")}
            onTouchStart={onDragStart("max")}
            onTouchEnd={onDragEnd}
          >
            <View
              style={tw`w-6 h-6 border-4 rounded-full bg-primary-main border-backgroundLight-light`}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function PriceSection() {
  const [expressSellFilterMinPremium, setExpressSellFilterMinPremium] =
    useOfferPreferences(
      (state) => [
        state.expressSellFilterMinPremium,
        state.setExpressSellFilterMinPremium,
      ],
      shallow,
    );

  const PREMIUM_STEP = 0.1;
  const MIN_PREMIUM = -21;
  const MAX_PREMIUM = 21;

  const onMinusPress = () => {
    setExpressSellFilterMinPremium(
      Math.max(
        MIN_PREMIUM,
        round(expressSellFilterMinPremium - PREMIUM_STEP, 1),
      ),
    );
  };
  const onPlusPress = () => {
    setExpressSellFilterMinPremium(
      Math.min(
        MAX_PREMIUM,
        round(expressSellFilterMinPremium + PREMIUM_STEP, 1),
      ),
    );
  };
  return (
    <View style={tw`gap-4 py-4`}>
      <PeachText>{i18n("filter.minPremium")}</PeachText>
      <View style={tw`flex-row items-center gap-2`}>
        <TouchableIcon
          id="minus"
          iconSize={18}
          style={tw`border rounded-full p-11px border-primary-main`}
          iconColor={tw.color("primary-main")}
          onPress={onMinusPress}
        />
        <View
          style={tw`flex-1 p-2 border rounded-full border-black-10 bg-backgroundLight-light`}
        >
          <PeachText style={tw`text-center`}>
            {expressSellFilterMinPremium}%
          </PeachText>
        </View>
        <TouchableIcon
          id="plus"
          iconSize={18}
          style={tw`border rounded-full p-11px border-primary-main`}
          iconColor={tw.color("primary-main")}
          onPress={onPlusPress}
        />
      </View>
    </View>
  );
}

function ResetAllButton() {
  const [
    expressSellFilterByAmountRange,
    expressSellFilterByCurrencyList,
    expressSellFilterByPaymentMethodList,
    expressSellFilterMinPremium,
    expressSellOffersSorter,
    resetExpressSellFilters,
  ] = useOfferPreferences(
    (state) => [
      state.expressSellFilterByAmountRange,
      state.expressSellFilterByCurrencyList,
      state.expressSellFilterByPaymentMethodList,
      state.expressSellFilterMinPremium,
      state.expressSellOffersSorter,
      state.resetExpressSellFilters,
    ],
    shallow,
  );

  // Check if current values differ from defaults
  const hasFilters = useMemo(
    () =>
      JSON.stringify(expressSellFilterByAmountRange) !==
        JSON.stringify(defaultPreferences.expressSellFilterByAmountRange) ||
      expressSellFilterByCurrencyList.length > 0 ||
      expressSellFilterByPaymentMethodList.length > 0 ||
      expressSellFilterMinPremium !==
        defaultPreferences.expressSellFilterMinPremium ||
      expressSellOffersSorter !== defaultPreferences.expressSellOffersSorter,
    [
      expressSellFilterByAmountRange,
      expressSellFilterByCurrencyList,
      expressSellFilterByPaymentMethodList,
      expressSellFilterMinPremium,
      expressSellOffersSorter,
    ],
  );

  return (
    <Button
      textColor={tw.color(hasFilters ? "success-main" : "black-50")}
      style={tw`py-1 border md:py-2`}
      disabled={!hasFilters}
      onPress={resetExpressSellFilters}
      ghost
    >
      {i18n("resetAll")}
    </Button>
  );
}
