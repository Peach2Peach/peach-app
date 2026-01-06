import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useReducer } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import { useDeviceContext } from "twrnc";
import { GlobalOverlay } from "./Overlay";
import { PinProtectionOverlayComponent } from "./PinProtectionOverlayComponent";
import { useAppPinProtection } from "./appPinProtectionListener";
import { Drawer } from "./components/drawer/Drawer";
import { GlobalPopup } from "./components/popup/GlobalPopup";
import { Toast } from "./components/toast/Toast";
import { useWebSocket } from "./init/websocket";
import { queryClient } from "./queryClient";
import { useThemeStore } from "./store/theme";
import { DarkTheme, LightTheme } from "./styles/navigationThemes";
import tw from "./styles/tailwind";
import {
  PeachWSContext,
  getWebSocket,
  setPeachWS,
} from "./utils/peachAPI/websocket";
import { Screens } from "./views/Screens";

enableScreens();

export const App = () => {
  useAppPinProtection();
  const [peachWS, updatePeachWS] = useReducer(setPeachWS, getWebSocket());
  useWebSocket(updatePeachWS);

  const { isDarkMode } = useThemeStore();
  useDeviceContext(tw, {
    observeDeviceColorSchemeChanges: false,
    initialColorScheme: isDarkMode ? "dark" : "light",
  });

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <PeachWSContext.Provider value={peachWS}>
          <SafeAreaProvider>
            <NavigationContainer
              theme={isDarkMode ? DarkTheme : LightTheme}
              navigationInChildEnabled
            >
              <Screens />
              <Drawer />
              <GlobalPopup />
              <GlobalOverlay />
              <Toast />
              <PinProtectionOverlayComponent />
            </NavigationContainer>
          </SafeAreaProvider>
        </PeachWSContext.Provider>
      </KeyboardProvider>
    </QueryClientProvider>
  );
};
