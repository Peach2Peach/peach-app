import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconType } from "../../assets/icons";
import { MSINASECOND } from "../../constants";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";
import { iconMap } from "./iconMap";
import { useTranslate } from "@tolgee/react";

type LevelColorMap = {
  [key in ToastState["color"]]: {
    backgroundColor: string | undefined;
    color: string | undefined;
  };
};
const levelColorMap: LevelColorMap = {
  yellow: {
    backgroundColor: tw.color("warning-mild-1"),
    color: tw.color("black-100"),
  },
  red: {
    backgroundColor: tw.color("error-main"),
    color: tw.color("primary-background-light"),
  },
  white: {
    backgroundColor: tw.color("primary-background-light"),
    color: tw.color("black-100"),
  },
};

const toastAtom = atom<ToastState | null>(null);
export const useSetToast = () => useSetAtom(toastAtom);

const slideAnimation = (value: Animated.Value, toValue: number) =>
  Animated.timing(value, {
    toValue,
    duration: 300,
    useNativeDriver: false,
  });
const TEN = 10;
const DELAY = MSINASECOND * TEN;
const MIN_SWIPE_DISTANCE = 70;

export const Toast = () => {
  const toastState = useAtomValue(toastAtom);
  const setToast = useSetToast();
  const closeToast = useCallback(() => setToast(null), [setToast]);
  const { t } = useTranslate("global");

  const { height } = useWindowDimensions();
  const top = useRef(new Animated.Value(-height)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (toastState) {
      animation = Animated.sequence([
        slideAnimation(top, 0),
        Animated.delay(DELAY),
      ]);
      animation.start(({ finished }) => {
        if (finished && !toastState.keepAlive)
          slideAnimation(top, -height).start(closeToast);
      });
    } else {
      animation = slideAnimation(top, -height);
      animation.start();
    }
    return () => animation.stop();
  }, [closeToast, height, toastState, top]);

  const insets = useSafeAreaInsets();
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, { dy }) => {
        if (dy < 0) top.setValue(dy);
      },
      onPanResponderRelease: (e, { dy }) => {
        if (-dy > MIN_SWIPE_DISTANCE) {
          slideAnimation(top, -height).start(closeToast);
        }
        slideAnimation(top, 0).start();
      },
    }),
  ).current;

  if (!toastState) return null;
  const { color: toastColor, msgKey, bodyArgs = [], action } = toastState;

  const icon = iconMap[msgKey];
  let title = t(`${msgKey}.title`, { ns: msgKey.split(".")[0] });
  let message = t(`${msgKey}.text`, { ns: msgKey.split(".")[0], ...bodyArgs });

  if (title === `${msgKey}.title`) title = "";
  if (message === `${msgKey}.text`) {
    message = t(msgKey, { ns: msgKey.split(".")[0], ...bodyArgs });
  }

  const { color, backgroundColor } = levelColorMap[toastColor];

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        tw`absolute w-full p-sm md:p-md z-1`,
        { paddingTop: insets.top, top },
      ]}
    >
      <View
        style={[
          tw`items-center justify-center gap-2 p-4 pb-3 rounded-2xl`,
          { backgroundColor },
        ]}
      >
        <View style={tw`gap-1`}>
          <View style={tw`flex-row items-center justify-center gap-2`}>
            {!!icon && <Icon id={icon} size={20} color={color} />}
            {!!title && (
              <PeachText style={[tw`text-center h6`, { color }]}>
                {title}
              </PeachText>
            )}
          </View>
          {!!message && (
            <PeachText style={[tw`text-center`, { color }]}>
              {message}
            </PeachText>
          )}
        </View>
        <View style={tw`flex-row items-center justify-between flex-1`}>
          {action && <Action {...action} color={color} />}
          <Action
            iconId="xSquare"
            label={t("close")}
            color={color}
            style={tw`flex-row-reverse`}
          />
        </View>
      </View>
    </Animated.View>
  );
};

type ActionProps = {
  iconId: IconType;
  label: string;
  onPress?: () => void;
  color: string | undefined;
  style?: StyleProp<ViewStyle>;
};

function Action({ iconId, label, onPress, color, style }: ActionProps) {
  const setToast = useSetToast();
  const onPressHandler = () => {
    if (onPress) onPress();
    setToast(null);
  };

  return (
    <TouchableOpacity
      onPress={onPressHandler}
      style={[tw`flex-row items-center flex-1 gap-1`, style]}
    >
      <Icon id={iconId} size={16} color={color} />
      <PeachText style={[tw`subtitle-2`, { color }]}>{label}</PeachText>
    </TouchableOpacity>
  );
}
