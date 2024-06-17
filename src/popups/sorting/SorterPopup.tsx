import { View } from "react-native";
import {
  RadioButtonProps,
  RadioButtons,
} from "../../components/inputs/RadioButtons";
import { PopupComponent } from "../../components/popup/PopupComponent";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { NewDivider } from "../../components/ui/NewDivider";
import tw from "../../styles/tailwind";
import { useTranslate } from "@tolgee/react";

type Props<T> = {
  radioButtonProps: RadioButtonProps<T>;
  applyAction: React.ReactNode;
};

export function SorterPopup<T>({ radioButtonProps, applyAction }: Props<T>) {
  const { t } = useTranslate("offer");
  return (
    <PopupComponent
      content={
        <View style={tw`w-full gap-4 shrink`}>
          <NewDivider title={t("offer.sorting.sortMatchesBy")} />
          <RadioButtons {...radioButtonProps} />
        </View>
      }
      actions={
        <>
          <ClosePopupAction />
          {applyAction}
        </>
      }
    />
  );
}
