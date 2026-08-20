import { useEffect, useState } from "react";
import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
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
import { isMixnetAllowedNode } from "../../utils/wallet/nym/isMixnetAllowedNode";
import { useNymProxyState } from "../../utils/wallet/nymProxyStore";
import { peachWallet } from "../../utils/wallet/setWallet";
import { checkNodeConnection } from "./helpers/checkNodeConnection";

const urlRules = { required: true, url: true };
export const NodeSetup = () => {
  const setPopup = useSetPopup();
  const { isDarkMode } = useThemeStore();

  const [node, setCustomNode] = useNodeConfigState(
    (state) => [state, state.setCustomNode],
    shallow,
  );
  // Local until confirmed, exactly like `ssl` and `url` below: turning the
  // toggle ON only opens the form — a saved node is not put back into use until
  // the user connects to it again and saves the result.
  const [enabled, setEnabled] = useState(node.enabled);
  const [ssl, toggleSSL] = useToggleBoolean(node.ssl);
  const [url, setURL, isURLValid, urlErrors] = useValidatedState<string>(
    node.url || "",
    urlRules,
  );
  const canCheckConnection = enabled && isURLValid;
  // A saved url alone is not "connected": the node also has to be switched on.
  const [isConnected, setIsConnected] = useState(node.enabled && !!node.url);

  // The mixnet needs Esplora, and a CUSTOM node is taken as configured — so
  // while the mixnet is on, saving a node that turns out to be Electrum is
  // blocked below (it would make PeachWallet.configure tear the proxy down).
  //
  // Switching the custom node OFF needs no such guard: that falls back to the
  // built-in node, which buildBlockchainConfig points at the env's Esplora
  // endpoint whenever the mixnet is routing.
  const nymEnabled = useNymProxyState((state) => state.enabled);

  const editConfig = () => setIsConnected(false);

  // Dropping the custom node needs a full initWallet, not just setBlockchain:
  // getDbPaths keys the wallet database on the node TYPE, so swapping only the
  // client would leave the wallet bound to the previous node's db.
  const revertToDefaultNode = async () => {
    if (!peachWallet) throw Error("Peach wallet not defined");
    setPopup(<LoadingPopup title={i18n("wallet.settings.node.title")} />);
    // Same reason as in checkConnection: bdk blocks the JS thread while the
    // client connects, so yield to let the loading popup render first.
    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      await peachWallet.initWallet();
      setPopup(<DefaultNodeRestoredPopup />);
    } catch (e) {
      setPopup(<NodeConnectionErrorPopup error={parseError(e)} />);
    }
  };

  const toggleUseOwnNode = () => {
    // `enabled` still holds the pre-toggle value at this point.
    const turningOn = !enabled;
    setEnabled(turningOn);
    setIsConnected(false);

    // Turning ON only reopens the form with the saved address prefilled —
    // nothing is put into use until the connection is checked and saved, so the
    // stored config is left untouched here.
    if (turningOn) return undefined;

    // ...which also means turning it back off can be a no-op: the stored
    // `enabled` only becomes true on save, so while it is false the built-in
    // node is already in use and there is nothing to revert or report.
    if (!node.enabled) return undefined;

    // Turning OFF takes effect right away: there is nothing to verify about
    // going back to the built-in node.
    setCustomNode({ enabled: false });
    return revertToDefaultNode();
  };

  const save = (blockchainType: BlockChainNames) => {
    if (!peachWallet) throw Error("Peach wallet not defined");
    // Saving is the only path that puts a custom node into use, so `enabled` is
    // written as true rather than read back from the local toggle.
    const nodeConfig = { enabled: true, ssl, url, type: blockchainType };
    setCustomNode(nodeConfig);
    setIsConnected(true);
    // setBlockchain is async (it may start the Nym proxy); initWallet re-runs it
    // anyway, so just guard against an unhandled rejection here.
    peachWallet.setBlockchain(nodeConfig).catch(() => {});
    peachWallet.initWallet();
  };

  const checkConnection = async () => {
    setPopup(
      <LoadingPopup title={i18n("wallet.settings.node.checkingConnection")} />,
    );

    // checkNodeConnection uses bdk's synchronous clients, which block the JS
    // thread for the duration of the connection attempt. Yield first so the
    // loading popup actually renders before the UI freezes during the check.
    await new Promise((resolve) => setTimeout(resolve, 0));

    const { result: nodeType, error } = await checkNodeConnection(url, ssl);
    if (nodeType) {
      // Ask about the node as it would be SAVED — a custom node, in use — so the
      // built-in-node exemption doesn't apply and the type has to be Esplora.
      if (
        nymEnabled &&
        !isMixnetAllowedNode({ enabled: true, url, type: nodeType })
      ) {
        return setPopup(<NodeBlockedByMixnetPopup />);
      }
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
          onPress={toggleUseOwnNode}
        >
          {i18n("wallet.settings.node.title")}
        </Toggle>
        {/* Only while a custom node is in use: the built-in node is free to
            switch to Esplora on its own, so the restriction doesn't apply. */}
        {!!nymEnabled && !!enabled && (
          <PeachText style={tw`px-6 text-black-65 body-s`}>
            {i18n("wallet.settings.node.lockedByNym")}
          </PeachText>
        )}
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
        <PeachText selectable ignoreDarkMode>
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

/** The node answered, but it is not an Esplora node and the mixnet is on — so
 *  saving it would silently stop the proxy. Refuse instead of asking to save. */
function NodeBlockedByMixnetPopup() {
  return (
    <WarningPopup
      title={i18n("wallet.settings.node.blockedByNym.title")}
      content={
        <PeachText ignoreDarkMode>
          {i18n("wallet.settings.node.blockedByNym.text")}
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

/** Switching the toggle off is otherwise silent — the screen would keep looking
 *  the same while the wallet quietly moved back to the built-in node. */
function DefaultNodeRestoredPopup() {
  return (
    <SuccessPopup
      title={i18n("wallet.settings.node.switched.default.title")}
      content={i18n("wallet.settings.node.switched.default.text")}
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
