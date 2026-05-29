// @ts-nocheck
import { BlockChainNames } from "./bdkShim";
import { buildBlockchainConfig } from "./buildBlockchainConfig";

describe("buildBlockchainConfig", () => {
  it("returns a client with the default node type when disabled", () => {
    const result = buildBlockchainConfig({ enabled: false, ssl: false });
    expect(result.client).toBeDefined();
    expect(result.gapLimit).toBe(25);
  });
  it("returns a client when enabled but no url", () => {
    const result = buildBlockchainConfig({ enabled: true, ssl: false });
    expect(result.client).toBeDefined();
  });
  it("returns a client with the specified type", () => {
    const electrum = buildBlockchainConfig({
      enabled: true,
      ssl: false,
      url: "url",
      type: BlockChainNames.Electrum,
    });
    expect(electrum.type).toBe(BlockChainNames.Electrum);
    const esplora = buildBlockchainConfig({
      enabled: true,
      ssl: true,
      url: "url",
      type: BlockChainNames.Esplora,
    });
    expect(esplora.type).toBe(BlockChainNames.Esplora);
  });
});
