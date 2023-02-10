export const getMessageToSignForAddress = (userId: string, address: string) =>
  `I confirm that only I, peach${userId.substring(0, 8)}, control the address ${address}`
