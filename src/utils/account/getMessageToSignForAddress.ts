import { PEACH_ID_LENGTH } from "./PEACH_ID_LENGTH";

export const getMessageToSignForAddress = (userId: string, address: string) =>
  `I confirm that only I, peach${userId.substring(0, PEACH_ID_LENGTH)}, control the address ${address}`;
