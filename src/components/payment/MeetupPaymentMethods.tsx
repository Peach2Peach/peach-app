import { View } from "react-native";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import tw from "../../styles/tailwind";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { isValidPaymentData } from "../../utils/paymentMethod/isValidPaymentData";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";
import { LinedText } from "../ui/LinedText";
import { PaymentDetailsCheckbox } from "./PaymentDetailsCheckbox";
import { PaymentDataKeyFacts } from "./components/PaymentDataKeyFacts";
import { useTranslate } from "@tolgee/react";

const mapPaymentDataToCheckboxes = (data: PaymentData) => ({
  value: data.id,
  display: <PeachText style={tw`subtitle-1`}>{data.label}</PeachText>,
  isValid: isValidPaymentData(data),
  data,
});

type Props = {
  isEditing: boolean;
  editItem: (data: PaymentData) => void;
  select: (value: string) => void;
  isSelected: (item: { value: string }) => boolean;
};

export const MeetupPaymentMethods = ({
  isEditing,
  editItem,
  select,
  isSelected,
}: Props) => {
  const paymentData = usePaymentDataStore((state) =>
    state.getPaymentDataArray(),
  );
  const { t } = useTranslate("paymentMethod");

  return (
    <>
      {paymentData.filter((item) => isCashTrade(item.type)).length !== 0 && (
        <LinedText style={tw`pb-3`}>
          <PeachText style={tw`mr-1 h6 text-black-65`}>
            {t("paymentSection.meetups")}
          </PeachText>
          <Icon color={tw.color("black-65")} id={"users"} />
        </LinedText>
      )}
      {paymentData
        .filter((item) => !item.hidden)
        .filter((item) => isCashTrade(item.type))
        .map(mapPaymentDataToCheckboxes)
        .map((item, i) => (
          <View key={item.data.id} style={i > 0 ? tw`mt-4` : {}}>
            <PaymentDetailsCheckbox
              onPress={() =>
                isEditing ? editItem(item.data) : select(item.value)
              }
              item={item}
              checked={isSelected(item)}
              editing={isEditing}
            />
            <PaymentDataKeyFacts style={tw`mt-1`} paymentData={item.data} />
          </View>
        ))}
    </>
  );
};
