import { useEffect, useMemo, useRef } from "react";
import { Animated, View } from "react-native";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { Button } from "../../buttons/Button";

type Props = {
  onPress: () => void;
  onTimerFinished: () => void;
};

export const TIMER_DURATION = 5000;

const startTimer = (timer: Animated.Value, onTimerFinished: () => void) => {
  Animated.timing(timer, {
    toValue: 0,
    duration: TIMER_DURATION,
    useNativeDriver: false,
  }).start(({ finished }) => {
    if (!finished) return;
    onTimerFinished();
  });
};
const narrow = Number(tw`w-39`.width);

export const UndoButton = ({ onPress, onTimerFinished }: Props) => {
  const timer = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startTimer(timer, onTimerFinished);
  }, [onTimerFinished, timer]);

  const width = useMemo(
    () =>
      timer.interpolate({
        inputRange: [0, 1],
        outputRange: [0, narrow],
      }),
    [timer],
  );
  const sharedProps = {
    onPress,
    iconId: "rotateCounterClockwise",
    textColor: tw.color("black-100"),
  } as const;

  return (
    <View style={tw`items-center justify-center min-w-39`}>
      <Animated.View style={[tw`self-start overflow-hidden`, { width }]}>
        <Button {...sharedProps} style={tw`bg-primary-background-light w-39`}>
          {i18n("search.undo")}
        </Button>
      </Animated.View>

      <Button
        {...sharedProps}
        style={[tw`absolute w-39`, { backgroundColor: "#FFFCFA80" }]}
      >
        {i18n("search.undo")}
      </Button>
    </View>
  );
};
