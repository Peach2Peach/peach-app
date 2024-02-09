import i18n from "../../../../utils/i18n";
import { FeeInfo } from "./FeeInfo";

type Props = {
  fee: number;
};

export const CurrentFee = ({ fee }: Props) => (
  <FeeInfo label={i18n("wallet.bumpNetworkFees.currentFee")} fee={fee} />
);
