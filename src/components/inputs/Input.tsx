import { useMemo } from "react";
import {
  TextInput,
  View
} from "react-native";
import { useThemeStore } from "../../store/theme"; // Import for theme state check
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { TouchableIcon } from "../TouchableIcon";
import { PeachText } from "../text/PeachText";

const themes = {
  default: {
    label: tw`text-black-100`,
    text: "text-black-100",
    textError: "text-black-100",
    border: tw`border-black-100`,
    borderError: tw`border-error-main`,
    borderDisabled: tw`text-black-65`,
    bg: tw`bg-primary-background-light-color`,
    bgError: tw`bg-primary-background-light-color`,
    bgDisabled: tw`bg-transparent`,
    error: tw`text-error-main`,
    placeholder: "text-black-25",
    optional: tw`text-black-25`,
  },
  inverted: {
    label: tw`text-primary-background-light-color`,
    text: "text-primary-background-light-color",
    textError: "text-error-main",
    border: tw`border-primary-background-light-color`,
    borderError: tw`border-primary-background-light-color`,
    borderDisabled: tw`border-primary-background-light-color`,
    bg: tw`bg-transparent`,
    bgError: tw`bg-primary-background-light-color`,
    bgDisabled: tw`bg-transparent`,
    error: tw`text-primary-background-light-color`,
    placeholder: "text-primary-mild-1",
    optional: tw`text-black-25`,
  },
};

export const Input = ({
  value,
  label,
  icons = [],
  iconColor,
  required = true,
  multiline = false,
  disabled = false,
  errorMessage = [],
  autoCapitalize = "none",
  style,
  theme = "default",
  reference,
  ...inputProps
}: InputProps) => {
  const { isDarkMode } = useThemeStore(); // Check dark mode state

  // Select theme based on dark mode
  const selectedTheme = useMemo(
    () => (isDarkMode ? themes.inverted : themes[theme]),
    [isDarkMode, theme]
  );

  const {
    bgDisabled,
    bg,
    borderDisabled,
    border,
    bgError,
    borderError,
    text,
    placeholder,
    textError,
    error,
  } = selectedTheme;
  const showError = errorMessage.length > 0 && !disabled && !!value;

  return (
    <View>
      {!!label && (
        <PeachText style={[tw`pl-2 input-title`, tw.style(text)]}>
          {label}
          {!required && (
            <PeachText
              style={tw.style(placeholder)}
            >{` (${i18n("form.optional")})`}</PeachText>
          )}
        </PeachText>
      )}
      <View
        style={[
          tw`flex-row items-center justify-between w-full gap-1 px-3`,
          tw`overflow-hidden border rounded-xl`,
          disabled ? bgDisabled : bg,
          disabled ? borderDisabled : border,
          showError && bgError,
          showError && borderError,
          showError ? tw`border-2` : tw`my-px`,
          style,
        ]}
      >
        <TextInput
          style={[
            tw`w-full h-10 py-0 shrink input-text`,
            tw.style(value ? text : placeholder),
            showError && tw.style(textError),
            !showError && tw`border border-transparent`,
            multiline && tw`justify-start h-full pt-2`,
          ]}
          value={value}
          ref={reference ? reference : null}
          placeholderTextColor={tw.color(placeholder)}
          allowFontScaling={false}
          removeClippedSubviews={false}
          editable={!disabled}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          autoCapitalize={autoCapitalize}
          blurOnSubmit={false}
          autoCorrect={false}
          {...inputProps}
        />
        <View style={tw`flex-row gap-4`}>
          {icons.map(([icon, action], index) => (
            <TouchableIcon
              onPress={action}
              key={`inputIcon-${icon}-${index}`}
              id={icon}
              iconColor={
                iconColor ? iconColor : tw.color(showError ? textError : text)
              }
              iconSize={20}
            />
          ))}
        </View>
      </View>
      <PeachText style={[tw`mt-1 ml-3 tooltip`, error]}>
        {showError ? errorMessage[0] : " "}
      </PeachText>
    </View>
  );
};
