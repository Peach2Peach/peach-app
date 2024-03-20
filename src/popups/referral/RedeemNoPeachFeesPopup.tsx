import { PopupAction } from "../../components/popup/PopupAction";
import { PopupComponent } from "../../components/popup/PopupComponent";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { useRedeemNoPeachFees } from "./useRedeemNoPeachFees";
import { useTranslate } from "@tolgee/react";

export function RedeemNoPeachFeesPopup() {
  const { mutate: redeem } = useRedeemNoPeachFees();
  const { t } = useTranslate("settings");

  return (
    <PopupComponent
      title={t("settings.referrals.noPeachFees.popup.title")}
      content={t("settings.referrals.noPeachFees.popup.text")}
      actions={
        <>
          <ClosePopupAction />
          <PopupAction
            label={t("settings.referrals.noPeachFees.popup.redeem")}
            iconId="checkSquare"
            onPress={() => redeem()}
            reverseOrder
          />
        </>
      }
    />
  );
}
