import Clipboard from "@react-native-clipboard/clipboard";
import { useMemo } from "react";
import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { Input } from "../../components/inputs/Input";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { CopyAble } from "../../components/ui/CopyAble";
import { useContractDetail } from "../../hooks/query/useContractDetail";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useValidatedState } from "../../hooks/useValidatedState";
import { HelpPopup } from "../../popups/HelpPopup";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { getMessageToSignForAddress } from "../../utils/account/getMessageToSignForAddress";
import { getOfferIdFromContract } from "../../utils/contract/getOfferIdFromContract";
import { headerIcons } from "../../utils/layout/headerIcons";
import { getMessages } from "../../utils/validation/getMessages";
import { isValidBitcoinSignature } from "../../utils/validation/isValidBitcoinSignature";
import { getNetwork } from "../../utils/wallet/getNetwork";
import { LoadingScreen } from "../loading/LoadingScreen";
import { usePatchReleaseAddress } from "./components/usePatchReleaseAddress";
import { useTranslate } from "@tolgee/react";

const signatureRules = {
  required: true,
};
export const SignMessage = () => {
  const { params } = useRoute<"signMessage">();

  return "offerId" in params ? (
    <SignMessageForPatch offerId={params.offerId} />
  ) : "contractId" in params ? (
    <ContractSuspense contractId={params.contractId} />
  ) : (
    <SignMessageForGlobalPreference />
  );
};

function SignMessageForGlobalPreference() {
  const setPayoutToPeachWallet = useSettingsStore(
    (state) => state.setPayoutToPeachWallet,
  );
  const onSubmit = () => setPayoutToPeachWallet(false);

  return <ScreenContent onSubmit={onSubmit} />;
}

function ContractSuspense({ contractId }: { contractId: string }) {
  const { contract } = useContractDetail(contractId);

  if (!contract) return <LoadingScreen />;

  return (
    <SignMessageForPatch
      offerId={getOfferIdFromContract(contract)}
      contractId={contractId}
    />
  );
}

function SignMessageForPatch({
  offerId,
  contractId,
}: {
  offerId: string;
  contractId?: string;
}) {
  const { mutate: patchPayoutAddress } = usePatchReleaseAddress(
    offerId,
    contractId,
  );

  return <ScreenContent onSubmit={patchPayoutAddress} />;
}

const signaturePattern = /[a-zA-Z0-9/=+]{88}/u;

const parseSignature = (signature: string) =>
  signature.match(signaturePattern)?.pop() || signature;

type ScreenContentProps = {
  onSubmit: ({
    messageSignature,
    releaseAddress,
  }: {
    messageSignature: string;
    releaseAddress: string;
  }) => void;
};

function ScreenContent({ onSubmit }: ScreenContentProps) {
  const { t } = useTranslate("buy");
  const navigation = useStackNavigation();
  const { address, addressLabel } = useRoute<"signMessage">().params;
  const [setPayoutAddress, setPayoutAddressLabel, setPayoutAddressSignature] =
    useSettingsStore(
      (state) => [
        state.setPayoutAddress,
        state.setPayoutAddressLabel,
        state.setPayoutAddressSignature,
      ],
      shallow,
    );
  const publicKey = useAccountStore((state) => state.account.publicKey);
  const message = useMemo(
    () => getMessageToSignForAddress(publicKey, address),
    [address, publicKey],
  );
  const [signature, setSignature, signatureExists, requiredErrors] =
    useValidatedState<string>("", signatureRules);

  const signatureValid = useMemo(() => {
    if (!signatureExists) return false;
    return isValidBitcoinSignature({
      message,
      address,
      signature,
      network: getNetwork(),
    });
  }, [signatureExists, message, address, signature]);

  const signatureError = useMemo(() => {
    let errs = requiredErrors;
    if (
      !isValidBitcoinSignature({
        message,
        address,
        signature,
        network: getNetwork(),
      })
    ) {
      errs = [...errs, getMessages().signature];
    }
    return errs;
  }, [requiredErrors, message, address, signature]);

  const parseAndSetSignature = (sig: string) =>
    setSignature(parseSignature(sig));

  const submitSignature = () => {
    if (!signatureValid) return;
    setPayoutAddress(address);
    setPayoutAddressLabel(addressLabel);
    setPayoutAddressSignature(signature);
    onSubmit({ messageSignature: signature, releaseAddress: address });
    navigation.goBack();
  };

  const pasteSignature = async () => {
    const clipboard = await Clipboard.getString();
    if (clipboard) parseAndSetSignature(clipboard);
  };

  const keyboardOpen = useKeyboard();

  return (
    <Screen header={<SignMessageHeader />}>
      <PeachScrollView
        style={tw`grow`}
        contentContainerStyle={tw`justify-center grow`}
        contentStyle={tw`gap-5`}
      >
        <TextContainer
          label={t("buy.addressSigning.yourAddress")}
          value={address}
        />

        <TextContainer
          label={t("buy.addressSigning.message")}
          value={message}
        />

        <Input
          value={signature}
          onChangeText={setSignature}
          label={t("buy.addressSigning.signature")}
          placeholder={t("buy.addressSigning.signature")}
          errorMessage={signatureError}
          icons={[["clipboard", pasteSignature]]}
        />
      </PeachScrollView>
      {!keyboardOpen && (
        <Button
          style={tw`self-center`}
          disabled={!signatureValid}
          onPress={submitSignature}
        >
          {t("confirm", { ns: "global" })}
        </Button>
      )}
    </Screen>
  );
}

function TextContainer({
  label,
  value,
}: {
  label: React.ReactNode;
  value: string | undefined;
}) {
  return (
    <View>
      <PeachText style={tw`pl-2 input-label`}>{label}</PeachText>
      <View
        style={[
          tw`flex-row items-center justify-between gap-2 px-3 py-2`,
          tw`border rounded-xl`,
          tw`bg-primary-background-light`,
        ]}
      >
        <PeachText style={tw`flex-1 input-text`}>{value}</PeachText>
        <CopyAble
          value={value || ""}
          style={tw`w-5 h-5`}
          color={tw`text-black-100`}
        />
      </View>
    </View>
  );
}

function SignMessageHeader() {
  const { t } = useTranslate("buy");
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="addressSigning" />);
  return (
    <Header
      title={t("buy.addressSigning.title")}
      icons={[{ ...headerIcons.help, onPress: showHelp }]}
    />
  );
}
