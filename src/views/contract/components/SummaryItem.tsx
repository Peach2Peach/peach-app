import type { ReactElement } from "react";
import Clipboard from "@react-native-clipboard/clipboard";
import { useRef } from "react";
import { Animated, TextProps, View } from "react-native";
import { TouchableIcon } from "../../../components/TouchableIcon";
import { PeachText } from "../../../components/text/PeachText";
import { useIsMediumScreen } from "../../../hooks/useIsMediumScreen";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

type Props = {
  label: string;
  value: ReactElement;
};

export const SummaryItem = ({ label, value }: Props) => {
  const { isDarkMode } = useThemeStore();
  return (
    <View style={tw`flex-row items-center justify-between gap-3`}>
      <PeachText
        style={[
          tw`md:body-l`,
          isDarkMode ? tw`text-black-50` : tw`text-black-65`,
        ]}
      >
        {label}
      </PeachText>
      {value}
    </View>
  );
};

type TextValueProps = {
  value: string;
  copyable?: boolean;
  copyValue?: string;
  onPress?: TextProps["onPress"];
};

function TextValue({
  value,
  copyable = false,
  copyValue = value,
  onPress,
}: TextValueProps) {
  return (
    <View style={tw`flex-row items-center justify-end flex-1 gap-10px`}>
      {copyable ? (
        <CopyableSummaryText
          value={value}
          copyValue={copyValue}
          onPress={onPress}
        />
      ) : (
        <SummaryText value={value} onPress={onPress} />
      )}
    </View>
  );
}
const summaryTextStyle = tw`text-right subtitle-1 md:subtitle-0`;
function SummaryText({ value, onPress }: TextValueProps) {
  return (
    <PeachText style={[tw`flex-1`, summaryTextStyle]} onPress={onPress}>
      {value}
    </PeachText>
  );
}

const DELAY = 1500;
const MEDIUM_SCREEN_ICON_SIZE = 20;
const SMALL_SCREEN_ICON_SIZE = 16;
function CopyableSummaryText({
  value,
  copyValue = value,
  onPress,
}: TextValueProps) {
  const copiedTextOpacity = useRef(new Animated.Value(0)).current;
  const onCopy = () => {
    Clipboard.setString(copyValue);
    Animated.sequence([
      Animated.timing(copiedTextOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(DELAY),
      Animated.timing(copiedTextOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const isMediumScreen = useIsMediumScreen();
  const { isDarkMode } = useThemeStore();

  return (
    <>
      <View style={tw`flex-1`}>
        <SummaryText value={value} onPress={onPress} />
        <Animated.View
          style={[
            tw`absolute items-end justify-center w-full h-full`,
            isDarkMode
              ? tw`bg-backgroundMain-dark`
              : tw`bg-primary-background-main`,
            { opacity: copiedTextOpacity },
          ]}
        >
          <PeachText style={[summaryTextStyle, tw`text-primary-main`]}>
            {i18n("copied")}
          </PeachText>
        </Animated.View>
      </View>
      <TouchableIcon
        onPress={onCopy}
        id="copy"
        iconSize={
          isMediumScreen ? MEDIUM_SCREEN_ICON_SIZE : SMALL_SCREEN_ICON_SIZE
        }
      />
    </>
  );
}

SummaryItem.Text = TextValue;
