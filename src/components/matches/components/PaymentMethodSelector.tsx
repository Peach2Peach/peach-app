import { useTranslate } from "@tolgee/react";
import { View } from "react-native";
import { IconType } from "../../../assets/icons";
import { useMeetupEvents } from "../../../hooks/query/useMeetupEvents";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore/usePaymentDataStore";
import tw from "../../../styles/tailwind";
import { keys } from "../../../utils/object/keys";
import { getPaymentMethods } from "../../../utils/paymentMethod/getPaymentMethods";
import { isCashTrade } from "../../../utils/paymentMethod/isCashTrade";
import { paymentMethodAllowedForCurrency } from "../../../utils/paymentMethod/paymentMethodAllowedForCurrency";
import { NewBubble as Bubble } from "../../bubble/Bubble";
import { useDrawerState } from "../../drawer/useDrawerState";
import { CurrencySelection } from "../../navigation/CurrencySelection";
import { PulsingText } from "./PulsingText";

type Props = {
  match: Match;
  disabled: boolean;
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  selectedPaymentData: PaymentData | undefined;
  setSelectedPaymentData: (paymentMethod?: PaymentData) => void;
  showPaymentMethodPulse: boolean;
};

export function PaymentMethodSelector({
  match,
  disabled,
  selectedCurrency,
  setSelectedCurrency,
  selectedPaymentData,
  setSelectedPaymentData,
  showPaymentMethodPulse,
}: Props) {
  const {
    selectedCurrency: matchCurrency,
    selectedPaymentMethod: matchPaymentMethod,
    meansOfPayment,
  } = match;
  const availableCurrencies = keys(meansOfPayment);

  const allPaymentMethods = getPaymentMethods(meansOfPayment);
  const availablePaymentMethods = allPaymentMethods.filter((p) =>
    paymentMethodAllowedForCurrency(p, selectedCurrency),
  );
  const { data: meetupEvents } = useMeetupEvents();
  const { t } = useTranslate("paymentMethod");
  const getPaymentMethodName = (paymentMethod: PaymentMethod) => {
    if (isCashTrade(paymentMethod)) {
      const eventId = paymentMethod.replace("cash.", "");
      const meetupEvent = meetupEvents?.find(({ id }) => id === eventId);
      return meetupEvent?.shortName ?? eventId;
    }
    // @ts-ignore
    return t(`paymentMethod.${paymentMethod}`);
  };
  const items = availablePaymentMethods.map((p) => ({
    value: p,
    display: getPaymentMethodName(p),
  }));

  const accountPaymentData = usePaymentDataStore((state) =>
    state.getPaymentDataArray(),
  );

  const onCurrencyChange = (currency: Currency) => {
    const allMethodsForCurrency = allPaymentMethods.filter((p) =>
      paymentMethodAllowedForCurrency(p, currency),
    );
    const dataForCurrency = accountPaymentData.filter((d) =>
      allMethodsForCurrency.includes(d.type),
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
        {t("form.paymentMethod", { ns: "form" })}
      </PulsingText>

      <View style={tw`gap-3 pb-2`}>
        {match.matched ? (
          <>
            {matchCurrency && matchPaymentMethod && (
              <>
                <CurrencySelection
                  currencies={[matchCurrency]}
                  selected={matchCurrency}
                />
                <CustomSelector
                  selectedValue={matchPaymentMethod}
                  selectedCurrency={matchCurrency}
                  items={[
                    {
                      value: matchPaymentMethod,
                      display: getPaymentMethodName(matchPaymentMethod),
                    },
                  ]}
                />
              </>
            )}
          </>
        ) : (
          <>
            <CurrencySelection
              currencies={availableCurrencies}
              selected={selectedCurrency}
              select={onCurrencyChange}
            />
            <CustomSelector
              selectedCurrency={selectedCurrency}
              selectedValue={selectedPaymentData?.type}
              selectedPaymentData={selectedPaymentData}
              onPress={setSelectedPaymentData}
              items={items}
            />
          </>
        )}
      </View>
    </View>
  );
}

type SelectorProps = {
  items: { value: PaymentMethod; display: React.ReactNode }[];
  selectedValue?: PaymentMethod;
  selectedPaymentData?: PaymentData;
  selectedCurrency: Currency;
  onPress?: (value: PaymentData) => void;
};

function CustomSelector({
  items,
  selectedValue,
  selectedCurrency,
  selectedPaymentData,
  onPress,
}: SelectorProps) {
  return (
    <View style={tw`flex-row flex-wrap justify-center gap-1`}>
      {items.map(({ value, display }, i) => (
        <PayementMethodBubble
          key={`selector-item-${value}-${i}`}
          paymentMethod={value}
          onPress={onPress}
          isSelected={value === selectedValue}
          selectedPaymentData={selectedPaymentData}
          selectedCurrency={selectedCurrency}
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
  isSelected: boolean;
  onPress?: (value: PaymentData) => void;
};

function PayementMethodBubble({
  paymentMethod,
  selectedPaymentData,
  selectedCurrency,
  children,
  isSelected,
  onPress,
}: PaymentMethodBubbleProps) {
  const getAllPaymentDataByType = usePaymentDataStore(
    (state) => state.getAllPaymentDataByType,
  );
  const { t } = useTranslate("paymentMethod");
  const paymentDataForType = getAllPaymentDataByType(paymentMethod);
  const hasPaymentData = paymentDataForType.length > 0;
  const hasMultiplePaymentData = paymentDataForType.length > 1;
  const iconId: IconType = isSelected
    ? "checkSquare"
    : hasPaymentData
      ? "plusSquare"
      : "edit";
  const navigation = useStackNavigation();
  const updateDrawer = useDrawerState((state) => state.updateDrawer);

  const { data: meetupEvents } = useMeetupEvents();
  const getPaymentMethodName = (methodType: PaymentMethod) => {
    if (isCashTrade(methodType)) {
      const eventId = methodType.replace("cash.", "");
      const meetupEvent = meetupEvents?.find(({ id }) => id === eventId);
      return meetupEvent?.shortName ?? eventId;
    }
    // @ts-ignore
    return t(`paymentMethod.${methodType}`);
  };
  const onPressBubble = () => {
    if (onPress) {
      if (hasPaymentData) {
        if (hasMultiplePaymentData) {
          updateDrawer({
            title: t("selectPaymentMethod.title"),
            options: paymentDataForType.map((p, index) => ({
              title: getPaymentMethodName(p.type),
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
          origin: "matchDetails",
        });
      } else {
        const country = paymentMethod.startsWith("giftCard.amazon.")
          ? (paymentMethod.split(".")[2] as PaymentMethodCountry)
          : undefined;
        navigation.navigate("paymentMethodForm", {
          paymentData: {
            type: paymentMethod,
            // @ts-ignore
            label: t(`paymentMethod.${paymentMethod}`),
            currencies: [selectedCurrency],
            country,
          },
          origin: "matchDetails",
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
