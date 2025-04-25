import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { ErrorPopup } from "../ErrorPopup";

export function DisputeRaisedSuccess({ view }: { view: "buyer" | "seller" }) {
  return (
    <ErrorPopup
      title={i18n("dispute.opened")}
      content={i18n(`dispute.raised.text.${view}`)}
      actions={<ClosePopupAction style={tw`justify-center`} />}
    />
  );
}
