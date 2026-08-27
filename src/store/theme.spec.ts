import { Appearance } from "react-native";
import { resolveIsDarkMode, useThemeStore } from "./theme";

describe("resolveIsDarkMode", () => {
  it("follows the device scheme for the system preference", () => {
    expect(resolveIsDarkMode("system", "dark")).toBe(true);
    expect(resolveIsDarkMode("system", "light")).toBe(false);
  });
  it("ignores the device scheme for explicit preferences", () => {
    expect(resolveIsDarkMode("dark", "light")).toBe(true);
    expect(resolveIsDarkMode("light", "dark")).toBe(false);
  });
  it("treats an unknown device scheme as light", () => {
    expect(resolveIsDarkMode("system", null)).toBe(false);
    expect(resolveIsDarkMode("system", undefined)).toBe(false);
  });
});

describe("useThemeStore", () => {
  const { setThemePreference, cycleThemePreference, setSystemColorScheme } =
    useThemeStore.getState();

  beforeEach(() => {
    jest.spyOn(Appearance, "getColorScheme").mockReturnValue("light");
    setThemePreference("system");
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("defaults to following the device", () => {
    expect(useThemeStore.getState().themePreference).toBe("system");
  });

  it("cycles light -> dark -> system", () => {
    setThemePreference("light");
    cycleThemePreference();
    expect(useThemeStore.getState().themePreference).toBe("dark");
    cycleThemePreference();
    expect(useThemeStore.getState().themePreference).toBe("system");
    cycleThemePreference();
    expect(useThemeStore.getState().themePreference).toBe("light");
  });

  it("resolves isDarkMode when the preference changes", () => {
    setThemePreference("dark");
    expect(useThemeStore.getState().isDarkMode).toBe(true);
    setThemePreference("light");
    expect(useThemeStore.getState().isDarkMode).toBe(false);
  });

  it("follows device scheme changes while on system", () => {
    setSystemColorScheme("dark");
    expect(useThemeStore.getState().isDarkMode).toBe(true);
    setSystemColorScheme("light");
    expect(useThemeStore.getState().isDarkMode).toBe(false);
  });

  it("ignores device scheme changes while on an explicit preference", () => {
    setThemePreference("light");
    setSystemColorScheme("dark");
    expect(useThemeStore.getState().isDarkMode).toBe(false);
  });
});
