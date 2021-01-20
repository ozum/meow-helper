import chalk from "chalk";
import getHelp from "./get-help";
import type { HelpOptions, ExtendedAnyFlag, ExtendedAnyFlags } from "./get-help";

const cliui = require("cliui"); // eslint-disable-line @typescript-eslint/no-var-requires

export default getHelp;
export { chalk, cliui };
export type { HelpOptions, ExtendedAnyFlag, ExtendedAnyFlags };

/** Very common flags */
export const commonFlags: ExtendedAnyFlags = {
  help: { type: "boolean", desc: "Show help." },
  version: { type: "boolean", desc: "Show version." },
};
