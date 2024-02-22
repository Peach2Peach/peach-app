import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStackNavigation } from "../hooks/useStackNavigation";
import tw from "../styles/tailwind";
import { peachyGradient } from "../utils/layout/peachyGradient";
import { isAndroid } from "../utils/system/isAndroid";
import { isIOS } from "../utils/system/isIOS";
import { DailyTradingLimit } from "../views/settings/profile/DailyTradingLimit";
import { Header } from "./Header";
import { PeachyBackground } from "./PeachyBackground";

type Props = {
  style?: ViewProps["style"];
  header?: React.ReactNode | string;
  showTradingLimit?: boolean;
  gradientBackground?: boolean;
  children: React.ReactNode;
};

export const Screen = ({
  children,
  header,
  showTradingLimit = false,
  gradientBackground = false,
  style,
}: Props) => {
  const insets = useSafeAreaInsets();
  const hasFooter = useStackNavigation().getId() === "homeNavigator";
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(
        gradientBackground ? "light-content" : "dark-content",
        true,
      );
      if (isAndroid())
        StatusBar.setBackgroundColor(
          gradientBackground
            ? peachyGradient[2].color
            : String(tw`text-primary-background-main`.color),
          true,
        );
    }, [gradientBackground]),
  );
  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={isIOS() ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={tw`flex-1`}>
          {gradientBackground && <PeachyBackground />}
          {typeof header === "string" ? <Header title={header} /> : header}
          <View
            style={[
              tw`flex-1`,
              header === undefined && { paddingTop: insets.top },
              !hasFooter && { paddingBottom: insets.bottom },
            ]}
          >
            <View style={[tw`flex-1 p-sm`, tw`md:p-md`, style]}>
              {children}
            </View>
            {showTradingLimit && <DailyTradingLimit />}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
