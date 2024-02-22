import { PopupComponent } from "../components/popup/PopupComponent";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import tw from "../styles/tailwind";
import { AppPopupId, appPopups } from "./appPopups";

export function AppPopup({ id }: { id: AppPopupId }) {
  const Content = appPopups[id].content;
  return (
    <PopupComponent
      title={appPopups[id].title}
      content={
        Content ? (
          typeof Content === "string" ? (
            Content
          ) : (
            <Content />
          )
        ) : undefined
      }
      actions={<ClosePopupAction style={tw`justify-center`} />}
    />
  );
}
