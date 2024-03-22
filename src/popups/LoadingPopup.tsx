import { Loading } from "../components/Loading";
import { PopupAction } from "../components/popup/PopupAction";
import {
  PopupComponent,
  PopupComponentProps,
} from "../components/popup/PopupComponent";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";

/**
 * @deprecated use LoadingPopupAction to indicate loading state
 */
export function LoadingPopup(props: Partial<PopupComponentProps>) {
  return (
    <PopupComponent
      title={i18n("loading")}
      content={
        <Loading
          size="large"
          style={tw`self-center`}
          color={tw.color("primary-main")}
        />
      }
      actions={
        <PopupAction
          label={i18n("loading")}
          iconId="clock"
          onPress={() => null}
        />
      }
      {...props}
    />
  );
}
