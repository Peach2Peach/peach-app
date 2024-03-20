import { Control, useController } from "react-hook-form";
import { Input, InputProps } from "../../components/inputs/Input";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import { FormType } from "./PaymentMethodForm";
import { useTranslate } from "@tolgee/react";

type Props = {
  control: Control<FormType>;
  name: "paymentMethodName";
  optional?: boolean;
} & InputProps;

export function LabelInput({
  control,
  name,
  id,
  optional = false,
  defaultValue = "",
  ...inputProps
}: Props) {
  const getPaymentDataByLabel = usePaymentDataStore(
    (state) => state.getPaymentDataByLabel,
  );
  const { t } = useTranslate("form");
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    defaultValue,
    name,
    rules: {
      required: t("form.required.error"),
      validate: {
        duplicate: (value: string) => {
          const isValid = !(
            getPaymentDataByLabel(value) &&
            getPaymentDataByLabel(value)?.id !== id
          );
          return isValid || t("form.duplicate.error");
        },
      },
    },
  });

  return (
    <Input
      label={t(`form.${name}`)}
      placeholder={t(`form.${name}.placeholder`)}
      value={field.value}
      errorMessage={error?.message ? [error.message] : undefined}
      onChangeText={field.onChange}
      required={!optional}
      {...inputProps}
    />
  );
}
