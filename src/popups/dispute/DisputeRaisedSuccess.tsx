import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import tw from "../../styles/tailwind";
import { ErrorPopup } from "../ErrorPopup";
import { useTranslate } from "@tolgee/react";

export function DisputeRaisedSuccess({ view }: { view: ContractViewer }) {
  const { t } = useTranslate("contract");
  return (
    <ErrorPopup
      title={t("dispute.opened")}
      content={t(`dispute.raised.text.${view}`)}
      actions={<ClosePopupAction style={tw`justify-center`} />}
    />
  );
}
