import { hasValidSignature } from "../../views/contract/helpers/hasValidSignature";
import { getProvenPgpPublicKeys } from "../account/getProvenPgpPublicKeys";
import { error } from "../log/error";
import { getInstantTradeFromDeclaration } from "../offer/getInstantTradeFromDeclaration";
import { peachAPI } from "../peachAPI";
import { decrypt } from "../pgp/decrypt";
import { getSellOfferIdFromContract } from "./getSellOfferIdFromContract";

type ContractTradeDetails = Pick<
  Contract,
  | "id"
  | "amount"
  | "encryptedTradeDetails"
  | "encryptedTradeDetailsBuyerSignature"
  | "encryptedTradeDetailsSellerSignature"
  | "validateEncryptedTradeDetails"
> & {
  buyer: Pick<PublicUser, "id" | "pgpPublicKeys">;
  seller: Pick<PublicUser, "id" | "pgpPublicKeys">;
};

function fail(reason: string): never {
  error("trade details verification failed:", reason);
  throw new Error("INVALID_CONTRACT_TRADE_DETAILS");
}

/**
 * @description run by the seller before releasing the escrow of a contract that
 * came from a Sell Offer. Only enforced when the server flags the contract
 * with validateEncryptedTradeDetails. Unless the offer was instant trade (read from the
 * seller's signed declaration), the contract must carry trade details that
 * decrypt, are signed by both the buyer and the seller (with PGP keys they
 * proved owning), and name this
 * contract's buyer, sell offer id and amount.
 * Throws INVALID_CONTRACT_TRADE_DETAILS or
 * INVALID_INSTANT_TRADE_DECLARATION, so nothing gets signed.
 */
export const verifyContractTradeDetails = async ({
  contract,
  sellOffer,
}: {
  contract: ContractTradeDetails;
  sellOffer: {
    id: string;
    instantTradeSignature?: string | null;
  };
}) => {
  if (contract.validateEncryptedTradeDetails !== true) return;

  const isInstantTrade = await getInstantTradeFromDeclaration({
    offerId: sellOffer.id,
    sellerId: contract.seller.id,
    sellerPgpPublicKeys: contract.seller.pgpPublicKeys,
    instantTradeSignature: sellOffer.instantTradeSignature,
  });
  // instant trades carry no trade details
  if (isInstantTrade) return;

  const {
    encryptedTradeDetails,
    encryptedTradeDetailsBuyerSignature,
    encryptedTradeDetailsSellerSignature,
  } = contract;
  if (
    !encryptedTradeDetails ||
    !encryptedTradeDetailsBuyerSignature ||
    !encryptedTradeDetailsSellerSignature
  )
    fail("trade details missing");

  let plaintext: string;
  try {
    plaintext = await decrypt(encryptedTradeDetails);
  } catch (e) {
    fail("could not decrypt");
  }

  const [buyerSignatureValid, sellerSignatureValid] = await Promise.all([
    hasValidSignature({
      signature: encryptedTradeDetailsBuyerSignature,
      message: plaintext,
      publicKeys: getProvenPgpPublicKeys({
        userId: contract.buyer.id,
        pgpPublicKeys: contract.buyer.pgpPublicKeys,
      }),
    }),
    hasValidSignature({
      signature: encryptedTradeDetailsSellerSignature,
      message: plaintext,
      publicKeys: getProvenPgpPublicKeys({
        userId: contract.seller.id,
        pgpPublicKeys: contract.seller.pgpPublicKeys,
      }),
    }),
  ]);
  if (!buyerSignatureValid) fail("invalid buyer signature");
  if (!sellerSignatureValid) fail("invalid seller signature");

  let details: {
    buyer?: unknown;
    seller?: unknown;
    offerId?: unknown;
    amount?: unknown;
  };
  try {
    details = JSON.parse(plaintext);
  } catch (e) {
    fail("not valid JSON");
  }

  if (details.buyer !== contract.buyer.id) fail("buyer mismatch");
  if (details.seller !== contract.seller.id) fail("seller mismatch");
  // the rest is compared against the contract itself (GET contract)
  if (details.offerId !== Number(getSellOfferIdFromContract(contract)))
    fail("offer mismatch");
  if (details.amount !== String(contract.amount)) fail("amount mismatch");
};

/**
 * same check for flows that only know the contract id (the desktop "sign
 * release" pending action): the contract is fetched to read the server's
 * validateEncryptedTradeDetails flag and the trade details
 */
export const verifyContractTradeDetailsById = async ({
  contractId,
  sellOffer,
}: {
  contractId: string;
  sellOffer: {
    id: string;
    instantTradeSignature?: string | null;
  };
}) => {
  const { result: contract, error: err } =
    await peachAPI.private.contract.getContract({ contractId });
  if (!contract) throw new Error(err?.error || "CONTRACT_NOT_FOUND");
  await verifyContractTradeDetails({ contract, sellOffer });
};
