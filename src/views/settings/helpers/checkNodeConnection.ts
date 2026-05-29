import { ElectrumClient, EsploraClient } from "bdk-rn";
import { info } from "../../../utils/log/info";
import { parseError } from "../../../utils/parseError";
import { BlockChainNames } from "../../../utils/wallet/bdkShim";
import { addProtocol } from "../../../utils/web/addProtocol";

const resolveUrl = (url: string, defaultScheme: string) =>
  url.includes("://") ? url : addProtocol(url, defaultScheme);

const checkElectrumConnection = async (address: string, ssl: boolean) => {
  try {
    info("Checking electrum connection...");
    const client = new ElectrumClient(
      resolveUrl(address, ssl ? "ssl" : "tcp"),
      undefined,
      false,
    );
    await client.ping();
    return { result: BlockChainNames.Electrum };
  } catch (e) {
    info("electrum connection failed");
    return { error: parseError(e) };
  }
};
const checkEsploraConnection = async (address: string, ssl: boolean) => {
  try {
    info("Checking esplora connection...");
    const client = new EsploraClient(
      resolveUrl(address, ssl ? "https" : "http"),
      undefined,
    );
    await client.getHeight();
    return { result: BlockChainNames.Esplora };
  } catch (e) {
    info("esplora connection failed");
    return { error: parseError(e) };
  }
};
const connectionChecks = [checkElectrumConnection, checkEsploraConnection];
export const checkNodeConnection = async (address: string, ssl = false) => {
  const errors: unknown[] = [];
  for (const connectionCheck of connectionChecks) {
    // eslint-disable-next-line no-await-in-loop
    const { result, error } = await connectionCheck(address, ssl);
    if (result) return { result };
    errors.push(error);
  }
  return { error: errors.join("\n\n") };
};
