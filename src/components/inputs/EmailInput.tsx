import { enforceEmailFormat } from "../../utils/format/enforceEmailFormat";
import { Input, InputProps } from "./Input";
import { tolgee } from "../../tolgee";

export const EmailInput = ({ onChangeText, ...props }: InputProps) => (
  <Input
    placeholder={tolgee.t("form.email.placeholder", { ns: "form" })}
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
