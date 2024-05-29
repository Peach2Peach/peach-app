export const getValidMobileNetworks = () => [
  "vodacom",
  "mtn",
  "cellc",
  "cell-c",
  "telkom",
];

export const isValidMobileNetwork = (mobileNetwork: string): boolean =>
  getValidMobileNetworks().includes(mobileNetwork.toLowerCase());
