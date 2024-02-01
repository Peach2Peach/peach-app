import { DEV } from "@env";

/**
 * @description Method to check if app is compiled for production
 */
export const isProduction = () => DEV !== "true";
