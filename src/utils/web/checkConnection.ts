import NetInfo from '@react-native-community/netinfo'

export const checkConnection = async (callback: Function) => {
  const netInfo = await NetInfo.fetch()
  if (netInfo.isInternetReachable) {
    callback()
  } else {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isInternetReachable) return
      callback()
      unsubscribe()
    })
  }
}
