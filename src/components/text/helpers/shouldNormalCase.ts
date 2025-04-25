import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { languageState } from "../../../utils/i18n";

export const shouldNormalCase = (style: StyleProp<TextStyle>) =>
  languageState.locale === "el-GR" &&
  StyleSheet.flatten(style).textTransform === "uppercase";
