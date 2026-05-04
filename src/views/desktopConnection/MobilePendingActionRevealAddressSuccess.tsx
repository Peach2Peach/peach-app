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

export const MobilePendingActionRevealAddressSuccess = () => {
  const navigation = useStackNavigation();
  const navigateHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "homeScreen", params: { screen: "home" } }],
    });
  };

  const animationRef = useRef<LottieView>(null);

  const [showAnimation, setShowAnimation] = useState(false);

  // Animated opacity for content
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animation after short delay
    const timer = setTimeout(() => setShowAnimation(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Called when Lottie animation finishes
  const handleAnimationFinish = () => {
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Screen
      header={<Header title={i18n("connectToDesktop.mobilePendingActions.paymentMade")} />}
    >
      <View style={tw`flex-1 justify-between px-4`}>
        {/* Center Content */}
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

          {/* Animated content (always occupying space) */}
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
              {i18n("You have declared the Payment as Made!")}
            </PeachText>

            <PeachText
              style={tw`text-base text-center font-medium text-gray-500 mt-2`}
            >
              {
                "It's the Seller's turn to confirm he received the payment, and send you the Bitcoin!"
              }
            </PeachText>
          </Animated.View>
        </View>

        {/* Animated button (occupies space, fades in) */}
        <Animated.View
          style={{
            opacity: contentOpacity,
            paddingBottom: 16,
            alignItems: "center",
          }}
        >
          <Button onPress={navigateHome}>{"Go Home"}</Button>
        </Animated.View>
      </View>
    </Screen>
  );
};
