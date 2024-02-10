import { shallow } from "zustand/shallow";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { PopupComponent } from "../../components/popup/PopupComponent";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { LoadingPopupAction } from "../../components/popup/actions/LoadingPopupAction";
import { MSINAMINUTE } from "../../constants";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import { getSellOfferFromContract } from "../../utils/contract/getSellOfferFromContract";
import { getWalletLabelFromContract } from "../../utils/contract/getWalletLabelFromContract";
import i18n from "../../utils/i18n";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { GrayPopup } from "../GrayPopup";
import { patchSellOfferWithRefundTx } from "./patchSellOfferWithRefundTx";
import { useCancelContract } from "./useCancelContract";

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

  return (
    <PopupComponent
      title={title}
      content={i18n(
        isCash ? "contract.cancel.cash.text" : `contract.cancel.${view}`,
      )}
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
  const [customAddress, customAddressLabel, isPeachWalletActive] =
    useSettingsStore(
      (state) => [
        state.refundAddress,
        state.refundAddressLabel,
        state.refundToPeachWallet,
      ],
      shallow,
    );
  const { paymentMethod, id } = contract;
  const isCash = isCashTrade(paymentMethod);
  const canRepublish = !isOfferExpired(getSellOfferFromContract(contract));
  const walletName = getWalletLabelFromContract({
    contract,
    customAddress,
    customAddressLabel,
    isPeachWalletActive,
  });
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
