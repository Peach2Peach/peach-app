import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useAppColorScheme, useDeviceContext } from "twrnc";
import { useThemeStore } from "../store/theme";
import tw from "../styles/tailwind";

/**
 * Single source of truth for the rendered color scheme.
 *
 * twrnc's own device observation stays off: with a "system" preference the
 * device scheme has to reach the store as well, so the `dark:` variants and the
 * components branching on `isDarkMode` flip together instead of drifting apart.
 *
 * Must be used once, at the root, by a component that re-renders the tree —
 * twrnc only re-renders the caller of useAppColorScheme, so everything else
 * repaints off the store subscription.
 */
export const useThemeSync = () => {
  const systemColorScheme = useColorScheme();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const setSystemColorScheme = useThemeStore(
    (state) => state.setSystemColorScheme,
  );

  useDeviceContext(tw, {
    observeDeviceColorSchemeChanges: false,
    initialColorScheme: isDarkMode ? "dark" : "light",
  });
  const [, , setColorScheme] = useAppColorScheme(tw);

  useEffect(() => {
    setSystemColorScheme(systemColorScheme);
  }, [setSystemColorScheme, systemColorScheme]);

  useEffect(() => {
    setColorScheme(isDarkMode ? "dark" : "light");
    // setColorScheme is rebuilt on every render by twrnc, so listing it here
    // would run this effect in a loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode]);

  return isDarkMode;
};
