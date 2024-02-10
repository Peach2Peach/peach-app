import { NETWORK } from "@env";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetOverlay } from "../Overlay";
import { useClosePopup, useSetPopup } from "../components/popup/GlobalPopup";
import { PopupAction } from "../components/popup/PopupAction";
import { PopupComponent } from "../components/popup/PopupComponent";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { useTradeSummaryStore } from "../store/tradeSummaryStore";
import { checkRefundPSBT } from "../utils/bitcoin/checkRefundPSBT";
import { showTransaction } from "../utils/bitcoin/showTransaction";
import { signAndFinalizePSBT } from "../utils/bitcoin/signAndFinalizePSBT";
import i18n from "../utils/i18n";
import { saveOffer } from "../utils/offer/saveOffer";
import { peachAPI } from "../utils/peachAPI";
import { getEscrowWalletForOffer } from "../utils/wallet/getEscrowWalletForOffer";
import { BackupTime } from "../views/overlays/BackupTime";
import { contractKeys } from "./query/useContractDetail";
import { offerKeys } from "./query/useOfferDetail";
import { useNavigation } from "./useNavigation";
import { useShowErrorBanner } from "./useShowErrorBanner";

export function useRefundSellOffer() {
  const setPopup = useSetPopup();
  const showError = useShowErrorBanner();
  const closePopup = useClosePopup();
  const setOffer = useTradeSummaryStore((state) => state.setOffer);
  const isPeachWallet = useSettingsStore((state) => state.refundToPeachWallet);
  const [setShowBackupReminder, shouldShowBackupOverlay] = useSettingsStore(
    (state) => [state.setShowBackupReminder, state.shouldShowBackupOverlay],
  );
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sellOffer,
      rawPSBT,
    }: {
      sellOffer: SellOffer;
      rawPSBT: string;
    }) => {
      const { psbt, err } = checkRefundPSBT(rawPSBT, sellOffer);
      if (!psbt || err) {
        throw new Error(err || "Invalid PSBT");
      }
      const signedTx = signAndFinalizePSBT(
        psbt,
        getEscrowWalletForOffer(sellOffer),
      ).extractTransaction();
      const [tx, txId] = [signedTx.toHex(), signedTx.getId()];

      const { error: postTXError } =
        await peachAPI.private.offer.refundSellOffer({
          offerId: sellOffer.id,
          tx,
        });

      if (postTXError) {
        throw new Error(postTXError.error);
      }
      return [tx, txId];
    },
    onError: (error) => {
      showError(error.message);
      closePopup();
    },
    onSuccess: ([tx, txId], { sellOffer }) => {
      setPopup(<RefundEscrowPopup txId={txId} />);
      saveOffer({
        ...sellOffer,
        tx,
        txId,
        refunded: true,
      });
      setOffer(sellOffer.id, { txId });
      if (shouldShowBackupOverlay && isPeachWallet) {
        setShowBackupReminder(true);
      }
    },
    onSettled: (_data, _error, { sellOffer }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: offerKeys.summaries() }),
        queryClient.invalidateQueries({
          queryKey: offerKeys.detail(sellOffer.id),
        }),
        queryClient.invalidateQueries({ queryKey: contractKeys.summaries() }),
        queryClient.invalidateQueries({ queryKey: contractKeys.details() }),
      ]),
  });
}

function RefundEscrowPopup({ txId }: { txId: string }) {
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
            <ShowTxAction txId={txId} />
          )}
          <CloseAction />
        </>
      }
    />
  );
}

function ShowTxAction({ txId }: { txId: string }) {
  const closePopup = useClosePopup();

  const showTx = () => {
    closePopup();
    showTransaction(txId, NETWORK);
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
