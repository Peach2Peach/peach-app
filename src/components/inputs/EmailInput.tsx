import { enforceEmailFormat } from "../../utils/format/enforceEmailFormat";
import { Input, InputProps } from "./Input";
import { useTranslate } from "@tolgee/react";

export const EmailInput = ({ onChangeText, ...props }: InputProps) => {
  const { t } = useTranslate("form");

  return (
    <Input
      placeholder={t("form.email.placeholder")}
      {...props}
      keyboardType="email-address"
      onChangeText={onChangeText}
      onEndEditing={
        onChangeText
          ? (e) => onChangeText(enforceEmailFormat(e.nativeEvent.text))
          : undefined
      }
    />
  );
};
