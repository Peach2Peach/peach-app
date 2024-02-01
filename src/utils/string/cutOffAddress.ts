const longAddressThreshold = 15;
const endOfFirstPart = 8;
const startOfSecondPart = -6;
export const cutOffAddress = (address: string) => {
  if (address.length < longAddressThreshold) {
    return address;
  }
  return `${address.slice(0, endOfFirstPart)} ... ${address.slice(startOfSecondPart)}`;
};
