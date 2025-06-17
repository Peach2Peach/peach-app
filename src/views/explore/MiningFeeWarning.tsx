import { PeachText } from "../../components/text/PeachText";
import { CENT } from "../../constants";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { useMaxMiningFee } from "./useMaxMiningFee";

export function MiningFeeWarning({ amount }: { amount: number }) {
  const { currentFeePercentage, maxMiningFeeRate } = useMaxMiningFee(amount);
  if (maxMiningFeeRate === undefined) return null;
  return (
    <PeachText style={tw`text-center subtitle-1 text-error-main`}>
      {i18n(
        "match.feeWarning",
        String(Math.round(currentFeePercentage * CENT)),
      )}
    </PeachText>
  );
}
