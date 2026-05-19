import { NETWORK } from "@env";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { ParsedPeachText } from "../../components/text/ParsedPeachText";
import { PeachText } from "../../components/text/PeachText";
import { InfoPopup } from "../../popups/InfoPopup";
import { useConfigStore } from "../../store/configStore/configStore";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { loadWalletFromAccount } from "../../utils/account/loadWalletFromAccount";
import { encryptAndSubmitDesktopConnectionData } from "../../utils/desktopConnection/encryptAndSubmitDesktopConnectionData";
import { parseDesktopConnectionQRCode } from "../../utils/desktopConnection/parseDesktopConnectionQRCode";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";

export const PasteDesktopConnection = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [failed, setFailed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const peachPGPPublicKey = useConfigStore((state) => state.peachPGPPublicKey);
  const account = useAccountStore.getState().account;
  if (!account.mnemonic) throw Error("");
  const mnemonic = account.mnemonic;

  const wallet = loadWalletFromAccount({ ...account, mnemonic });
  const xpub = wallet
    .derivePath(`m/84'/${NETWORK === "bitcoin" ? "0" : "1"}'/0'`)
    .neutered()
    .toBase58();

  const multisigXpub = wallet
    .derivePath(`m/84'/${NETWORK === "bitcoin" ? "0" : "1"}'/0'/55'`)
    .neutered()
    .toBase58();

  const onSubmit = async () => {
    setFailed(false);
    setSuccess(false);
    setSubmitting(true);
    const desktopConnectionData = parseDesktopConnectionQRCode(
      jsonInput.trim(),
    );

    if (desktopConnectionData) {
      await encryptAndSubmitDesktopConnectionData(
        desktopConnectionData,
        peachPGPPublicKey,
        account.pgp.privateKey,
        xpub,
        multisigXpub,
      );
      setSuccess(true);
    } else {
      setFailed(true);
    }
    setSubmitting(false);
  };

  return (
    <Screen header={<PasteDesktopConnectionHeader />}>
      <PeachScrollView contentContainerStyle={[tw`grow py-sm`, tw`md:py-md`]}>
        <View style={[tw`pb-11 gap-4`, tw`md:pb-14`]}>
          <PeachText>{i18n("pasteDesktopConnection.instruction")}</PeachText>
          <TextInput
            value={jsonInput}
            onChangeText={setJsonInput}
            placeholder='{"desktopConnectionId":"...","ephemeralPgpPublicKey":"..."}'
            placeholderTextColor={tw.color("black-25")}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            style={tw`min-h-40 p-3 rounded border border-black-50 text-black-100 bg-primary-background-light-color`}
            textAlignVertical="top"
          />
          <View style={tw`items-center`}>
            <Button
              onPress={onSubmit}
              disabled={!jsonInput.trim() || submitting}
              loading={submitting}
            >
              {i18n("pasteDesktopConnection.connect")}
            </Button>
          </View>
        </View>
        {failed && (
          <PeachText>{i18n("pasteDesktopConnection.failed")}</PeachText>
        )}
        {success && (
          <PeachText>{i18n("pasteDesktopConnection.success")}</PeachText>
        )}
      </PeachScrollView>
    </Screen>
  );
};

function PasteDesktopConnectionHeader() {
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<DesktopConnectionHelp />);

  return (
    <Header
      title={i18n("desktopConnection.title")}
      icons={[
        {
          ...headerIcons.help,
          onPress: showHelp,
          accessibilityHint: i18n("help"),
        },
      ]}
    />
  );
}

function DesktopConnectionHelp() {
  return (
    <InfoPopup
      title={i18n("desktopConnection.help.title")}
      content={
        <ParsedPeachText
          style={tw`text-black-100`}
          parse={[
            {
              pattern: new RegExp(
                i18n("desktopConnection.help.text.link"),
                "u",
              ),
              style: tw`underline`,
            },
          ]}
        >
          {i18n("desktopConnection.help.text")}
        </ParsedPeachText>
      }
    />
  );
}
