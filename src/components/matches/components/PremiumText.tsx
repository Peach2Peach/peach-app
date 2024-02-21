import tw from "../../../styles/tailwind";
import { PeachText } from "../../text/PeachText";
import { tolgee } from "../../../tolgee";

type Props = {
  premium: number;
};

export const PremiumText = ({ premium }: Props) => (
  <PeachText style={tw`text-black-65`}>
    {" "}
    {premium === 0
      ? tolgee.t("match.atMarketPrice", { ns: "unassigned" })
      : tolgee.t(premium > 0 ? "match.premium" : "match.discount", {
          ns: "unassigned",
          premium: String(Math.abs(premium)),
        })}
  </PeachText>
);
