import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { useThemeStore } from "../../store/theme";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { isValidPaymentData } from "../../utils/paymentMethod/isValidPaymentData";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";
import { LinedText } from "../ui/LinedText";
import { PaymentDetailsCheckbox } from "./PaymentDetailsCheckbox";
import { PaymentDataKeyFacts } from "./components/PaymentDataKeyFacts";

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
  const { isDarkMode } = useThemeStore();
  const paymentData = usePaymentDataStore(
    (state) => Object.values(state.paymentData),
    shallow,
  );

  return (
    <>
      {paymentData.filter((item) => isCashTrade(item.type)).length !== 0 && (
        <LinedText style={tw`pb-3`}>
          <PeachText
            style={tw.style(
              `mr-1 h6`,
              isDarkMode ? "text-backgroundLight" : "text-black-65",
            )}
          >
            {i18n("paymentSection.meetups")}
          </PeachText>
          <Icon
            color={tw.color(isDarkMode ? "backgroundLight" : "black-65")}
            id={"users"}
          />
        </LinedText>
      )}
      {paymentData
        .filter((item) => !item.hidden)
        .filter((item) => isCashTrade(item.type))
        .map(mapPaymentDataToCheckboxes)
        .map((item, i) => (
          <View key={item.data.id} style={[tw`gap-1`, i > 0 && tw`mt-4`]}>
            <PaymentDetailsCheckbox
              onPress={() =>
                isEditing ? editItem(item.data) : select(item.value)
              }
              item={item}
              checked={isSelected(item)}
              editing={isEditing}
            />
            <PaymentDataKeyFacts paymentData={item.data} />
          </View>
        ))}
    </>
  );
};
