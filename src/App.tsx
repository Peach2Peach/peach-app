import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useReducer } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import { useDeviceContext } from "twrnc";
import { Drawer } from "./components/drawer/Drawer";
import { GlobalPopup } from "./components/popup/GlobalPopup";
import { Toast } from "./components/toast/Toast";
import { useWebSocket } from "./init/websocket";
import { GlobalOverlay } from "./Overlay";
import { queryClient } from "./queryClient";
import { useThemeStore } from "./store/theme"; // Import Zustand theme store
import { DarkTheme, LightTheme } from "./styles/navigationThemes"; // Custom theme files
import tw from "./styles/tailwind";
import {
  getWebSocket,
  PeachWSContext,
  setPeachWS,
} from "./utils/peachAPI/websocket";
import { Screens } from "./views/Screens";

enableScreens();

export const App = () => {
  useDeviceContext(tw);
  const [peachWS, updatePeachWS] = useReducer(setPeachWS, getWebSocket());
  useWebSocket(updatePeachWS);

  // Zustand theme store to manage light/dark mode
  const { isDarkMode } = useThemeStore();

  // Update tailwind styles and navigation theme based on theme state
  const navTheme = isDarkMode ? DarkTheme : LightTheme;

  useEffect(() => {
    // Dynamically update tailwind theme on theme change
    tw.setColorScheme(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <PeachWSContext.Provider value={peachWS}>
        <SafeAreaProvider>
          <NavigationContainer theme={navTheme}>
            <Screens />
            <Drawer />
            <GlobalPopup />
            <GlobalOverlay />
            <Toast />
          </NavigationContainer>
        </SafeAreaProvider>
      </PeachWSContext.Provider>
    </QueryClientProvider>
  );
};