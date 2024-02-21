import { FeeInfo } from "./FeeInfo";
import { tolgee } from "../../../../tolgee";

type Props = {
  fee: number;
};

export const CurrentFee = ({ fee }: Props) => (
  <FeeInfo
    label={tolgee.t("wallet.bumpNetworkFees.currentFee", { ns: "wallet" })}
    fee={fee}
  />
);
