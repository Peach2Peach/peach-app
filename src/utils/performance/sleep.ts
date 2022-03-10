/**
 * @description Method to wait x ms
 * @param ms delay in ms
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))