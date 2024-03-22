import {
  BreezEvent,
  EnvironmentType,
  NodeConfig,
  NodeConfigVariant,
  connect,
  defaultConfig,
  mnemonicToSeed,
  nodeInfo,
} from "@breeztech/react-native-breez-sdk";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { error } from "../log/error";
import { log } from "../log/log";

const onBreezEvent = (e: BreezEvent) => {
  log(`breez-sdk - Received event ${e.type}`);
};

export const initLightningWallet = async (
  mnemonic: string,
  apiKey: string,
  inviteCode: string,
) => {
  const seed = await mnemonicToSeed(mnemonic);
  const nodeConfig: NodeConfig = {
    type: NodeConfigVariant.GREENLIGHT,
    config: { inviteCode },
  };

  const config = await defaultConfig(
    EnvironmentType.PRODUCTION,
    apiKey,
    nodeConfig,
  );

  await connect(config, seed, onBreezEvent).catch((e) => {
    error(`breez-sdk - Error connecting: ${e}`);
  });
  nodeInfo().then((info) => {
    if (info.id) useSettingsStore.getState().setBreezInviteCode(inviteCode);
  });
};
