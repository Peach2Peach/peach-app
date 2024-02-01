import { generateSecureRandom } from "react-native-securerandom";

export const getRandom = (count: number): Promise<Buffer> =>
  new Promise((resolve) =>
    generateSecureRandom(count).then((bytes) => resolve(Buffer.from(bytes))),
  );
