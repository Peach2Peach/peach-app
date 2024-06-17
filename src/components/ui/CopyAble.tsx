import Clipboard from "@react-native-clipboard/clipboard";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { Animated, TextStyle, TouchableOpacity } from "react-native";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";
import { useTranslate } from "@tolgee/react";

export type CopyRef = {
  copy: () => void;
};

const textPositions = {
  left: tw`mr-3 right-full`,
  top: tw`mb-1 bottom-full`,
  right: tw`ml-3 left-full`,
  bottom: tw`mt-1 top-full`,
};
type Props = ComponentProps & {
  value?: string;
  color?: TextStyle;
  disabled?: boolean;
  textPosition?: keyof typeof textPositions;
};

export type CopyAbleRef = {
  copy: () => void;
};

function fadeAnimation(opacity: Animated.Value) {
  Animated.sequence([
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      delay: 500,
    }),
  ]).start();
}

export const CopyAble = forwardRef<CopyAbleRef, Props>(
  ({ value, color, disabled, style, textPosition = "top" }, ref) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const { t } = useTranslate("global");

    const copy = useCallback(() => {
      if (!value) return;
      Clipboard.setString(value);
      fadeAnimation(opacity);
    }, [opacity, value]);

    useImperativeHandle(ref, () => ({
      copy,
    }));

    return (
      <TouchableOpacity
        onPress={copy}
        disabled={!value || disabled}
        style={[
          tw`flex-row items-center justify-center w-4 h-4 shrink`,
          style,
          { overflow: "visible" },
        ]}
      >
        <Icon
          id="copy"
          style={tw`w-full h-full`}
          color={color?.color || tw.color("primary-main")}
        />

        <Animated.View
          style={[tw`absolute`, textPositions[textPosition], { opacity }]}
        >
          <PeachText style={[tw`tooltip`, color || tw`text-primary-main`]}>
            {t("copied")}
          </PeachText>
        </Animated.View>
      </TouchableOpacity>
    );
  },
);
