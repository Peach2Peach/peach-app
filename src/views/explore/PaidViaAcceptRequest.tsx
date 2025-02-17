import { useMemo } from "react";
import { View } from "react-native";
import { NewBubble } from "../../components/bubble/Bubble";
import { DrawerOptionType } from "../../components/drawer/components/DrawerOption";
import { useDrawerState } from "../../components/drawer/useDrawerState";
import { PeachText } from "../../components/text/PeachText";
import { useMeetupEvents } from "../../hooks/query/useMeetupEvents";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";

export function PaidViaAcceptRequest({
  paymentMethod,
  setSelectedPaymentData,
}: {
  paymentMethod: PaymentMethod;
  setSelectedPaymentData: (value: PaymentData) => void;
}) {
  return (
    <View style={tw`flex-row items-center self-stretch justify-between px-3`}>
      <PeachText>paid via</PeachText>
      <PaideViaPayementMethodBubble
        paymentMethod={paymentMethod}
        onPress={setSelectedPaymentData}
      >
        {paymentMethod}
      </PaideViaPayementMethodBubble>
    </View>
  );
}

type PaideViaPayementMethodBubbleProps = {
  paymentMethod: PaymentMethod;
  children: React.ReactNode;
  onPress?: (value: PaymentData) => void;
};

function PaideViaPayementMethodBubble({
  paymentMethod,
  children,
  onPress,
}: PaideViaPayementMethodBubbleProps) {
  const paymentDataRecord = usePaymentDataStore((state) => state.paymentData);
  const paymentDataForType = useMemo(
    () =>
      Object.values(paymentDataRecord).filter((p) => p.type === paymentMethod),
    [paymentDataRecord, paymentMethod],
  );
  const hasPaymentData = paymentDataForType.length > 0;
  const hasMultiplePaymentData = paymentDataForType.length > 1;
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
              }),
            ),
            show: true,
          });
        } else {
          onPress(paymentDataForType[0]);
        }
      }
    }
  };

  return (
    <NewBubble color="black" ghost onPress={onPressBubble}>
      {children}
    </NewBubble>
  );
}
