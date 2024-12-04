import { Control, useController } from "react-hook-form";
import { Input, InputProps } from "../../components/inputs/Input";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import i18n from "../../utils/i18n";
import { FormType } from "./PaymentMethodForm";

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
  const paymentData = usePaymentDataStore((state) =>
    Object.values(state.paymentData),
  );
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    defaultValue,
    name,
    rules: {
      required: i18n("form.required.error"),
      validate: {
        duplicate: (value: string) => {
          const existingData = paymentData.find((data) => data.label === value);
          const isValid = !existingData || existingData.id === id;
          return isValid || i18n("form.duplicate.error");
        },
      },
    },
  });

  return (
    <Input
      label={i18n(`form.${name}`)}
      placeholder={i18n(`form.${name}.placeholder`)}
      value={field.value}
      errorMessage={error?.message ? [error.message] : undefined}
      onChangeText={field.onChange}
      required={!optional}
      {...inputProps}
    />
  );
}
