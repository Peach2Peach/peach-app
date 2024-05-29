export const getValidMobileNetworks = () => [
  "vodacom",
  "mtn",
  "cellc",
  "cell-c",
  "telkom",
];

export const isValidMobileNetwork = (mobileNetwork: string) =>
  getValidMobileNetworks().includes(mobileNetwork.toLowerCase());
