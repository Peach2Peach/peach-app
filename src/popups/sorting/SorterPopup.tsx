import { View } from "react-native";
import {
  RadioButtonProps,
  RadioButtons,
} from "../../components/inputs/RadioButtons";
import { PopupComponent } from "../../components/popup/PopupComponent";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { NewDivider } from "../../components/ui/NewDivider";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

type Props<T> = {
  radioButtonProps: RadioButtonProps<T>;
  applyAction: React.ReactNode;
};

export function SorterPopup<T>({ radioButtonProps, applyAction }: Props<T>) {
  const { isDarkMode } = useThemeStore();
  return (
    <PopupComponent
      content={
        <View style={tw`w-full gap-4 shrink`}>
          <NewDivider title={i18n("offer.sorting.sortMatchesBy")} />
          <RadioButtons {...radioButtonProps} />
        </View>
      }
      actions={
        <>
          <ClosePopupAction />
          {applyAction}
        </>
      }
      bgColor={{
        backgroundColor: isDarkMode
          ? tw.color("card")
          : tw.color("primary-background-dark-color"),
      }}
    />
  );
}
