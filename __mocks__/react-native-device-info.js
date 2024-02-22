export const getBuildNumber = jest.fn();
export const getUniqueId = jest.fn(() => "UNIQUE-DEVICE-ID");
export const getUniqueIdSync = jest.fn(() => "UNIQUE-DEVICE-ID");
export const getVersion = jest.fn(() => "0.2.0");
export const isAirplaneModeSync = jest.fn();
export const getBundleId = jest.fn(() => "com.example.bundleId");
export const getInstallerPackageNameSync = jest.fn();
export const getInstallReferrer = jest.fn(() => Promise.resolve(""));
