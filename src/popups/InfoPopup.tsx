import { useCallback } from "react";
import { useClosePopup } from "../components/popup/GlobalPopup";
import { PopupAction } from "../components/popup/PopupAction";
import {
  PopupComponent,
  PopupComponentProps,
} from "../components/popup/PopupComponent";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { useStackNavigation } from "../hooks/useStackNavigation";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";

export function InfoPopup(
  props: Pick<PopupComponentProps, "title" | "content" | "dontShowHelpButton">,
) {
  return (
    <PopupComponent
      {...props}
      actions={
        <>
          {props.dontShowHelpButton !== true && (
            <HelpPopupAction title={props.title} />
          )}
          <ClosePopupAction reverseOrder />
        </>
      }
      bgColor={tw`bg-info-background`}
      actionBgColor={tw`bg-info-light`}
    />
  );
}

function HelpPopupAction({ title }: { title?: string }) {
  const navigation = useStackNavigation();
  const closePopup = useClosePopup();
  const goToHelp = useCallback(() => {
    closePopup();
    navigation.navigate("report", { topic: title, reason: "other" });
  }, [closePopup, navigation, title]);
  return <PopupAction label={i18n("help")} iconId="info" onPress={goToHelp} />;
}
