import { ReactNode, useMemo } from "react";
import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { IconType } from "../../../assets/icons";
import { useMeetupEvents } from "../../../hooks/query/useMeetupEvents";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore/usePaymentDataStore";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { keys } from "../../../utils/object/keys";
import { isCashTrade } from "../../../utils/paymentMethod/isCashTrade";
import { NewBubble as Bubble } from "../../bubble/Bubble";
import { useDrawerState } from "../../drawer/useDrawerState";
import { CurrencySelection } from "../../navigation/CurrencySelection";
import { PulsingText } from "./PulsingText";

type Props = {
  meansOfPayment: MeansOfPayment;
  disabled: boolean;
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  selectedPaymentData: PaymentData | undefined;
  setSelectedPaymentData: (paymentMethod?: PaymentData) => void;
  showPaymentMethodPulse: boolean;
  selectedMethodInfo: ReactNode;
  origin?: keyof RootStackParamList;
};

export function PaymentMethodSelector({
  disabled,
  selectedCurrency,
  setSelectedCurrency,
  selectedPaymentData,
  setSelectedPaymentData,
  showPaymentMethodPulse,
  selectedMethodInfo,
  meansOfPayment,
  origin = "matchDetails",
}: Props) {
  const availableCurrencies = keys(meansOfPayment);
  const allPaymentMethods = meansOfPayment[selectedCurrency];

  const { data: meetupEvents } = useMeetupEvents();
  const getPaymentMethodName = (paymentMethod: PaymentMethod) => {
    if (isCashTrade(paymentMethod)) {
      const eventId = paymentMethod.replace("cash.", "");
      const meetupEvent = meetupEvents?.find(({ id }) => id === eventId);
      return meetupEvent?.shortName ?? eventId;
    }
    return i18n(`paymentMethod.${paymentMethod}`);
  };
  const items = allPaymentMethods?.map((p) => ({
    value: p,
    display: getPaymentMethodName(p),
  }));

  const accountPaymentData = usePaymentDataStore(
    (state) => Object.values(state.paymentData),
    shallow,
  );

  const onCurrencyChange = (currency: Currency) => {
    const allMethodsForCurrency = meansOfPayment[currency];
    const dataForCurrency = accountPaymentData.filter((d) =>
      allMethodsForCurrency?.includes(d.type),
    );
    const newData =
      dataForCurrency.length === 1 ? dataForCurrency[0] : undefined;
    setSelectedCurrency(currency);
    setSelectedPaymentData(newData);
  };

  return (
    <View
      style={[disabled && tw`opacity-33`, tw`gap-1`]}
      pointerEvents={disabled ? "none" : "auto"}
    >
      <PulsingText style={tw`self-center`} showPulse={showPaymentMethodPulse}>
        {i18n("form.paymentMethod")}
      </PulsingText>

      <View style={tw`gap-3 pb-2`}>
        {selectedMethodInfo || (
          <>
            <CurrencySelection
              selected={selectedCurrency}
              currencies={availableCurrencies}
              select={onCurrencyChange}
            />
            <CustomSelector
              selectedCurrency={selectedCurrency}
              selectedPaymentData={selectedPaymentData}
              onPress={setSelectedPaymentData}
              items={items}
              origin={origin}
            />
          </>
        )}
      </View>
    </View>
  );
}

type SelectorProps = {
  items: { value: PaymentMethod; display: React.ReactNode }[] | undefined;
  selectedPaymentData?: PaymentData;
  selectedCurrency: Currency;
  onPress?: (value: PaymentData) => void;
  origin?: keyof RootStackParamList;
};

function CustomSelector({
  items,
  selectedCurrency,
  selectedPaymentData,
  onPress,
  origin = "matchDetails",
}: SelectorProps) {
  return (
    <View style={tw`flex-row flex-wrap justify-center gap-1`}>
      {items?.map(({ value, display }, i) => (
        <PayementMethodBubble
          key={`selector-item-${value}-${i}`}
          paymentMethod={value}
          onPress={onPress}
          selectedPaymentData={selectedPaymentData}
          selectedCurrency={selectedCurrency}
          origin={origin}
        >
          {display}
        </PayementMethodBubble>
      ))}
    </View>
  );
}

type PaymentMethodBubbleProps = {
  paymentMethod: PaymentMethod;
  selectedPaymentData?: PaymentData;
  selectedCurrency: Currency;
  children: React.ReactNode;
  onPress?: (value: PaymentData) => void;
  origin?: keyof RootStackParamList;
};

function PayementMethodBubble({
  paymentMethod,
  selectedPaymentData,
  selectedCurrency,
  children,
  onPress,
  origin = "matchDetails",
}: PaymentMethodBubbleProps) {
  const paymentDataRecord = usePaymentDataStore((state) => state.paymentData);
  const paymentDataForType = useMemo(
    () =>
      Object.values(paymentDataRecord).filter((p) => p.type === paymentMethod),
    [paymentDataRecord, paymentMethod],
  );
  const hasPaymentData = paymentDataForType.length > 0;
  const hasMultiplePaymentData = paymentDataForType.length > 1;
  const isSelected = selectedPaymentData?.type === paymentMethod;
  const iconId: IconType = isSelected
    ? "checkSquare"
    : hasPaymentData
      ? "plusSquare"
      : "edit";
  const navigation = useStackNavigation();
  const updateDrawer = useDrawerState((state) => state.updateDrawer);

  const onPressBubble = () => {
    if (onPress) {
      if (hasPaymentData) {
        if (hasMultiplePaymentData) {
          updateDrawer({
            title: i18n("selectPaymentMethod.title"),
            options: paymentDataForType.map((p, index) => ({
              title: p.label.trim(),
              onPress: () => {
                onPress(paymentDataForType[index]);
                updateDrawer({ show: false });
              },
              logoID: paymentMethod,
              iconRightID:
                p.id === selectedPaymentData?.id ? "check" : undefined,
            })),
            show: true,
          });
        } else {
          onPress(paymentDataForType[0]);
        }
      } else if (isCashTrade(paymentMethod)) {
        navigation.navigate("meetupScreen", {
          eventId: paymentMethod.replace("cash.", ""),
          origin,
        });
      } else {
        const country = paymentMethod.startsWith("giftCard.amazon.")
          ? (paymentMethod.split(".")[2] as PaymentMethodCountry)
          : undefined;
        navigation.navigate("paymentMethodForm", {
          paymentData: {
            type: paymentMethod,
            label: i18n(`paymentMethod.${paymentMethod}`),
            currencies: [selectedCurrency],
            country,
          },
          origin,
        });
      }
    }
  };

  return (
    <Bubble
      onPress={onPressBubble}
      color={isSelected ? "orange" : "primary-mild"}
      ghost={!isSelected}
      iconId={iconId}
    >
      {children}
    </Bubble>
  );
}
