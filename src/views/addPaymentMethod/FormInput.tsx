import { useMemo } from "react";
import { Control, useController } from "react-hook-form";
import { PaymentMethodField } from "../../../peach-api/src/@types/payment";
import { Input, InputProps } from "../../components/inputs/Input";
import { Formatter, formatters } from "../../utils/validation/formatters";
import { getMessages } from "../../utils/validation/getMessages";
import { getValidators } from "../../utils/validation/validators";
import { FormType } from "./PaymentMethodForm";
import { useTranslate } from "@tolgee/react";

type Props = {
  control: Control<FormType>;
  name: PaymentMethodField;
  optional?: boolean;
  defaultValue?: string;
} & InputProps;

export function FormInput({
  control,
  name,
  optional = false,
  defaultValue = "",
  ...inputProps
}: Props) {
  const { t } = useTranslate("form");
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    defaultValue,
    name,
    rules: {
      required: optional ? false : getMessages().required,
      validate: getValidators(name, optional),
    },
  });

  const inputFormatter = useMemo(() => {
    const result = Formatter.safeParse(name);
    return result.success ? formatters[result.data] : (val: string) => val;
  }, [name]);

  return (
    <Input
      label={t(`form.${name}`)}
      placeholder={t(`form.${name}.placeholder`)}
      value={field.value}
      errorMessage={error?.message ? [error.message] : undefined}
      onChangeText={field.onChange}
      keyboardType={
        name === "phone"
          ? "phone-pad"
          : name === "email"
            ? "email-address"
            : undefined
      }
      onEndEditing={(e) => field.onChange(inputFormatter(e.nativeEvent.text))}
      onSubmitEditing={(e) =>
        field.onChange(inputFormatter(e.nativeEvent.text))
      }
      required={!optional}
      {...inputProps}
    />
  );
}
