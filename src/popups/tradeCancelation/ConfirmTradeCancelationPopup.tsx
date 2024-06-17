import { useWalletLabel } from "../../components/offer/useWalletLabel";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { PopupComponent } from "../../components/popup/PopupComponent";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { LoadingPopupAction } from "../../components/popup/actions/LoadingPopupAction";
import { MSINAMINUTE } from "../../constants";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import tw from "../../styles/tailwind";
import { getSellOfferIdFromContract } from "../../utils/contract/getSellOfferIdFromContract";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { GrayPopup } from "../GrayPopup";
import { patchSellOfferWithRefundTx } from "./patchSellOfferWithRefundTx";
import { useCancelContract } from "./useCancelContract";
import { useTranslate } from "@tolgee/react";

export function ConfirmTradeCancelationPopup({
  contract,
  view,
}: {
  contract: Contract;
  view: ContractViewer;
}) {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const { mutate: cancelSeller } = useCancelContract({
    contractId: contract.id,
  });
  const { t } = useTranslate("contract");

  const { mutate: cancelBuyer } = useCancelContract({
    contractId: contract.id,
    optimisticContract: { canceled: true, tradeStatus: "tradeCanceled" },
  });

  const cancelAction = () =>
    view === "seller"
      ? cancelSeller(undefined, {
          onSuccess: async ({ psbt }) => {
            setPopup(<CancelPopup contract={contract} />);
            if (psbt) await patchSellOfferWithRefundTx(contract, psbt);
          },
        })
      : cancelBuyer(undefined, {
          onSuccess: () =>
            setPopup(
              <GrayPopup
                title={t("contract.cancel.success")}
                actions={<ClosePopupAction style={tw`justify-center`} />}
              />,
            ),
        });
  const title = t(
    isCashTrade(contract.paymentMethod)
      ? "contract.cancel.cash.title"
      : "contract.cancel.title",
  );
  const isCash = isCashTrade(contract.paymentMethod);

  return (
    <PopupComponent
      title={title}
      content={t(
        isCash ? "contract.cancel.cash.text" : `contract.cancel.${view}`,
      )}
      actions={
        <>
          <PopupAction
            label={t("contract.cancel.confirm.back")}
            iconId="arrowLeftCircle"
            onPress={closePopup}
          />
          <LoadingPopupAction
            label={t("contract.cancel.title")}
            iconId="xCircle"
            onPress={cancelAction}
            reverseOrder
          />
        </>
      }
      actionBgColor={tw`bg-black-50`}
      bgColor={tw`bg-primary-background-light`}
    />
  );
}

function CancelPopup({ contract }: { contract: Contract }) {
  const { paymentMethod, id } = contract;
  const isCash = isCashTrade(paymentMethod);
  const { offer } = useOfferDetail(getSellOfferIdFromContract(contract));
  const sellOffer = offer && isSellOffer(offer) ? offer : null;
  const canRepublish = sellOffer ? !isOfferExpired(sellOffer) : false;
  const walletName = useWalletLabel({ address: sellOffer?.returnAddress });
  const { t } = useTranslate("contract");

  return (
    <GrayPopup
      title={t(
        isCashTrade(paymentMethod)
          ? "contract.cancel.tradeCanceled"
          : "contract.cancel.requestSent",
      )}
      content={
        isCash
          ? canRepublish
            ? t("contract.cancel.cash.refundOrRepublish.text")
            : t("contract.cancel.cash.tradeCanceled.text", {
                contractId: id,
                wallet: walletName,
              })
          : t("contract.cancel.requestSent.text")
      }
      actions={<ClosePopupAction style={tw`justify-center`} />}
    />
  );
}

function isOfferExpired(offer: SellOffer) {
  const NUMBER_OF_MINUTES = 10;
  const ttl = (offer.funding.expiry * NUMBER_OF_MINUTES * MSINAMINUTE) / 2;

  const date = new Date(offer.publishingDate || offer.creationDate);
  date.setMilliseconds(+ttl);

  return new Date() > date;
}
