import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";

export const shouldNormalCase = (style: StyleProp<TextStyle>) =>
  useSettingsStore.getState().locale === "el-GR" &&
  StyleSheet.flatten(style).textTransform === "uppercase";
