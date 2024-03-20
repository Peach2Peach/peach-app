import { useTranslate } from "@tolgee/react";
import { useClosePopup } from "../GlobalPopup";
import { PopupAction, PopupActionProps } from "../PopupAction";

type Props = Pick<PopupActionProps, "textStyle" | "reverseOrder" | "style">;

export const ClosePopupAction = (props: Props) => {
  const closePopup = useClosePopup();
  const { t } = useTranslate("global");
  return (
    <PopupAction
      onPress={closePopup}
      label={t("close")}
      iconId={"xSquare"}
      {...props}
    />
  );
};
