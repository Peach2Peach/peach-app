import { useEffect, useState } from "react";
import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { Input } from "../../components/inputs/Input";
import { Toggle } from "../../components/inputs/Toggle";
import { URLInput } from "../../components/inputs/URLInput";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { LoadingPopupAction } from "../../components/popup/actions/LoadingPopupAction";
import { PeachText } from "../../components/text/PeachText";
import { useToggleBoolean } from "../../hooks/useToggleBoolean";
import { useValidatedState } from "../../hooks/useValidatedState";
import { HelpPopup } from "../../popups/HelpPopup";
import { LoadingPopup } from "../../popups/LoadingPopup";
import { SuccessPopup } from "../../popups/SuccessPopup";
import { WarningPopup } from "../../popups/WarningPopup";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { parseError } from "../../utils/parseError";
import { useNodeConfigState } from "../../utils/wallet/nodeConfigStore";
import { ensureNymProxy } from "../../utils/wallet/nym/ensureNymProxy";
import { isMixnetAllowedNode } from "../../utils/wallet/nym/isMixnetAllowedNode";
import { useNymProxyState } from "../../utils/wallet/nymProxyStore";
import { peachWallet } from "../../utils/wallet/setWallet";
import { checkNodeConnection } from "./helpers/checkNodeConnection";

const urlRules = { required: true, url: true };
export const NodeSetup = () => {
  const setPopup = useSetPopup();
  const { isDarkMode } = useThemeStore();

  const [node, setCustomNode, enabled, toggleEnabled] = useNodeConfigState(
    (state) => [state, state.setCustomNode, state.enabled, state.toggleEnabled],
    shallow,
  );
  const [ssl, toggleSSL] = useToggleBoolean(node.ssl);
  const [url, setURL, isURLValid, urlErrors] = useValidatedState<string>(
    node.url || "",
    urlRules,
  );
  const canCheckConnection = enabled && isURLValid;
  const [isConnected, setIsConnected] = useState(!!node.url);

  const [nymEnabled, nymProvider, setNymConfig] = useNymProxyState(
    (state) => [state.enabled, state.serviceProvider, state.setConfig],
    shallow,
  );
  const [localNymEnabled, setLocalNymEnabled] = useState(nymEnabled);
  const [localNymProvider, setLocalNymProvider] = useState(nymProvider);
  // Mixnet only works with an Esplora node (others use ports public exits block).
  const mixnetAllowed = isMixnetAllowedNode(node);

  const applyNymConfig = async () => {
    if (!peachWallet) throw Error("Peach wallet not defined");
    setNymConfig({
      enabled: localNymEnabled,
      serviceProvider: localNymProvider.trim(),
    });
    // Connecting to the mixnet can take tens of seconds; show progress and
    // surface success/failure on screen (the underlying logs only go to Metro).
    setPopup(<LoadingPopup title={i18n("wallet.settings.node.nym.applied.title")} />);
    try {
      // Start/stop the mixnet client explicitly so any failure is reported here
      // with its real cause, then re-init so the blockchain client is rebuilt
      // through (or without) the proxy.
      await ensureNymProxy();
      await peachWallet.initWallet();
      const contentKey = !localNymEnabled
        ? "wallet.settings.node.nym.applied.disabled"
        : localNymProvider.trim()
          ? "wallet.settings.node.nym.applied.custom"
          : "wallet.settings.node.nym.applied.auto";
      setPopup(
        <SuccessPopup
          title={i18n("wallet.settings.node.nym.applied.title")}
          content={i18n(contentKey)}
          actions={
            <ClosePopupAction
              style={tw`justify-center`}
              textStyle={tw`text-black-100`}
            />
          }
        />,
      );
    } catch (e) {
      setPopup(
        <WarningPopup
          title={i18n("wallet.settings.node.nym.error.title")}
          content={<PeachText selectable>{parseError(e)}</PeachText>}
          actions={
            <ClosePopupAction
              style={tw`justify-center`}
              textStyle={tw`text-black-100`}
            />
          }
        />,
      );
    }
  };

  const editConfig = () => setIsConnected(false);
  const save = (blockchainType: BlockChainNames) => {
    if (!peachWallet) throw Error("Peach wallet not defined");
    setCustomNode({ enabled, ssl, url, type: blockchainType });
    setIsConnected(true);
    // setBlockchain is async (it may start the Nym proxy); initWallet re-runs it
    // anyway, so just guard against an unhandled rejection here.
    peachWallet
      .setBlockchain({ enabled, ssl, url, type: blockchainType })
      .catch(() => {});
    peachWallet.initWallet();
  };

  const checkConnection = async () => {
    setPopup(
      <LoadingPopup title={i18n("wallet.settings.node.checkingConnection")} />,
    );

    const { result: nodeType, error } = await checkNodeConnection(url, ssl);
    if (nodeType) {
      return setPopup(
        <NodeConnectionSuccessPopup url={url} save={() => save(nodeType)} />,
      );
    }
    return setPopup(<NodeConnectionErrorPopup error={error} />);
  };

  useEffect(() => {
    if (!peachWallet) return;
    peachWallet.setBlockchain(node).catch(() => {});
  }, [node]);

  return (
    <Screen header={<NodeSetupHeader />}>
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`justify-center gap-3 grow`}
      >
        <Toggle
          style={tw`justify-between px-6`}
          textStyle={tw.style(
            enabled && isDarkMode
              ? "text-backgroundLight-light"
              : "text-black-65",
          )}
          {...{ enabled }}
          onPress={toggleEnabled}
        >
          {i18n("wallet.settings.node.title")}
        </Toggle>
        <Toggle
          style={tw`justify-between px-6`}
          enabled={ssl}
          textStyle={tw.style(
            ssl && isDarkMode ? "text-backgroundLight-light" : "text-black-65",
          )}
          disabled={!enabled || isConnected}
          onPress={toggleSSL}
        >
          {i18n("wallet.settings.node.ssl")}
        </Toggle>
        <View style={!enabled && tw`opacity-33`}>
          <URLInput
            value={url}
            disabled={!enabled || isConnected}
            label={i18n("wallet.settings.node.address")}
            placeholder={i18n("wallet.settings.node.address.placeholder")}
            onChangeText={setURL}
            errorMessage={urlErrors}
            icons={isConnected ? [["edit3", editConfig]] : undefined}
          />
        </View>

        <View style={tw`gap-3 mt-6`}>
          <Toggle
            style={tw`justify-between px-6`}
            enabled={localNymEnabled && mixnetAllowed}
            disabled={!mixnetAllowed}
            textStyle={tw.style(
              localNymEnabled && mixnetAllowed && isDarkMode
                ? "text-backgroundLight-light"
                : "text-black-65",
            )}
            onPress={() => setLocalNymEnabled((prev) => !prev)}
          >
            {i18n("wallet.settings.node.nym.title")}
          </Toggle>
          {!mixnetAllowed ? (
            <PeachText style={tw`px-6 text-black-65 body-s`}>
              {i18n("wallet.settings.node.nym.esploraOnly")}
            </PeachText>
          ) : (
            <>
              <View style={!localNymEnabled && tw`opacity-33`}>
                <Input
                  value={localNymProvider}
                  disabled={!localNymEnabled}
                  label={i18n("wallet.settings.node.nym.provider")}
                  placeholder={i18n(
                    "wallet.settings.node.nym.provider.placeholder",
                  )}
                  onChangeText={setLocalNymProvider}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <Button
                style={tw`self-center`}
                iconId="save"
                onPress={applyNymConfig}
              >
                {i18n("wallet.settings.node.nym.apply")}
              </Button>
            </>
          )}
        </View>
      </PeachScrollView>
      {isConnected ? (
        <View style={tw`flex-row items-center justify-center gap-1`}>
          <PeachText style={tw`uppercase button-medium`}>
            {i18n("wallet.settings.node.connected")}
          </PeachText>
          <Icon id="check" size={16} color={tw.color("success-main")} />
        </View>
      ) : (
        <Button
          disabled={!canCheckConnection}
          style={tw`self-center`}
          iconId="share2"
          onPress={checkConnection}
        >
          {i18n("wallet.settings.node.checkConnection")}
        </Button>
      )}
    </Screen>
  );
};

