import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { Button } from "../../components/buttons/Button";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

import successAnimation from "../../assets/animation/successAnimation.json";

export const MobilePendingActionFundMultipleEscrowSuccess = () => {
  const navigation = useStackNavigation();
  const navigateHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "homeScreen", params: { screen: "home" } }],
    });
  };
  const navigateToActions = () => {
    navigation.reset({
      index: 1,
      routes: [
        { name: "homeScreen", params: { screen: "home" } },
        { name: "mobilePendingActions" },
      ],
    });
  };

  const animationRef = useRef<LottieView>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleAnimationFinish = () => {
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Screen
      header={
        <Header
          title={i18n("connectToDesktop.mobilePendingActions.fundMultipleEscrow")}
        />
      }
    >
      <View style={tw`flex-1 justify-between px-4`}>
        <View style={tw`flex-1 items-center justify-center`}>
          {showAnimation && (
            <LottieView
              ref={animationRef}
              source={successAnimation}
              autoPlay
              loop={false}
              style={{ width: 180, height: 180 }}
              onAnimationFinish={handleAnimationFinish}
            />
          )}

          <Animated.View
            style={{
              opacity: contentOpacity,
              width: "100%",
              alignItems: "center",
            }}
          >
            <PeachText
              style={tw`text-xl font-semibold text-center tracking-wide mt-4`}
            >
              {i18n(
                "connectToDesktop.mobilePendingActions.fundMultipleEscrow.successTitle",
              )}
            </PeachText>

            <PeachText
              style={tw`text-base text-center font-medium text-gray-500 mt-2`}
            >
              {i18n(
                "connectToDesktop.mobilePendingActions.fundMultipleEscrow.successDescription",
              )}
            </PeachText>
          </Animated.View>
        </View>

        <Animated.View
          style={{
            opacity: contentOpacity,
            paddingBottom: 16,
            alignItems: "center",
          }}
        >
          <Button onPress={navigateToActions} style={tw`mb-3`}>
            {i18n("connectToDesktop.mobilePendingActions.goActions")}
          </Button>
          <Button onPress={navigateHome}>
            {i18n("connectToDesktop.mobilePendingActions.goHome")}
          </Button>
        </Animated.View>
      </View>
    </Screen>
  );
};
