import { BlockChainNames } from "bdk-rn/lib/lib/enums";
import { NodeConfig, useNodeConfigState } from "./nodeConfigStore";

describe("nodeConfigStore", () => {
  afterEach(() => {
    useNodeConfigState.getState().reset();
  });
  it("returns defaults", () => {
    expect(useNodeConfigState.getState()).toEqual({
      ...useNodeConfigState.getState(),
      enabled: false,
      ssl: false,
      gapLimit: 25,
    });
  });

  it("updates node settings", () => {
    const nodeSettings: NodeConfig = {
      enabled: true,
      url: "blockstream.info",
      ssl: true,
      type: BlockChainNames.Esplora,
      gapLimit: 25,
    };
    useNodeConfigState.getState().setCustomNode(nodeSettings);
    expect(useNodeConfigState.getState()).toEqual({
      ...useNodeConfigState.getState(),
      ...nodeSettings,
    });
  });
  it("toggles enabled flag", () => {
    expect(useNodeConfigState.getState().enabled).toBeFalsy();
    useNodeConfigState.getState().toggleEnabled();
    expect(useNodeConfigState.getState().enabled).toBeTruthy();
    useNodeConfigState.getState().toggleEnabled();
    expect(useNodeConfigState.getState().enabled).toBeFalsy();
  });
});
