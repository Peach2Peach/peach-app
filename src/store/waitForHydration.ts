import { StorePersist } from "./createPersistStorage";

export const waitForHydration = (store: StorePersist) =>
  new Promise((resolve) => {
    if (store.persist.hasHydrated()) {
      resolve(true);
    } else {
      store.persist.onFinishHydration(() => resolve(true));
    }
  });
