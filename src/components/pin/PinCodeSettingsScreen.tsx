import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PinCodeDisplay } from "../../components/pin/PinCodeDisplay";
import { PinCodeInput } from "../../components/pin/PinCodeInput";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export const PinCodeSettingsScreen = ({
  headerComponent,
  mainText,
  subText,
  currentPin,
  onDigitPress,
  onDigitDelete,
  onPinConfirm,
}: {
  headerComponent: React.ReactNode;
  mainText: string;
  subText: string;
  currentPin: string;
  onDigitPress: (s: string) => void;
  onDigitDelete: () => void;
  onPinConfirm: () => void;
}) => {
  return (
    <Screen header={headerComponent}>
      <View
        style={tw`flex-1 flex-col justify-between items-start pb-4 self-stretch`}
      >
        <View style={[tw`flex-col items-start self-stretch`, { gap: 16 }]}>
          <View style={[tw`flex-col items-start self-stretch`, { gap: 8 }]}>
            <PeachText style={[tw`body-l`, { fontWeight: "bold" }]}>
              {mainText}
            </PeachText>
            {/* <PeachText style={tw`text-black-50`}>{subText}</PeachText> */}
            <PeachText style={tw`text-black-50`}>{""}</PeachText>
          </View>
          <PinCodeDisplay currentPin={currentPin} />
        </View>
        <PinCodeInput
          currentPin={currentPin}
          onDigitPress={onDigitPress}
          onDelete={onDigitDelete}
        />

        <Button
          disabled={currentPin.length < 4}
          onPress={onPinConfirm}
          style={tw`self-center self-stretch`}
        >
          {i18n("confirm")}
        </Button>
      </View>
    </Screen>
  );
};
