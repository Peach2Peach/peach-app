import { DEV } from "@env";

export const isProduction = () => DEV !== "true";
