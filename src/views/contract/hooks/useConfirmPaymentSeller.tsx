import { Psbt } from "bitcoinjs-lib";
import { signAndFinalizePSBT } from "../../../utils/bitcoin/signAndFinalizePSBT";
import { txIdPartOfPSBT } from "../../../utils/bitcoin/txIdPartOfPSBT";
import { getSellOfferFromContract } from "../../../utils/contract/getSellOfferFromContract";
import { peachAPI } from "../../../utils/peachAPI";
import { getEscrowWalletForOffer } from "../../../utils/wallet/getEscrowWalletForOffer";
import { getNetwork } from "../../../utils/wallet/getNetwork";
import { signPSBT } from "../../../utils/wallet/signPSBT";
import { useContractMutation } from "./useContractMutation";

export function useConfirmPaymentSeller({
  contract,
  optimisticContract,
}: {
  contract: Contract;
  optimisticContract?: Partial<Contract>;
}) {
  return useContractMutation(
    {
      id: contract.id,
      ...optimisticContract,
    },
    {
      mutationFn: async () => {
        const sellOffer = await getSellOfferFromContract(contract);
        if (!sellOffer) throw new Error("SELL_OFFER_NOT_FOUND");

        const wallet = getEscrowWalletForOffer(sellOffer);
        const { txIds } = sellOffer.funding;
        const { releaseAddress, batchReleasePsbt, releasePsbt, id } = contract;

        const psbt = Psbt.fromBase64(releasePsbt, { network: getNetwork() });
        verifyReleasePSBT(psbt, txIds, releaseAddress);
        const releaseTransaction = signAndFinalizePSBT(psbt, wallet)
          .extractTransaction()
          .toHex();

        const batchPsbt = batchReleasePsbt
          ? Psbt.fromBase64(batchReleasePsbt, { network: getNetwork() })
          : undefined;

        if (batchPsbt) {
          verifyReleasePSBT(batchPsbt, txIds, releaseAddress);
          signPSBT(batchPsbt, wallet);
        }

        const { error: err } =
          await peachAPI.private.contract.confirmPaymentSeller({
            contractId: id,
            releaseTransaction,
            batchReleasePsbt: batchPsbt?.toBase64(),
          });
        if (err) throw new Error(err.error);
      },
    },
  );
}

function verifyReleasePSBT(
  psbt: Psbt,
  txIds: string[],
  releaseAddress: string,
) {
  if (txIds.length === 0) throw Error("MISSING_DATA");

  if (!txIds.every((txId) => txIdPartOfPSBT(txId, psbt))) {
    throw Error("INVALID_INPUT");
  }

  const buyerOutput = psbt.txOutputs.find(
    ({ address }) => address === releaseAddress,
  );
  if (!buyerOutput) throw Error("RETURN_ADDRESS_MISMATCH");
  if (buyerOutput.value === 0) throw Error("INVALID_OUTPUT");
}
