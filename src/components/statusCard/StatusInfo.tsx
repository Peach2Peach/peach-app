import { memo, type ReactElement } from "react";
import { StyleProp, TextStyle, View } from "react-native";
import tw from "../../styles/tailwind";
import { FixedHeightText } from "../text/FixedHeightText";

type Props = {
  title: string;
  icon?: ReactElement;
  subtext: string;
  onPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
  subtextStyle?: StyleProp<TextStyle>;
};

export const StatusInfo = memo(
  ({ icon, title, subtext, onPress, titleStyle, subtextStyle }: Props) => (
    <View style={tw`gap-1 shrink`}>
      <FixedHeightText
        height={17}
        style={[tw`subtitle-1`, titleStyle]}
        numberOfLines={1}
      >
        {title}
      </FixedHeightText>

      <View style={tw`flex-row items-center gap-6px`}>
        {icon}
        <FixedHeightText
          style={[tw`body-s text-black-65`, subtextStyle]}
          numberOfLines={1}
          height={17}
          onPress={onPress}
          suppressHighlighting={!onPress}
        >
          {subtext}
        </FixedHeightText>
      </View>
    </View>
  ),
);
