const storage = {};

export const MMKVLoader = jest.fn(() => ({
  setAccessibleIOS: () => ({
    withEncryption: () => ({
      withInstanceID: (instanceId) => ({
        initialize: () => {
          storage[instanceId] = {};

          const get = jest.fn((key) => storage[instanceId][key]);
          const getAsync = jest.fn(async (key) => storage[instanceId][key]);
          const store = jest.fn((key, val) => (storage[instanceId][key] = val));
          const storeAsync = jest.fn(
            async (key, val) => (storage[instanceId][key] = val),
          );
          const remove = jest.fn((key) => delete storage[instanceId][key]);

          return {
            clearStore: jest.fn(() => (storage[instanceId] = {})),
            setItem: storeAsync,
            getItem: getAsync,
            removeItem: remove,
            getString: get,
            setString: store,
            setStringAsync: storeAsync,
            getArray: get,
            setArray: store,
            setArrayAsync: storeAsync,
            setMap: store,
            setMapAsync: storeAsync,
            getMap: get,
            getBool: get,
            setBool: store,
            getBoolAsync: getAsync,
            indexer: {
              getKeys: jest.fn(async () => Object.keys(storage[instanceId])),
              maps: {
                getAll: jest.fn(async () =>
                  Object.keys(storage[instanceId]).reduce((obj, key, i) => {
                    obj[String(i)] = [key, storage[instanceId][key]];
                    return obj;
                  }, {}),
                ),
              },
            },
            options: {
              accessibleMode: "AccessibleAfterFirstUnlock",
            },
          };
        },
      }),
    }),
  }),
}));

export const IOSAccessibleStates = {};
