import { Contract } from "../../../peach-api/src/@types/contract";
import { SellOffer } from "../../../peach-api/src/@types/offer";
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
import i18n from "../../utils/i18n";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { GrayPopup } from "../GrayPopup";
import { patchSellOfferWithRefundTx } from "./patchSellOfferWithRefundTx";
import { useCancelContract } from "./useCancelContract";

export function ConfirmTradeCancelationPopup({
  contract,
  view,
}: {
  contract: Contract;
  view: "buyer" | "seller";
}) {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const { mutate: cancelSeller } = useCancelContract({
    contractId: contract.id,
  });

  const { mutate: cancelBuyer } = useCancelContract({
    contractId: contract.id,
    optimisticContract: { canceled: true, tradeStatus: "tradeCanceled" },
  });

  const cancelAction = () =>
    view === "seller"
      ? cancelSeller(undefined, {
          onSuccess: async ({ psbt }) => {
            if (psbt) {
              setPopup(<CancelPopup contract={contract} />);
              await patchSellOfferWithRefundTx(contract, psbt);
            } else {
              closePopup();
            }
          },
        })
      : cancelBuyer(undefined, {
          onSuccess: () =>
            setPopup(
              <GrayPopup
                title={i18n("contract.cancel.success")}
                actions={<ClosePopupAction style={tw`justify-center`} />}
              />,
            ),
        });
  const title = i18n(
    isCashTrade(contract.paymentMethod)
      ? "contract.cancel.cash.title"
      : "contract.cancel.title",
  );
  const isCash = isCashTrade(contract.paymentMethod);

  const hasBeenFundedAndIsSeller =
    view === "seller" && contract.fundingStatus !== "NULL";

  const popupText = isCash
    ? i18n("contract.cancel.cash.text")
    : i18n(`contract.cancel.${view}`) +
      (hasBeenFundedAndIsSeller
        ? i18n(`contract.cancel.${view}Pt2WithEscrow`)
        : "");

  return (
    <PopupComponent
      title={title}
      content={popupText}
      actions={
        <>
          <PopupAction
            label={i18n("contract.cancel.confirm.back")}
            iconId="arrowLeftCircle"
            onPress={closePopup}
          />
          <LoadingPopupAction
            label={i18n("contract.cancel.title")}
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

  return (
    <GrayPopup
      title={i18n(
        isCashTrade(paymentMethod)
          ? "contract.cancel.tradeCanceled"
          : "contract.cancel.requestSent",
      )}
      content={
        isCash
          ? canRepublish
            ? i18n("contract.cancel.cash.refundOrRepublish.text")
            : i18n("contract.cancel.cash.tradeCanceled.text", id, walletName)
          : i18n("contract.cancel.requestSent.text")
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
