import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { shallow } from "zustand/shallow";
import { Contract } from "../../../peach-api/src/@types/contract";
import { useSetGlobalOverlay } from "../../Overlay";
import { IconType } from "../../assets/icons";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/buttons/Button";
import { GlobalPopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { contractKeys } from "../../hooks/query/useContractDetail";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { TradeBreakdownPopup } from "../../popups/TradeBreakdownPopup";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { createUserRating } from "../../utils/contract/createUserRating";
import { getContractViewer } from "../../utils/contract/getContractViewer";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import { BackupTime } from "../overlays/BackupTime";

export function TradeComplete({ contract }: { contract: Contract }) {
  const [vote, setVote] = useState<"positive" | "negative">();
  const publicKey = useAccountStore((state) => state.account.publicKey);
  const view = getContractViewer(contract.seller.id, publicKey);

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

type RateProps = {
  contract: Contract;
  view: ContractViewer;
  vote: "positive" | "negative" | undefined;
};

function Rate({ contract, view, vote }: RateProps) {
  const setPopup = useSetPopup();

  const { mutate: rateUser } = useRateUser({
    vote,
    view,
    contract,
  });

  const showTradeBreakdown = () =>
    setPopup(<TradeBreakdownPopup contract={contract} />);

  return (
    <View style={tw`self-center gap-3`}>
      <GlobalPopup />
      <Button
        onPress={() => rateUser()}
        style={tw`bg-primary-background-light`}
        disabled={!vote}
        textColor={tw.color("primary-main")}
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

function useRateUser({ contract, view, vote }: RateProps) {
  const queryClient = useQueryClient();
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
  const setOverlayContent = useSetGlobalOverlay();

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: contractKeys.detail(contract.id),
      });
      const previousData = queryClient.getQueryData<Contract>(
        contractKeys.detail(contract.id),
      );
      queryClient.setQueryData<Contract>(
        contractKeys.detail(contract.id),
        (old) => {
          if (!old) return old;
          return { ...old, tradeStatus: "tradeCompleted" };
        },
      );

      return { previousData };
    },
    mutationFn: async () => {
      if (!vote) throw new Error("No rating provided");

      const { rating, signature } = createUserRating(
        view === "seller" ? contract.buyer.id : contract.seller.id,
        vote === "positive" ? 1 : -1,
      );

      const { error: err } = await peachAPI.private.contract.rateUser({
        contractId: contract.id,
        rating,
        signature,
      });

      if (err) throw new Error(err.error);
    },
    onError: (error, _vars, context) => {
      showError(error.message);
      queryClient.setQueryData(
        contractKeys.detail(contract.id),
        context?.previousData,
      );
    },
    onSuccess: () => {
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
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: contractKeys.detail(contract.id),
        }),
        queryClient.invalidateQueries({ queryKey: contractKeys.summaries() }),
      ]);
    },
  });
}
