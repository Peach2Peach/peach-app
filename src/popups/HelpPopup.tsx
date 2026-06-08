import { PeachText } from "../components/text/PeachText";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { InfoPopup } from "./InfoPopup";

type Props = {
  id: string;
  showTitle?: boolean;
  dontShowHelpButton?: boolean;
  boldFooterId?: string;
};

export function HelpPopup({
  id,
  showTitle = true,
  dontShowHelpButton = false,
  boldFooterId,
}: Props) {
  return (
    <InfoPopup
      title={showTitle ? i18n(`help.${id}.title`) : undefined}
      content={
        boldFooterId ? (
          <>
            <PeachText style={tw`text-black-100`}>
              {i18n(`help.${id}.description`)}
            </PeachText>
            <PeachText style={tw`font-bold text-black-100`}>
              {i18n(boldFooterId)}
            </PeachText>
          </>
        ) : (
          i18n(`help.${id}.description`)
        )
      }
      dontShowHelpButton={dontShowHelpButton}
    />
  );
}
