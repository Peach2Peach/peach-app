import { TouchableOpacity, View } from "react-native";
import { IconType } from "../../../assets/icons";
import { useMeetupEvents } from "../../../hooks/query/useMeetupEvents";
import { useRoute } from "../../../hooks/useRoute";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore/usePaymentDataStore";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { keys } from "../../../utils/object/keys";
import { getPaymentMethods } from "../../../utils/paymentMethod/getPaymentMethods";
import { isCashTrade } from "../../../utils/paymentMethod/isCashTrade";
import { paymentMethodAllowedForCurrency } from "../../../utils/paymentMethod/paymentMethodAllowedForCurrency";
import { Icon } from "../../Icon";
import { useDrawerState } from "../../drawer/useDrawerState";
import { PeachText } from "../../text/PeachText";

type Props = {
  meansOfPayment: MeansOfPayment;
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  selectedPaymentData: PaymentData | undefined;
  setSelectedPaymentData: (paymentData: PaymentData | undefined) => void;
};

export function PaymentMethodSelector({
  meansOfPayment,
  selectedCurrency,
  setSelectedCurrency,
  selectedPaymentData,
  setSelectedPaymentData,
}: Props) {
  const allPaymentMethods = getPaymentMethods(meansOfPayment);
  const availableCurrencies = keys(meansOfPayment);

  const availablePaymentMethods = allPaymentMethods.filter((p) =>
    paymentMethodAllowedForCurrency(p, selectedCurrency),
  );
  const { data: meetupEvents } = useMeetupEvents();
  const getPaymentMethodName = (paymentMethod: PaymentMethod) => {
    if (isCashTrade(paymentMethod)) {
      const eventId = paymentMethod.replace("cash.", "");
      const meetupEvent = meetupEvents?.find(({ id }) => id === eventId);
      return meetupEvent?.shortName ?? eventId;
    }
    return i18n(`paymentMethod.${paymentMethod}`);
  };
  const items = availablePaymentMethods.map((p) => ({
    value: p,
    display: getPaymentMethodName(p),
  }));

  const accountPaymentData = usePaymentDataStore((state) =>
    state.getPaymentDataArray(),
  );

  const onCurrencyChange = (currency: Currency) => {
    const allMethodsForNextCurrency = allPaymentMethods.filter((p) =>
      paymentMethodAllowedForCurrency(p, currency),
    );
    const dataForNextCurrency = accountPaymentData.filter((d) =>
      allMethodsForNextCurrency.includes(d.type),
    );
    const newData =
      dataForNextCurrency.length === 1 ? dataForNextCurrency[0] : undefined;
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
        <View
          style={tw`flex-row flex-wrap items-center self-stretch justify-center gap-1`}
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
        </View>
        <CustomSelector
          selectedCurrency={selectedCurrency}
          selectedValue={selectedPaymentData?.type}
          selectedPaymentData={selectedPaymentData}
          onPress={setSelectedPaymentData}
          items={items}
        />
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
  const paymentDataForType = getAllPaymentDataByType(paymentMethod);
  const hasPaymentData = paymentDataForType.length > 0;
  const hasMultiplePaymentData = paymentDataForType.length > 1;
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
          origin: routeName,
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
