import { chatStorage } from "../utils/account/chatStorage";
import { error } from "../utils/log/error";
import { createPersistStorage } from "./createPersistStorage";

describe("createPersistStorage", () => {
  const persistStorage = createPersistStorage(chatStorage);
  const state = { state: { key: "value" }, version: 0 };

  it("should create a wrapper for persistent storage from MMKV storage", () => {
    expect(persistStorage).toEqual({
      setItem: expect.any(Function),
      getItem: expect.any(Function),
      removeItem: expect.any(Function),
    });
  });
  it("should set the state", async () => {
    await persistStorage?.setItem("key", state);
    expect(await chatStorage.getItem("key")).toBe(
      JSON.stringify(JSON.stringify(state)),
    );
  });
  it("should get the state", async () => {
    expect(await persistStorage?.getItem("key")).toEqual(state);
  });
  it("should return null if no storage entry for key could be found", async () => {
    expect(await persistStorage?.getItem("doesNotExist")).toBeNull();
  });
  it("should log error if state is not a JSON string", async () => {
    await chatStorage.setItem("notAJSON", "<html>");
    expect(await persistStorage?.getItem("notAJSON")).toBeNull();
    expect(error).toHaveBeenCalled();
  });
  it("should remove the state", async () => {
    expect(await chatStorage.getItem("key")).toBe(
      JSON.stringify(JSON.stringify(state)),
    );
    persistStorage?.removeItem("key");
    expect(await chatStorage.getItem("key")).toBeUndefined();
  });
});
