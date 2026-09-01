import { BIP32Interface } from "bip32";
import { Psbt } from "bitcoinjs-lib";
import { txIdPartOfPSBT } from "../../../utils/bitcoin/txIdPartOfPSBT";
import { getSellOfferFromContract } from "../../../utils/contract/getSellOfferFromContract";
import { isSingleSigEscrow } from "../../../utils/offer/isSingleSigEscrow";
import { peachAPI } from "../../../utils/peachAPI";
import { getEscrowWalletForOffer } from "../../../utils/wallet/getEscrowWalletForOffer";
import { getNetwork } from "../../../utils/wallet/getNetwork";
import { signPSBT } from "../../../utils/wallet/signPSBT";
import { signSingleSigEscrowInput } from "../../../utils/wallet/singleSigEscrow";
import { useContractMutation } from "./useContractMutation";

export function useConfirmPaymentSeller({
  contract,
  optimisticContract,
  optimistic = true,
}: {
  contract: Contract;
  optimisticContract?: Partial<Contract>;
  optimistic?: boolean;
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

        const [signature, batchPsbt] = isSingleSigEscrow(contract)
          ? [
              await getSingleSigReleaseSignature({
                contractId: id,
                txIds,
                releaseAddress,
                wallet,
              }),
            ]
          : getMultiSigReleaseSignature({
              releasePsbt,
              batchReleasePsbt,
              txIds,
              releaseAddress,
              wallet,
            });

        const { error: err } =
          await peachAPI.private.contract.confirmPaymentSeller({
            contractId: id,
            releaseTransactionSignature: signature,
            batchReleasePsbt: batchPsbt?.toBase64(),
          });
        if (err) throw new Error(err.error);
      },
    },
    { optimistic },
  );
}

/**
 * escrowVersion 2: Peach still builds the transaction but cannot sign it. Fetch
 * the exact PSBT it will broadcast - the server verifies our signature against
 * it - and sign the taproot key path with the tweaked escrow key.
 * Batching relies on Peach co-signing, so it is never used here.
 */
async function getSingleSigReleaseSignature({
  contractId,
  txIds,
  releaseAddress,
  wallet,
}: {
  contractId: string;
  txIds: string[];
  releaseAddress: string;
  wallet: BIP32Interface;
}) {
  const { result, error: err } =
    await peachAPI.private.contract.getContractSignedReleasePSBT({
      contractId,
    });
  if (!result?.releasePsbt) throw new Error(err?.error || "MISSING_DATA");

  const psbt = Psbt.fromBase64(result.releasePsbt, { network: getNetwork() });
  verifyReleasePSBT(psbt, txIds, releaseAddress);

  return signSingleSigEscrowInput(psbt, 0, wallet).toString("hex");
}

/** legacy 2-of-2 P2WSH escrow: Peach has already added its own signature */
function getMultiSigReleaseSignature({
  releasePsbt,
  batchReleasePsbt,
  txIds,
  releaseAddress,
  wallet,
}: {
  releasePsbt: string;
  batchReleasePsbt?: string;
  txIds: string[];
  releaseAddress: string;
  wallet: BIP32Interface;
}) {
  const psbt = Psbt.fromBase64(releasePsbt, { network: getNetwork() });
  verifyReleasePSBT(psbt, txIds, releaseAddress);

  const batchPsbt = batchReleasePsbt
    ? Psbt.fromBase64(batchReleasePsbt, { network: getNetwork() })
    : undefined;

  if (batchPsbt) {
    verifyReleasePSBT(batchPsbt, txIds, releaseAddress);
    signPSBT(batchPsbt, wallet);
  }
  signPSBT(psbt, wallet);
  const numberOfSignatures = psbt.data.inputs[0].partialSig?.length;
  if (!numberOfSignatures) {
    throw Error("signatures missing");
  }
  const signature =
    psbt.data.inputs[0].partialSig?.[numberOfSignatures - 1].signature.toString(
      "hex",
    );
  if (!signature) {
    throw Error("signature missing");
  }

  return [signature, batchPsbt] as const;
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
