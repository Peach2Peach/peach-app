import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { getBuyOfferIdFromContract } from "../contract/getBuyOfferIdFromContract";
import { useWalletState } from "./walletStore";

export const mapTransactionToOffer =
  ({
    offers,
    contracts,
  }: {
    offers: { id: string; fundingTxId?: string; txId?: string }[];
    contracts: { id: string; releaseTxId?: string }[];
  }) =>
  ({ txid }: TransactionDetails) => {
    const sellOffers = offers.filter(
      (offer) => offer.txId === txid || offer.fundingTxId === txid,
    );
    if (sellOffers.length) {
      useWalletState.getState().updateTxOfferMap(
        txid,
        sellOffers.map(({ id }) => id),
      );
      return;
    }

    const filteredContracts = contracts.filter(
      (contract) => contract.releaseTxId === txid,
    );
    if (filteredContracts.length) {
      useWalletState
        .getState()
        .updateTxOfferMap(
          txid,
          filteredContracts.map(getBuyOfferIdFromContract),
        );
    }
  };
