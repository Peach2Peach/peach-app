import { Button } from "../../../../components/buttons/Button";
import tw from "../../../../styles/tailwind";
import i18n from "../../../../utils/i18n";
import { useLiquidWalletState } from "../../../../utils/wallet/useLiquidWalletState";
import { useStartSwapOut } from "./hooks/useStartSwapOut";

export const SwapButton = () => {
  const startSwapOut = useStartSwapOut()
  const synced = useLiquidWalletState(state => state.isSynced)

  return <Button style={tw`bg-info-main`} onPress={startSwapOut} iconId="shuffle" disabled={!synced}>
    {i18n("wallet.swap")}
  </Button>;
};