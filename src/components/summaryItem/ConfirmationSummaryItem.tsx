import tw from "../../styles/tailwind";
import { SummaryItemProps } from "./SummaryItem";
import { TextSummaryItem } from "./TextSummaryItem";
import { tolgee } from "../../tolgee";

type Props = Omit<SummaryItemProps, "title"> & {
  confirmed?: boolean;
};

export const ConfirmationSummaryItem = ({ confirmed, ...props }: Props) => (
  <TextSummaryItem
    {...props}
    title={tolgee.t("status", { ns: "contract" })}
    text={tolgee.t(
      `wallet.transaction.${confirmed ? "confirmed" : "pending"}`,
      {
        ns: "wallet",
      },
    )}
    iconId={confirmed ? "checkCircle" : "clock"}
    iconColor={confirmed ? tw.color("success-main") : tw.color("black-50")}
  />
);
