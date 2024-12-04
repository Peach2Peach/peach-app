import { useMemo, useState } from "react";
import { Control, FieldError } from "react-hook-form";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { PaymentMethodField } from "../../../peach-api/src/@types/payment";
import { PulsingText } from "../../components/matches/components/PulsingText";
import { PeachText } from "../../components/text/PeachText";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { FormInput } from "./FormInput";
import { FormType } from "./PaymentMethodForm";

type Props = {
  row: PaymentMethodField[][];
  control: Control<FormType>;
  paymentData: Partial<PaymentData> & {
    type: PaymentMethod;
    currencies: Currency[];
  };
  getFieldState: (name: keyof FormType) => {
    invalid: boolean;
    isDirty: boolean;
    isTouched: boolean;
    error?: FieldError | undefined;
  };
  getValues: (fieldName?: PaymentMethodField) => unknown;
};

export function TabbedFormNavigation({
  row,
  control,
  paymentData,
  getFieldState,
  getValues,
}: Props) {
  const [selected, setSelected] = useState(0);
  const tabbedNavigationItems = row.map((column) => ({
    id: column[0],
    display: i18n(`form.${column[0]}`),
  }));

  const errorTabs = useMemo(() => {
    const fields: PaymentMethodField[] = [];
    row.forEach((column, index) => {
      column.some((field) => {
        const fieldHasError = !!getValues(field) && getFieldState(field).error;
        if (fieldHasError) {
          fields.push(tabbedNavigationItems[index].id);
          return true;
        }
        return false;
      });
    });
    return fields;
  }, [getFieldState, getValues, row, tabbedNavigationItems]);

  return (
    <>
      <TabbedNavigation
        items={tabbedNavigationItems}
        selected={tabbedNavigationItems[selected]}
        select={(item) => {
          setSelected(tabbedNavigationItems.indexOf(item));
        }}
        tabHasError={errorTabs}
        style={tw`pb-2`}
      />
      {row[selected].map((field) => {
        const otherColumns = row.filter((_column, index) => index !== selected);
        const hasValidColumnWithValues = otherColumns.some((column) =>
          column.every((f) => !!getValues(f) && !getFieldState(f).invalid),
        );

        return (
          <FormInput
            key={`formInput-${field}`}
            name={field}
            control={control}
            defaultValue={paymentData[field]}
            optional={hasValidColumnWithValues}
          />
        );
      })}
    </>
  );
}

const themes = (isDarkMode: boolean) => ({
  default: {
    text: tw`text-black-65`,
    textSelected: isDarkMode
      ? tw`text-backgroundLight-light`
      : tw`text-black-100`,
    underline: tw`bg-primary-main`,
  },
  inverted: {
    text: tw`text-primary-mild-1`,
    textSelected: tw`text-primary-background-light-color`,
    underline: tw`bg-primary-background-light-color`,
  },
});
type TabbedNavigationItem<T> = {
  id: T;
  display: string;
  view?: (props: unknown) => JSX.Element;
};
type TabbedNavigationProps<T extends string> = {
  style?: ViewStyle;
  items: TabbedNavigationItem<T>[];
  selected: TabbedNavigationItem<T>;
  select: (item: TabbedNavigationItem<T>) => void;
  buttonStyle?: ViewStyle;
  theme?: "default" | "inverted";
  tabHasError?: string[];
};

function TabbedNavigation<T extends string>({
  items,
  selected,
  select,
  theme = "default",
  style,
  buttonStyle,
  tabHasError = [],
}: TabbedNavigationProps<T>) {
  const { isDarkMode } = useThemeStore();
  const colors = themes(isDarkMode)[theme];
  return (
    <View style={[tw`flex-row justify-center`, style]}>
      {items.map((item) => (
        <TouchableOpacity
          style={[
            tw`px-2 shrink`,
            buttonStyle,
            !!tabHasError.length &&
              !tabHasError.includes(item.id) &&
              tw`opacity-10`,
          ]}
          key={item.id}
          onPress={() => select(item)}
        >
          <View style={tw`flex-row items-center`}>
            {tabHasError.includes(item.id) && item.id !== selected.id ? (
              <PulsingText
                showPulse
                style={[tw`px-4 py-2 text-center input-label`]}
              >
                {item.display}
              </PulsingText>
            ) : (
              <PeachText
                style={[
                  tw`px-4 py-2 text-center input-label`,
                  item.id === selected.id ? colors.textSelected : colors.text,
                  tabHasError.includes(item.id) &&
                    item.id !== selected.id &&
                    tw`text-error-main`,
                ]}
              >
                {item.display}
              </PeachText>
            )}
          </View>
          {item.id === selected.id && (
            <View style={[tw`w-full h-0.5 `, colors.underline]} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
