import { ConfirmSlider } from "../../../components/inputs/confirmSlider/ConfirmSlider";
import i18n from "../../../utils/i18n";
import { useConfirmEscrow } from "../hooks/useConfirmEscrow";

type Props = {
  sellOffer?: SellOffer;
};
export const ContinueTradeSlider = ({ sellOffer }: Props) => {
  const confirmEscrow = useConfirmEscrow();
  const confirmEscrowWithSellOffer = () => {
    if (!sellOffer) return;
    confirmEscrow(sellOffer);
  };

  return (
    <ConfirmSlider
      enabled={!!sellOffer}
      onConfirm={confirmEscrowWithSellOffer}
      label1={i18n("continueTrade")}
      iconId="arrowRightCircle"
    />
  );
};