function NodeSetupHeader() {
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="useYourOwnNode" />);
  return (
    <Header
      title={i18n("wallet.settings.node.title")}
      icons={[
        {
          ...headerIcons.help,
          accessibilityHint: `${i18n("help")} ${i18n("wallet.settings.node.title")}`,
          onPress: showHelp,
        },
      ]}
    />
  );
}

type ErrorPopupProps = {
  error: string;
};

function NodeConnectionErrorPopup({ error }: ErrorPopupProps) {
  return (
    <WarningPopup
      title={i18n("wallet.settings.node.error.title")}
      content={
        <PeachText selectable>
          {i18n("wallet.settings.node.error.text", error)}
        </PeachText>
      }
      actions={
        <ClosePopupAction
          style={tw`justify-center`}
          textStyle={tw`text-black-100`}
        />
      }
    />
  );
}

type SuccessPopupProps = {
  url: string;
  save: () => void;
};

function NodeConnectionSuccessPopup({ url, save }: SuccessPopupProps) {
  return (
    <SuccessPopup
      title={i18n("wallet.settings.node.success.title")}
      content={i18n("wallet.settings.node.success.text", url)}
      actions={
        <>
          <ClosePopupAction />
          <SaveAction {...{ save }} />
        </>
      }
    />
  );
}

function SaveAction({ save }: Pick<SuccessPopupProps, "save">) {
  const closePopup = useClosePopup();
  const onPress = () => {
    save();
    closePopup();
  };

  return (
    <LoadingPopupAction
      onPress={onPress}
      label={i18n("wallet.settings.node.success.confirm")}
      iconId={"save"}
      reverseOrder
    />
  );
}
