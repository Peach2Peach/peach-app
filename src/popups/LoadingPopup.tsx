import { Loading } from "../components/Loading";
import { PopupAction } from "../components/popup/PopupAction";
import {
  PopupComponent,
  PopupComponentProps,
} from "../components/popup/PopupComponent";
import tw from "../styles/tailwind";
import { useTranslate } from "@tolgee/react";

/**
 * @deprecated use LoadingPopupAction to indicate loading state
 */
export function LoadingPopup(props: Partial<PopupComponentProps>) {
  const { t } = useTranslate();

  return (
    <PopupComponent
      title={t("loading")}
      content={
        <Loading
          size="large"
          style={tw`self-center`}
          color={tw.color("primary-main")}
        />
      }
      actions={
        <PopupAction label={t("loading")} iconId="clock" onPress={() => null} />
      }
      {...props}
    />
  );
}
