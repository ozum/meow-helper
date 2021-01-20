import chalk from "chalk";
import getHelp from "./get-help";

const cliui = require("cliui"); // eslint-disable-line @typescript-eslint/no-var-requires

export default getHelp;
export { chalk, cliui };
export type { HelpOptions } from "./get-help";

export const commonFlags = {
  help: { type: "boolean", desc: "Show help." },
  version: { type: "boolean", desc: "Show version." },
};
