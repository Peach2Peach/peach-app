import { Fragment } from "react";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";
import { PaymentMethodInfo } from "../../../../peach-api/src/@types/payment";
import { Toggle } from "../../../components/inputs/Toggle";
import { ErrorBox } from "../../../components/ui/ErrorBox";
import { HorizontalLine } from "../../../components/ui/HorizontalLine";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { useIsMyAddress } from "../../../hooks/wallet/useIsMyAddress";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import tw from "../../../styles/tailwind";
import { useAccountStore } from "../../../utils/account/account";
import { getMessageToSignForAddress } from "../../../utils/account/getMessageToSignForAddress";
import { getOfferIdFromContract } from "../../../utils/contract/getOfferIdFromContract";
import i18n from "../../../utils/i18n";
import { isCashTrade } from "../../../utils/paymentMethod/isCashTrade";
import { cutOffAddress } from "../../../utils/string/cutOffAddress";
import { isValidBitcoinSignature } from "../../../utils/validation/isValidBitcoinSignature";
import { getNetwork } from "../../../utils/wallet/getNetwork";
import { peachWallet } from "../../../utils/wallet/setWallet";
import { usePaymentMethodInfo } from "../../addPaymentMethod/usePaymentMethodInfo";
import { useContractContext } from "../context";
import { tradeFields } from "../helpers/tradeInfoFields";
import {
  TradeInfoField,
  isTradeInformationGetter,
  tradeInformationGetters,
} from "../helpers/tradeInformationGetters";
import { SummaryItem } from "./SummaryItem";
import { usePatchReleaseAddress } from "./usePatchReleaseAddress";

export const TradeDetails = () => {
  const { contract, paymentData, isDecryptionError, view } =
    useContractContext();
  const { data: paymentMethodInfo } = usePaymentMethodInfo(
    contract.paymentMethod,
  );
  if (!paymentMethodInfo) return null;
  const sections = getTradeInfoFields(contract, view, paymentMethodInfo.fields);

  return (
    <View style={tw`justify-center gap-4 grow`}>
      {sections.map((fields: TradeInfoField[], index) => (
        <Fragment key={`section-${index}`}>
          <View style={tw`gap-2`}>
            {fields.map((fieldName, fieldIndex) => (
              <TradeDetailField
                fieldName={fieldName}
                key={`${fieldName}-${fieldIndex}`}
              />
            ))}
          </View>
          {index < sections.length - 1 && <HorizontalLine />}
        </Fragment>
      ))}

      {view === "buyer" && (
        <>
          <HorizontalLine />
          <ChangePayoutWallet />
        </>
      )}
      {!paymentData && isDecryptionError && (
        <ErrorBox style={tw`mt-[2px]`}>
          {i18n("contract.paymentData.decyptionFailed")}
        </ErrorBox>
      )}
    </View>
  );
};

