import {
  PopupComponent,
  PopupComponentProps,
} from "../components/popup/PopupComponent";
import tw from "../styles/tailwind";

export function GrayPopup(
  props: Omit<PopupComponentProps, "bgColor" | "actionBgColor">,
) {
  return (
    <PopupComponent
      {...props}
      bgColor={tw`bg-primary-background-main`}
      actionBgColor={tw`bg-black-50`}
    />
  );
}
