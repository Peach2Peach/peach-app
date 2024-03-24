import { ElementsValue } from "liquidjs-lib";

export const numberConverter = (value: number | Buffer) =>
  typeof value === "number" ? value : ElementsValue.fromBytes(value).number;
