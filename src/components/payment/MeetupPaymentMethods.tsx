import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { useThemeStore } from "../../store/theme";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";
import { LinedText } from "../ui/LinedText";
import { PaymentDetailsCheckbox } from "./PaymentDetailsCheckbox";
import { PaymentDataKeyFacts } from "./components/PaymentDataKeyFacts";

type Props = {
  isEditing: boolean;
  editItem: (data: PaymentData) => void;
  toggle: (value: string) => void;
  isSelected: (item: { value: string }) => boolean;
};

export const MeetupPaymentMethods = ({
  isEditing,
  editItem,
  toggle,
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
        <LinedText style={tw`gap-1 pb-3`}>
          <PeachText
            style={tw.style(
              `h6`,
              isDarkMode ? "text-backgroundLight-light" : "text-black-65",
            )}
          >
            {i18n("paymentSection.meetups")}
          </PeachText>
          <Icon
            color={tw.color(isDarkMode ? "backgroundLight-light" : "black-65")}
            id={"users"}
          />
        </LinedText>
      )}
      <View style={tw`gap-4`}>
        {paymentData
          .filter((item) => !item.hidden && isCashTrade(item.type))
          .map((item) => (
            <View key={item.id} style={tw`gap-1`}>
              <PaymentDetailsCheckbox
                onPress={() => (isEditing ? editItem(item) : toggle(item.id))}
                item={{
                  value: item.id,
                  display: (
                    <PeachText style={tw`subtitle-1`}>{item.label}</PeachText>
                  ),
                }}
                checked={isSelected({ value: item.id })}
                editing={isEditing}
              />
              <PaymentDataKeyFacts paymentData={item} />
            </View>
          ))}
      </View>
    </>
  );
};
