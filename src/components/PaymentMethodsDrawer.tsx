import { useMemo } from "react";
import { View } from "react-native";
import { PaymentMethod } from "../../peach-api/src/@types/payment";
import { useMeetupEvents } from "../hooks/query/useMeetupEvents";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { isCashTrade } from "../utils/paymentMethod/isCashTrade";
import { usePaymentMethods } from "../views/addPaymentMethod/usePaymentMethodInfo";
import { SelectionDrawer } from "./SelectionDrawer";
import { Button } from "./buttons/Button";
import { PeachText } from "./text/PeachText";

interface PaymentMethodsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPaymentMethods: PaymentMethod[];
  onTogglePaymentMethod: (paymentMethod: PaymentMethod) => void;
  paymentMethodOfferAmounts: Partial<Record<PaymentMethod, number>>;
  onReset?: () => void;
}

export function PaymentMethodsDrawer({
  isOpen,
  onClose,
  selectedPaymentMethods,
  onTogglePaymentMethod,
  paymentMethodOfferAmounts,
  onReset,
}: PaymentMethodsDrawerProps) {
  const { data: paymentMethods } = usePaymentMethods();
  const { data: meetupEvents } = useMeetupEvents();

  const items = useMemo(() => {
    if (!paymentMethods || !meetupEvents) return [];

    return paymentMethods
      .map((paymentMethod) => {
        const numberOfOffers =
          paymentMethodOfferAmounts?.[paymentMethod.id] || 0;
        if (isCashTrade(paymentMethod.id)) {
          const longName = meetupEvents.find(
            (event) => event.id === paymentMethod.id,
          )?.longName;
          return {
            paymentMethod: {
              ...paymentMethod,
              longName,
            },
            numberOfOffers,
          };
        }
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
              {"longName" in paymentMethod
                ? paymentMethod.longName
                : `${i18n(`paymentMethod.${paymentMethod.id}`)}`}
            </PeachText>
            <PeachText style={tw`flex-wrap body-m text-black-50 shrink`}>
              {" "}
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
    meetupEvents,
    paymentMethodOfferAmounts,
    selectedPaymentMethods,
    onTogglePaymentMethod,
  ]);

  if (!paymentMethods) return null;

  return (
    <SelectionDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        selectedPaymentMethods.length > 0
          ? `${i18n("paymentMethods.title")} (${selectedPaymentMethods.length})`
          : i18n("paymentMethods.title")
      }
      items={items}
      type="checkbox"
      resetButton={
        onReset && (
          <Button
            textColor={tw.color(
              selectedPaymentMethods.length > 0 ? "success-main" : "black-50",
            )}
            style={tw`py-1 border md:py-2`}
            disabled={selectedPaymentMethods.length === 0}
            onPress={onReset}
            ghost
          >
            reset all
          </Button>
        )
      }
    />
  );
}