function ChangePayoutWallet() {
  const { contract } = useContractContext();
  const paidToPeachWallet = useIsMyAddress(contract.releaseAddress);
  const offerId = getOfferIdFromContract(contract);

  const [payoutAddress, payoutAddressLabel, payoutAddressSignature] =
    useSettingsStore(
    useShallow((state) => [
        state.payoutAddress,
        state.payoutAddressLabel,
        state.payoutAddressSignature,
      ]),
    );
  const publicKey = useAccountStore((state) => state.account.publicKey);

  const { mutate } = usePatchReleaseAddress(offerId, contract.id);

  const navigation = useStackNavigation();

  const onPress = async () => {
    if (paidToPeachWallet === false) {
      if (!peachWallet) throw new Error("PeachWallet not set");
      const { address: releaseAddress, index } = await peachWallet.getAddress();

      const message = getMessageToSignForAddress(publicKey, releaseAddress);
      const messageSignature = peachWallet.signMessage(message, index);

      mutate({ releaseAddress, messageSignature });
    } else {
      if (!payoutAddress || !payoutAddressLabel) {
        navigation.navigate("patchPayoutAddress", { contractId: contract.id });
        return;
      }
      const message = getMessageToSignForAddress(publicKey, payoutAddress);
      if (
        !payoutAddressSignature ||
        !isValidBitcoinSignature({
          message,
          address: payoutAddress,
          signature: payoutAddressSignature,
          network: getNetwork(),
        })
      ) {
        navigation.navigate("signMessage", {
          contractId: contract.id,
          address: payoutAddress,
          addressLabel: payoutAddressLabel,
        });
      } else {
        mutate({
          releaseAddress: payoutAddress,
          messageSignature: payoutAddressSignature,
        });
      }
    }
  };

  const editCustomPayoutAddress =
    paidToPeachWallet || contract.paymentMade
      ? undefined
      : () => {
          navigation.navigate("patchPayoutAddress", {
            contractId: contract.id,
          });
        };

  return (
    <>
      {!contract.paymentMade && (
        <SummaryItem
          label={i18n("contract.summary.payoutToPeachWallet")}
          value={<Toggle enabled={!!paidToPeachWallet} onPress={onPress} />}
        />
      )}
      {(!paidToPeachWallet || contract.paymentMade) && (
        <SummaryItem
          label={i18n("payout.wallet")}
          value={
            <SummaryItem.Text
              value={
                payoutAddress === contract.releaseAddress
                  ? payoutAddressLabel || cutOffAddress(payoutAddress)
                  : paidToPeachWallet
                    ? i18n("peachWallet")
                    : cutOffAddress(contract.releaseAddress)
              }
              onPress={editCustomPayoutAddress}
              copyValue={contract.releaseAddress}
              copyable
            />
          }
        />
      )}
    </>
  );
}

function TradeDetailField({ fieldName }: { fieldName: TradeInfoField }) {
  const { contract, view, paymentData, buyerPaymentData } =
    useContractContext();

  const information = isTradeInformationGetter(fieldName)
    ? tradeInformationGetters[fieldName](contract)
    : view === "seller"
      ? buyerPaymentData?.[fieldName]
      : paymentData?.[fieldName];

  if (!information) return null;

  return (
    <SummaryItem
      label={i18n(`contract.summary.${fieldName}`)}
      value={
        typeof information === "string" || typeof information === "number" ? (
          <SummaryItem.Text
            value={String(information)}
            copyable={
              (view === "buyer" &&
                !contract.releaseTxId &&
                fieldName !== "location") ||
              fieldName === "tradeId"
            }
          />
        ) : (
          information
        )
      }
    />
  );
}

const FIELDS_ARRAY_DEPTH = 3;
function getTradeInfoFields(
  {
    paymentMethod,
    releaseTxId,
    batchInfo,
  }: Pick<Contract, "paymentMethod" | "releaseTxId" | "batchInfo">,
  view: ContractViewer,
  paymentMethodFields: PaymentMethodInfo["fields"],
) {
  const isTradeCompleted =
    !!releaseTxId || (!!batchInfo && !batchInfo.completed);
  if (view === "seller") {
    if (isCashTrade(paymentMethod)) {
      return tradeFields.seller[isTradeCompleted ? "past" : "active"].cash;
    }

    if (isTradeCompleted) {
      return tradeFields.seller.past.default;
    }
    const fields = [
      ...paymentMethodFields?.mandatory.flat(FIELDS_ARRAY_DEPTH),
      ...paymentMethodFields?.optional,
    ];
    return tradeFields.seller.active.default(fields) || [];
  }

  if (isTradeCompleted) {
    return tradeFields.buyer.past[
      isCashTrade(paymentMethod) ? "cash" : "default"
    ];
  }

  const fields = [
    ...paymentMethodFields.mandatory.flat(FIELDS_ARRAY_DEPTH),
    ...paymentMethodFields.optional,
  ];
  return isCashTrade(paymentMethod)
    ? tradeFields.buyer.active.cash
    : tradeFields.buyer.active.default(fields) || [];
}
