import { hasValidSignature } from "../../views/contract/helpers/hasValidSignature";
import { error } from "../log/error";
import { getInstantTradeFromDeclaration } from "../offer/getInstantTradeFromDeclaration";
import { peachAPI } from "../peachAPI";
import { decrypt } from "../pgp/decrypt";
import { getSellOfferIdFromContract } from "./getSellOfferIdFromContract";
import { VALIDATE_CONTRACT_TRADE_DETAILS } from "./validateContractTradeDetailsFlag";

type ContractTradeDetails = Pick<
  Contract,
  | "id"
  | "amount"
  | "encryptedTradeDetails"
  | "encryptedTradeDetailsBuyerSignature"
  | "encryptedTradeDetailsSellerSignature"
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
 * came from a Sell Offer. Unless the offer was instant trade (read from the
 * seller's signed declaration), the contract must carry trade details that
 * decrypt, are signed by both the buyer and the seller, and name this
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
  if (!VALIDATE_CONTRACT_TRADE_DETAILS) return;

  const isInstantTrade = getInstantTradeFromDeclaration({
    offerId: sellOffer.id,
    sellerId: contract.seller.id,
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
      publicKeys: contract.buyer.pgpPublicKeys,
    }),
    hasValidSignature({
      signature: encryptedTradeDetailsSellerSignature,
      message: plaintext,
      publicKeys: contract.seller.pgpPublicKeys,
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
 * release" pending action): the contract is fetched only when the check is on
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
  if (!VALIDATE_CONTRACT_TRADE_DETAILS) return;
  const { result: contract, error: err } =
    await peachAPI.private.contract.getContract({ contractId });
  if (!contract) throw new Error(err?.error || "CONTRACT_NOT_FOUND");
  await verifyContractTradeDetails({ contract, sellOffer });
};
