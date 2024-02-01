import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { shallow } from "zustand/shallow";
import { Contract } from "../../../peach-api/src/@types/contract";
import { useSetOverlay } from "../../Overlay";
import { IconType } from "../../assets/icons";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/buttons/Button";
import { useSetPopup } from "../../components/popup/Popup";
import { PeachText } from "../../components/text/PeachText";
import { useContractDetails } from "../../hooks/query/useContractDetails";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { TradeBreakdownPopup } from "../../popups/TradeBreakdownPopup";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { createUserRating } from "../../utils/contract/createUserRating";
import { getContractViewer } from "../../utils/contract/getContractViewer";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import { LoadingScreen } from "../loading/LoadingScreen";
import { BackupTime } from "../overlays/BackupTime";

export const TradeComplete = ({ contractId }: { contractId: string }) => {
  const { contract } = useContractDetails(contractId);
  if (!contract) return <LoadingScreen />;

  return <TradeCompleteView contract={contract} />;
};

function TradeCompleteView({ contract }: { contract: Contract }) {
  const [vote, setVote] = useState<"positive" | "negative">();
  const account = useAccountStore((state) => state.account);
  const view = getContractViewer(contract.seller.id, account);

  return (
    <>
      <View style={tw`justify-center gap-6 grow`}>
        <View style={tw`items-center`}>
          <Icon id="fullLogo" style={tw`w-311px h-127px`} />
          <PeachText style={tw`text-center h5 text-primary-background-light`}>
            {i18n(`tradeComplete.title.${view}.default`)}
          </PeachText>
        </View>

        <PeachText style={tw`text-center body-l text-primary-background-light`}>
          {i18n("rate.subtitle")}
        </PeachText>
        <View style={tw`flex-row justify-center gap-12`}>
          <RateButton
            onPress={() => setVote("negative")}
            iconId="thumbsDown"
            isSelected={vote === "negative"}
            style={tw`pb-[13px] pt-[19px]`}
          />
          <RateButton
            onPress={() => setVote("positive")}
            iconId="thumbsUp"
            isSelected={vote === "positive"}
            style={tw`pt-[13px] pb-[19px]`}
          />
        </View>
      </View>
      <Rate {...{ contract, view, vote }} />
    </>
  );
}

type RateButtonProps = {
  isSelected: boolean;
  onPress: () => void;
  iconId: IconType;
  style: ViewStyle;
};

function RateButton({ isSelected, onPress, iconId, style }: RateButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`items-center justify-center w-16 h-16 px-4`,
        tw`border-[3px] border-primary-background-light rounded-[21px]`,
        isSelected && tw`bg-primary-background-light`,
        style,
      ]}
    >
      <Icon
        id={iconId}
        size={32}
        color={
          isSelected
            ? tw.color("primary-main")
            : tw.color("primary-background-light")
        }
      />
    </TouchableOpacity>
  );
}

type RateProps = ComponentProps & {
  contract: Contract;
  view: ContractViewer;
  vote: "positive" | "negative" | undefined;
};

function Rate({ contract, view, vote }: RateProps) {
  const queryClient = useQueryClient();
  const setPopup = useSetPopup();
  const showError = useShowErrorBanner();
  const [shouldShowBackupOverlay, setShowBackupReminder, isPeachWalletActive] =
    useSettingsStore(
      (state) => [
        state.shouldShowBackupOverlay,
        state.setShowBackupReminder,
        view === "buyer"
          ? state.payoutToPeachWallet
          : state.refundToPeachWallet,
      ],
      shallow,
    );
  const setOverlayContent = useSetOverlay();

  const navigateAfterRating = () => {
    if (shouldShowBackupOverlay && isPeachWalletActive && view === "buyer") {
      setShowBackupReminder(true);
      setOverlayContent(
        <BackupTime
          navigationParams={[
            { name: "contract", params: { contractId: contract.id } },
          ]}
        />,
      );
    }
    setOverlayContent(undefined);
  };

  const rate = async () => {
    if (!vote) return;

    const { rating, signature } = createUserRating(
      view === "seller" ? contract.buyer.id : contract.seller.id,
      vote === "positive" ? 1 : -1,
    );

    const { error: err } = await peachAPI.private.contract.rateUser({
      contractId: contract.id,
      rating,
      signature,
    });

    if (err) {
      showError(err.error);
      return;
    }
    await queryClient.invalidateQueries({
      queryKey: ["contract", contract.id],
    });
    await queryClient.invalidateQueries({ queryKey: ["contractSummaries"] });
    navigateAfterRating();
  };

  const showTradeBreakdown = () =>
    setPopup(<TradeBreakdownPopup contract={contract} />);

  return (
    <View style={tw`self-center gap-3`}>
      <Button
        onPress={rate}
        style={tw`bg-primary-background-light`}
        disabled={!vote}
        textColor={tw`text-primary-main`}
      >
        {i18n("rate.rateAndFinish")}
      </Button>

      {view === "buyer" && (
        <Button onPress={showTradeBreakdown} ghost>
          {i18n("rate.tradeBreakdown")}
        </Button>
      )}
    </View>
  );
}
