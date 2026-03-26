import { useFocusEffect } from "@react-navigation/native";
import { AddressIndex } from "bdk-rn/lib/lib/enums";
import { useCallback } from "react";
import { View } from "react-native";
import { Button } from "../../components/buttons/Button";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useMobilePendingActionPaymentMade } from "../../hooks/query/peach069/useMobilePendingActionPaymentMade";
import { useUser69Details } from "../../hooks/query/peach069/useUser69";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import { getMessageToSignForAddress } from "../../utils/account/getMessageToSignForAddress";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import { peachWallet } from "../../utils/wallet/setWallet";

export const MobilePendingActionRevealAddress = () => {
  const { id } = useRoute<"mobilePendingActionRevealAddress">().params;

  const { user: selfUser } = useSelfUser();
  const { user: selfUser69 } = useUser69Details();

  const { mobilePendingAction, isLoading, refetch } =
    useMobilePendingActionPaymentMade(id);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (isLoading || !mobilePendingAction) return <></>;

  const confirmFunction = async () => {
    if (!peachWallet) {
      throw Error("Wallet is not defined");
    }
    if (!selfUser) {
      throw Error("Self User is not defined");
    }
    if (!selfUser69) {
      throw Error("Self User69 is not defined");
    }

    let releaseAddress: string | undefined = undefined;
    let releaseAddressMessageSignature: string | undefined = undefined;
    let index: number | undefined = undefined;

    console.log("mobilePendingAction.payload", mobilePendingAction.payload);

    const needsAddress: boolean = JSON.parse(
      mobilePendingAction.payload,
    ).needsAddress;

    if (needsAddress) {
      if (selfUser69.lastAddressUsedIndex === undefined) {
        const getAddressResult = await peachWallet.getAddress(AddressIndex.New);
        releaseAddress = getAddressResult.address;
        index = getAddressResult.index;
      } else {
        const getAddressResult = await peachWallet.getAddress(
          AddressIndex.LastUnused,
        );
        if (getAddressResult.index > selfUser69.lastAddressUsedIndex) {
          releaseAddress = getAddressResult.address;
          index = getAddressResult.index;
        } else {
          while (true) {
            const getNewAddressResult = await peachWallet.getAddress(
              AddressIndex.New,
            );
            if (getNewAddressResult.index > selfUser69.lastAddressUsedIndex) {
              releaseAddress = getNewAddressResult.address;
              index = getNewAddressResult.index;
              break;
            }
          }
        }
      }

      const message = getMessageToSignForAddress(selfUser.id, releaseAddress);

      releaseAddressMessageSignature = peachWallet.signMessage(message, index);
    }
    const { error: err } =
      await peachAPI.private.peach069.postMobilePendingActionPaymentMade({
        id,
        releaseAddress,
        releaseAddressMessageSignature,
      });
    if (err) throw new Error(err.error);

    if (index)
      await peachAPI.private.peach069.setLastAddressUsedIndexOnSelfUser69({
        index,
      });
  };

  return (
    <Screen
      header={<Header title={i18n("connectToDesktop.mobilePendingActions")} />}
    >
      <View style={tw`grow`}>
        <PeachText>{"Reveal an address"}</PeachText>

        <PeachText>
          {"Contract ID: " + contractIdToHex(mobilePendingAction.contractId)}
        </PeachText>

        <Button
          disabled={mobilePendingAction.status !== "pending"}
          onPress={() => {
            confirmFunction().finally(refetch);
          }}
        >
          {"Confirm"}
        </Button>
      </View>
    </Screen>
  );
};
