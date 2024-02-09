import { useCallback } from "react";
import { useSetOverlay } from "../Overlay";
import { useClosePopup, useSetPopup } from "../components/popup/Popup";
import { PopupAction } from "../components/popup/PopupAction";
import { PopupComponent } from "../components/popup/PopupComponent";
import { FIFTEEN_SECONDS } from "../constants";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { useTradeSummaryStore } from "../store/tradeSummaryStore";
import { checkRefundPSBT } from "../utils/bitcoin/checkRefundPSBT";
import { signAndFinalizePSBT } from "../utils/bitcoin/signAndFinalizePSBT";
import { showTransaction } from "../utils/blockchain/showTransaction";
import { getAbortWithTimeout } from "../utils/getAbortWithTimeout";
import i18n from "../utils/i18n";
import { info } from "../utils/log/info";
import { saveOffer } from "../utils/offer/saveOffer";
import { peachAPI } from "../utils/peachAPI";
import { isLiquidAddress } from "../utils/validation/rules";
import { getEscrowWalletForOffer } from "../utils/wallet/getEscrowWalletForOffer";
import { BackupTime } from "../views/overlays/BackupTime";
import { useTradeSummaries } from "./query/useTradeSummaries";
import { useNavigation } from "./useNavigation";
import { useShowErrorBanner } from "./useShowErrorBanner";

export const useRefundEscrow = () => {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const showError = useShowErrorBanner();
  const isPeachWallet = useSettingsStore((state) => state.refundToPeachWallet);
  const [setShowBackupReminder, shouldShowBackupOverlay] = useSettingsStore(
    (state) => [state.setShowBackupReminder, state.shouldShowBackupOverlay],
  );
  const { refetch: refetchTradeSummaries } = useTradeSummaries(false);

  const setOffer = useTradeSummaryStore((state) => state.setOffer);

  const refundEscrow = useCallback(
    async (sellOffer: SellOffer, rawPSBT: string) => {
      info("Get refunding info", rawPSBT);
      // TODO liquify
      const { psbt, err } = checkRefundPSBT(rawPSBT, sellOffer);

      if (!psbt || err) {
        showError(err);
        closePopup();
        return;
      }
      // TODO liquify
      const signedTx = signAndFinalizePSBT(
        psbt,
        getEscrowWalletForOffer(sellOffer),
      ).extractTransaction();
      const [tx, txId] = [signedTx.toHex(), signedTx.getId()];

      setPopup(<RefundEscrowPopup txId={txId} network={isLiquidAddress(sellOffer.escrow) ? 'liquid' : 'bitcoin'} />);

      const { error: postTXError } =
        await peachAPI.private.offer.refundSellOffer({
          offerId: sellOffer.id,
          tx,
          signal: getAbortWithTimeout(FIFTEEN_SECONDS).signal,
        });
      if (postTXError) {
        showError(postTXError.error);
        closePopup();
      } else {
        saveOffer({
          ...sellOffer,
          tx,
          txId,
          refunded: true,
        });
        setOffer(sellOffer.id, { txId });
        refetchTradeSummaries();
        if (shouldShowBackupOverlay && isPeachWallet) {
          setShowBackupReminder(true);
        }
      }
    },
    [
      closePopup,
      isPeachWallet,
      refetchTradeSummaries,
      setOffer,
      setPopup,
      setShowBackupReminder,
      shouldShowBackupOverlay,
      showError,
    ],
  );

  return refundEscrow;
};

function RefundEscrowPopup({ txId, network }: { txId: string, network: 'bitcoin' | 'liquid' }) {
  const isPeachWallet = useSettingsStore((state) => state.refundToPeachWallet);

  return (
    <PopupComponent
      title={i18n("refund.title")}
      content={i18n(
        isPeachWallet
          ? "refund.text.peachWallet"
          : "refund.text.externalWallet",
      )}
      actions={
        <>
          {isPeachWallet ? (
            <GoToWalletAction txId={txId} />
          ) : (
            <ShowTxAction {...{txId, network }} />
          )}
          <CloseAction />
        </>
      }
    />
  );
}

function ShowTxAction({ txId, network }: { txId: string, network: 'bitcoin' | 'liquid' }) {
  const closePopup = useClosePopup();

  const showTx = () => {
    closePopup();
    showTransaction(txId, network);
  };

  return (
    <PopupAction
      label={i18n("showTx")}
      iconId="externalLink"
      onPress={showTx}
    />
  );
}

function GoToWalletAction({ txId }: { txId: string }) {
  const closePopup = useClosePopup();
  const navigation = useNavigation();
  const shouldShowBackupOverlay = useSettingsStore(
    (state) => state.shouldShowBackupOverlay,
  );
  const setOverlay = useSetOverlay();

  const goToWallet = () => {
    closePopup();
    if (shouldShowBackupOverlay) {
      setOverlay(
        <BackupTime
          navigationParams={[{ name: "transactionDetails", params: { txId } }]}
        />,
      );
    } else {
      navigation.navigate("transactionDetails", { txId });
    }
  };

  return (
    <PopupAction
      label={i18n("goToWallet")}
      iconId="wallet"
      onPress={goToWallet}
    />
  );
}

function CloseAction() {
  const closePopup = useClosePopup();
  const navigation = useNavigation();
  const isPeachWallet = useSettingsStore((state) => state.refundToPeachWallet);
  const shouldShowBackupOverlay = useSettingsStore(
    (state) => state.shouldShowBackupOverlay,
  );
  const setOverlay = useSetOverlay();

  return (
    <PopupAction
      label={i18n("close")}
      iconId="xSquare"
      onPress={() => {
        closePopup();
        if (shouldShowBackupOverlay && isPeachWallet) {
          setOverlay(
            <BackupTime
              navigationParams={[
                { name: "homeScreen", params: { screen: "yourTrades" } },
              ]}
            />,
          );
        } else {
          navigation.navigate("homeScreen", {
            screen: "yourTrades",
            params: { tab: "yourTrades.history" },
          });
        }
      }}
      reverseOrder
    />
  );
}
