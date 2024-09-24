import { Fragment, useCallback, useEffect, useRef } from "react";
import {
  Animated,
  BackHandler,
  Easing,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";

import { shallow } from "zustand/shallow";
import tw from "../../styles/tailwind";
import { PeachScrollView } from "../PeachScrollView";
import { HorizontalLine } from "../ui/HorizontalLine";
import { DrawerHeader } from "./components/DrawerHeader";
import { DrawerOption } from "./components/DrawerOption";
import { useDrawerState } from "./useDrawerState";

const animConfig = {
  duration: 300,
  easing: Easing.ease,
  useNativeDriver: false,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SEVENTY_FIVE_PERCENT = 0.75;

export const Drawer = () => {
  const [{ content, show, onClose, options, previousDrawer }, updateDrawer] =
    useDrawerState((state) => [state, state.updateDrawer], shallow);
  const { height } = useWindowDimensions();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showAnimations = [
      Animated.timing(slideAnim, {
        toValue: height * SEVENTY_FIVE_PERCENT,
        delay: 50,
        ...animConfig,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.4,
        delay: 0,
        ...animConfig,
      }),
    ];
    if (show && (content || options.length))
      Animated.parallel(showAnimations).start();
  }, [content, fadeAnim, height, options.length, show, slideAnim]);

  const closeDrawer = useCallback(() => {
    const closeAnimations = [
      Animated.timing(slideAnim, {
        toValue: 0,
        ...animConfig,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        ...animConfig,
      }),
    ];
    Animated.parallel(closeAnimations).start(() => {
      updateDrawer({ show: false });
      if (onClose) onClose();
    });
  }, [fadeAnim, onClose, slideAnim, updateDrawer]);

  useEffect(() => {
    const listener = BackHandler.addEventListener("hardwareBackPress", () => {
      if (previousDrawer) {
        updateDrawer(previousDrawer);
      } else {
        closeDrawer();
      }
      return show;
    });
    return () => {
      listener.remove();
    };
  }, [closeDrawer, previousDrawer, show, updateDrawer]);

  return (
    <View
      style={[
        tw`absolute top-0 left-0 z-20 w-full h-full`,
        !show && tw`hidden`,
      ]}
    >
      <AnimatedPressable
        onPress={closeDrawer}
        style={[tw`absolute w-full h-full bg-black-100`, { opacity: fadeAnim }]}
      />
      <Animated.View
        style={[
          tw`px-4 py-6 mt-auto bg-primary-background-light rounded-t-3xl`,
          { maxHeight: slideAnim },
        ]}
      >
        <DrawerHeader closeDrawer={closeDrawer} />
        <DrawerOptions />
      </Animated.View>
    </View>
  );
};

function DrawerOptions() {
  const { content, options } = useDrawerState(
    (state) => ({
      content: state.content,
      options: state.options,
    }),
    shallow,
  );
  const $scroll = useRef<ScrollView>(null);

  useEffect(() => {
    if (options.length || content) {
      $scroll.current?.scrollTo({ y: 0, animated: false });
    }
  }, [options, content, $scroll]);

  return (
    <PeachScrollView style={tw`pt-6`} ref={$scroll} contentStyle={tw`gap-6`}>
      {options.map((option, i) => (
        <Fragment key={`drawer-option-${option}-${i}`}>
          <DrawerOption {...option} />
          <HorizontalLine
            style={
              (option.highlighted || options[i + 1]?.highlighted) &&
              tw`bg-primary-mild-1`
            }
          />
        </Fragment>
      ))}
      {!options.length && content}
    </PeachScrollView>
  );
}
