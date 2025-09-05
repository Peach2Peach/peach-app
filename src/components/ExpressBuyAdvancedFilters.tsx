import { useQuery } from "@tanstack/react-query";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { SATSINBTC } from "../constants";
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

export type FilterSection =
  | "sortBy"
  | "paymentMethods"
  | "currencies"
  | "amount"
  | "price";

export function ExpressBuyAdvancedFilters({ isOpen, onClose }: Props) {
  const [expandedSection, setExpandedSection] = useState<FilterSection | null>(
    null,
  );

  const toggleSection = (section: FilterSection) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const selectedPaymentMethods = useOfferPreferences(
    (state) => state.expressBuyFilterByPaymentMethodList,
  );
  const selectedCurrencies = useOfferPreferences(
    (state) => state.expressBuyFilterByCurrencyList,
  );

  // Fetch offer stats for payment method and currency counts
  const { data: sellOfferStats } = useQuery({
    queryKey: ["peach069expressBuySellOffers"],
    queryFn: async () => {
      const { result } = await peachAPI.private.peach069.getSellOffers({});
      return result?.stats;
    },
  });

  const filterSections = [
    {
      id: "sortBy" as const,
      label: "Sort By",
      content: <SortByList />,
    },
    {
      id: "paymentMethods" as const,
      label: selectedPaymentMethods.length
        ? `Payment Methods (${selectedPaymentMethods.length})`
        : "Payment Methods",
      content: (
        <PaymentMethodsList offerCounts={sellOfferStats?.paymentMethods} />
      ),
    },
    {
      id: "currencies" as const,
      label: selectedCurrencies.length
        ? `Currencies (${selectedCurrencies.length})`
        : "Currencies",
      content: <CurrenciesList offerCounts={sellOfferStats?.currencies} />,
    },
    { id: "amount" as const, label: "Amount", content: <AmountSelection /> },
    { id: "price" as const, label: "Price", content: <PriceSection /> },
  ];

  const HEADER_AND_PADDING = 120; // Space for padding, header text, etc.
  const DRAWER_HEIGHT_LARGE = 600;
  const DRAWER_HEIGHT_SMALL = 450;
  const isMediumScreen = useIsMediumScreen();
  const DRAWER_HEIGHT = isMediumScreen
    ? DRAWER_HEIGHT_LARGE
    : DRAWER_HEIGHT_SMALL;
  const SCROLL_HEIGHT = DRAWER_HEIGHT - HEADER_AND_PADDING;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Advanced Filters">
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
                  label: string;
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
    (state) => state.expressBuyOffersSorter,
  );
  const setSorter = useOfferPreferences(
    (state) => state.setExpressBuyOffersSorter,
  );
  const list = [
    "bestReputation",
    "highestAmount",
    "lowestAmount",
    "lowestPremium",
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

function PaymentMethodsList({
  offerCounts,
}: {
  offerCounts?: Record<PaymentMethod, number>;
}) {
  const { data: paymentMethods } = usePaymentMethods();
  const selectedPaymentMethods = useOfferPreferences(
    (state) => state.expressBuyFilterByPaymentMethodList,
  );
  const setExpressBuyFilterByPaymentMethodList = useOfferPreferences(
    (state) => state.setExpressBuyFilterByPaymentMethodList,
  );
  const onTogglePaymentMethod = useCallback(
    (paymentMethod: PaymentMethod) => {
      const isSelected = selectedPaymentMethods.some(
        (pm) => pm === paymentMethod,
      );
      if (isSelected) {
        setExpressBuyFilterByPaymentMethodList(
          selectedPaymentMethods.filter((pm) => pm !== paymentMethod),
        );
      } else {
        setExpressBuyFilterByPaymentMethodList([
          ...selectedPaymentMethods,
          paymentMethod,
        ]);
      }
    },
    [selectedPaymentMethods, setExpressBuyFilterByPaymentMethodList],
  );

  const items = useMemo(() => {
    if (!paymentMethods) return [];

    return paymentMethods
      .map((paymentMethod) => {
        const numberOfOffers = offerCounts?.[paymentMethod.id] || 0;
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
    selectedPaymentMethods,
    onTogglePaymentMethod,
    offerCounts,
  ]);

  if (!paymentMethods) return null;
  return <SelectionList type="checkbox" items={items} />;
}

function CurrenciesList({
  offerCounts,
}: {
  offerCounts?: Record<Currency, number>;
}) {
  const selectedCurrencies = useOfferPreferences(
    (state) => state.expressBuyFilterByCurrencyList,
  );
  const setExpressBuyFilterByCurrencyList = useOfferPreferences(
    (state) => state.setExpressBuyFilterByCurrencyList,
  );

  const handleToggleCurrency = useCallback(
    (currency: Currency) => {
      const isSelected = selectedCurrencies.includes(currency);
      if (isSelected) {
        setExpressBuyFilterByCurrencyList(
          selectedCurrencies.filter((c) => c !== currency),
        );
      } else {
        setExpressBuyFilterByCurrencyList([...selectedCurrencies, currency]);
      }
    },
    [selectedCurrencies, setExpressBuyFilterByCurrencyList],
  );
  const { data: paymentMethods } = usePaymentMethods();

  const allCurrencies = useMemo(
    () =>
      paymentMethods
        ? Array.from(new Set(paymentMethods.flatMap((info) => info.currencies)))
        : undefined,
    [paymentMethods],
  );

  const items = useMemo(() => {
    if (!allCurrencies) return [];

    return allCurrencies
      .map((currency) => {
        const numberOfOffers = offerCounts?.[currency] || 0;
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
  }, [allCurrencies, selectedCurrencies, handleToggleCurrency, offerCounts]);

  if (!allCurrencies) return null;
  return <SelectionList type="checkbox" items={items} />;
}

function AmountSelection() {
  const [expressBuyFilterByAmountRange, setExpressBuyFilterByAmountRange] =
    useOfferPreferences(
      (state) => [
        state.expressBuyFilterByAmountRange,
        state.setExpressBuyFilterByAmountRange,
      ],
      shallow,
    );
  const [minLimit, maxLimit] = useTradingAmountLimits("buy");

  // Local state for immediate UI updates during dragging
  const [localRange, setLocalRange] = useState(expressBuyFilterByAmountRange);
  const [isDragging, setIsDragging] = useState(false);

  // Use local state during dragging, store state otherwise
  const [minAmount, maxAmount] = isDragging
    ? localRange
    : expressBuyFilterByAmountRange;

  const AMOUNT_RANGE = maxLimit - minLimit;
  const THUMB_SIZE = 24;
  const TRACK_HEIGHT = 10;
  const TRACK_PADDING = 22;
  const VISUAL_CLEARANCE = 8; // Extra spacing between sliders
  const BTC_DECIMAL_PLACES = 4; // Number of decimal places for BTC display

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
    setExpressBuyFilterByAmountRange(localRange);
  };

  const { fiatPrice: minFiatPrice, displayCurrency } =
    useBitcoinPrices(minAmount);
  const { fiatPrice: maxFiatPrice } = useBitcoinPrices(maxAmount);

  return (
    <View style={tw`pb-4 gap-10px`}>
      <PeachText style={tw`subtitle-1`}>Amount to buy</PeachText>
      <View style={tw`gap-6 px-2`}>
        <View style={tw`gap-2`}>
          <View style={tw`flex-row items-center justify-between gap-4`}>
            <View
              style={tw`flex-1 px-2 py-2 border rounded-full border-black-10 bg-backgroundLight-light`}
            >
              <PeachText
                style={tw`text-center`}
              >{`${(minAmount / SATSINBTC).toFixed(BTC_DECIMAL_PLACES).toString()} BTC`}</PeachText>
            </View>
            <View style={tw`w-2 h-px bg-black-65`} />
            <View
              style={tw`flex-1 px-2 py-2 border rounded-full border-black-10 bg-backgroundLight-light`}
            >
              <PeachText
                style={tw`text-center`}
              >{`${(maxAmount / SATSINBTC).toFixed(BTC_DECIMAL_PLACES).toString()} BTC`}</PeachText>
            </View>
          </View>
          <PeachText style={tw`text-xs font-normal tracking-normal font-baloo`}>
            Current market value
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
  const [expressBuyFilterMaxPremium, setExpressBuyFilterMaxPremium] =
    useOfferPreferences(
      (state) => [
        state.expressBuyFilterMaxPremium,
        state.setExpressBuyFilterMaxPremium,
      ],
      shallow,
    );

  const PREMIUM_STEP = 0.1;
  const MAX_PREMIUM = 21;

  const onMinusPress = () => {
    setExpressBuyFilterMaxPremium(
      Math.max(0, round(expressBuyFilterMaxPremium - PREMIUM_STEP, 1)),
    );
  };
  const onPlusPress = () => {
    setExpressBuyFilterMaxPremium(
      Math.min(
        MAX_PREMIUM,
        round(expressBuyFilterMaxPremium + PREMIUM_STEP, 1),
      ),
    );
  };
  return (
    <View style={tw`gap-4 py-4`}>
      <PeachText>max. premium:</PeachText>
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
            {expressBuyFilterMaxPremium}%
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
    expressBuyFilterByAmountRange,
    expressBuyFilterByCurrencyList,
    expressBuyFilterByPaymentMethodList,
    expressBuyFilterMaxPremium,
    expressBuyOffersSorter,
    resetExpressBuyFilters,
  ] = useOfferPreferences(
    (state) => [
      state.expressBuyFilterByAmountRange,
      state.expressBuyFilterByCurrencyList,
      state.expressBuyFilterByPaymentMethodList,
      state.expressBuyFilterMaxPremium,
      state.expressBuyOffersSorter,
      state.resetExpressBuyFilters,
    ],
    shallow,
  );

  // Check if current values differ from defaults
  const hasFilters = useMemo(
    () =>
      JSON.stringify(expressBuyFilterByAmountRange) !==
        JSON.stringify(defaultPreferences.expressBuyFilterByAmountRange) ||
      expressBuyFilterByCurrencyList.length > 0 ||
      expressBuyFilterByPaymentMethodList.length > 0 ||
      expressBuyFilterMaxPremium !==
        defaultPreferences.expressBuyFilterMaxPremium ||
      expressBuyOffersSorter !== defaultPreferences.expressBuyOffersSorter,
    [
      expressBuyFilterByAmountRange,
      expressBuyFilterByCurrencyList,
      expressBuyFilterByPaymentMethodList,
      expressBuyFilterMaxPremium,
      expressBuyOffersSorter,
    ],
  );

  return (
    <Button
      textColor={tw.color(hasFilters ? "success-main" : "black-50")}
      style={tw`py-1 border md:py-2`}
      disabled={!hasFilters}
      onPress={resetExpressBuyFilters}
      ghost
    >
      reset all
    </Button>
  );
}
