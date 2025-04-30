import { ReactNode, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/shallow";
import { GiftCardCountry } from "../../../../peach-api/src/@types/payment";
import { IconType } from "../../../assets/icons";
import { useMeetupEvents } from "../../../hooks/query/useMeetupEvents";
import { useRoute } from "../../../hooks/useRoute";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore/usePaymentDataStore";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { keys } from "../../../utils/object/keys";
import { isCashTrade } from "../../../utils/paymentMethod/isCashTrade";
import { Icon } from "../../Icon";
import { DrawerOptionType } from "../../drawer/components/DrawerOption";
import { useDrawerState } from "../../drawer/useDrawerState";
import { PeachText } from "../../text/PeachText";

type Props = {
  meansOfPayment: MeansOfPayment;
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  selectedPaymentData: PaymentData | undefined;
  setSelectedPaymentData: (paymentMethod?: PaymentData) => void;
  selectedMethodInfo: ReactNode;
};

export function PaymentMethodSelector({
  selectedCurrency,
  setSelectedCurrency,
  selectedPaymentData,
  setSelectedPaymentData,
  selectedMethodInfo,
  meansOfPayment,
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
    useShallow((state) => Object.values(state.paymentData)),
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
      style={tw`items-center self-stretch gap-3 px-4 py-3 border-2 rounded-2xl border-primary-main`}
    >
      <PeachText style={tw`underline subtitle-1`}>
        select currency & payment method
      </PeachText>

      <View style={tw`gap-3 pb-2`}>
        {selectedMethodInfo || (
          <View
            style={tw`flex-wrap items-center self-stretch justify-center gap-1`}
          >
            {availableCurrencies.map((currency) => (
              <TouchableOpacity
                key={currency}
                style={[
                  tw`px-2 border rounded-lg border-black-100`,
                  selectedCurrency === currency
                    ? tw`bg-black-5 border-black-100`
                    : tw`border-transparent`,
                ]}
                disabled={selectedCurrency === currency}
                onPress={() => onCurrencyChange(currency)}
              >
                <PeachText style={tw`leading-loose subtitle-0`}>
                  {currency}
                </PeachText>
              </TouchableOpacity>
            ))}
            <CustomSelector
              selectedCurrency={selectedCurrency}
              selectedPaymentData={selectedPaymentData}
              onPress={setSelectedPaymentData}
              items={items}
            />
          </View>
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
};

function CustomSelector({
  items,
  selectedCurrency,
  selectedPaymentData,
  onPress,
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
};

function PayementMethodBubble({
  paymentMethod,
  selectedPaymentData,
  selectedCurrency,
  children,
  onPress,
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
  const routeName = useRoute().name;
  const updateDrawer = useDrawerState((state) => state.updateDrawer);

  const { data: meetupEvents } = useMeetupEvents();
  const getPaymentMethodName = (methodType: PaymentMethod) => {
    if (isCashTrade(methodType)) {
      const eventId = methodType.replace("cash.", "");
      const meetupEvent = meetupEvents?.find(({ id }) => id === eventId);
      return meetupEvent?.shortName ?? eventId;
    }
    return i18n(`paymentMethod.${methodType}`);
  };
  const onPressBubble = () => {
    if (onPress) {
      if (hasPaymentData) {
        if (hasMultiplePaymentData) {
          updateDrawer({
            title: i18n("selectPaymentMethod.title"),
            options: paymentDataForType.map(
              (p, index): DrawerOptionType => ({
                title: getPaymentMethodName(p.type),
                onPress: () => {
                  onPress(paymentDataForType[index]);
                  updateDrawer({ show: false });
                },
                // @ts-ignore
                logoID: paymentMethod,
                iconRightID:
                  p.id === selectedPaymentData?.id ? "check" : undefined,
              }),
            ),
            show: true,
          });
        } else {
          onPress(paymentDataForType[0]);
        }
      } else if (isCashTrade(paymentMethod)) {
        navigation.navigateDeprecated("meetupScreen", {
          eventId: paymentMethod.replace("cash.", ""),
          origin: routeName,
        });
      } else {
        const country = paymentMethod.startsWith("giftCard.amazon.")
          ? (paymentMethod.split(".")[2] as GiftCardCountry)
          : undefined;
        navigation.navigateDeprecated("paymentMethodForm", {
          paymentData: {
            type: paymentMethod,
            label: i18n(`paymentMethod.${paymentMethod}`),
            currencies: [selectedCurrency],
            country,
          },
          origin: routeName,
        });
      }
    }
  };

  return (
    <TouchableOpacity
      style={[
        tw`flex-row items-center justify-center gap-1 px-2 border rounded-lg border-black-100`,
        isSelected
          ? tw`border-primary-main bg-primary-main`
          : tw`border-primary-mild-2`,
      ]}
      onPress={onPressBubble}
    >
      <PeachText
        style={[
          tw`leading-loose subtitle-0`,
          isSelected
            ? tw`text-primary-background-light`
            : tw`text-primary-mild-2`,
        ]}
      >
        {children}
      </PeachText>
      <Icon
        id={iconId}
        size={18}
        color={
          isSelected
            ? tw.color("primary-background-light")
            : tw.color("primary-mild-2")
        }
      />
    </TouchableOpacity>
  );
}
