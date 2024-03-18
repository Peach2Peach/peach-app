import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { SummaryItemProps } from "./SummaryItem";
import { TextSummaryItem } from "./TextSummaryItem";

type Props = Omit<SummaryItemProps, "title"> & {
  confirmed?: boolean;
  failed?: boolean;
};

export const ConfirmationSummaryItem = ({
  confirmed,
  failed,
  ...props
}: Props) => (
  <TextSummaryItem
    {...props}
    title={i18n("status")}
    text={i18n(
      `wallet.transaction.${confirmed ? "confirmed" : failed ? "failed" : "pending"}`,
    )}
    iconId={confirmed ? "checkCircle" : failed ? "xCircle" : "clock"}
    iconColor={tw.color(
      confirmed ? "success-main" : failed ? "error-main" : "black-50",
    )}
  />
);
