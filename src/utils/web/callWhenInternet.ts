import NetInfo from "@react-native-community/netinfo";

export const callWhenInternet = async (
  callback: () => void | Promise<void>,
) => {
  const netInfo = await NetInfo.fetch();
  if (netInfo.isInternetReachable) {
    await callback();
  } else {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (!state.isInternetReachable) return;
      await callback();
      unsubscribe();
    });
  }
};
