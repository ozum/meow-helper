import type { AnyFlag } from "meow";
import chalk from "chalk";

const cliui = require("cliui"); // eslint-disable-line @typescript-eslint/no-var-requires

export type ExtendedFlags = Record<string, AnyFlag & { desc: string }>;

/** Options for generating a help text. */
export interface HelpOptions {
  /** Line length to be used. Longer text will be word-wrapped. */
  lineLength?: number;
  /** The total length of the colored background area of titles. */
  titleLength?: number;
  /** `package.json` data. */
  pkg?: Record<string, any>;
  /** Name of the command. */
  command?: string;
  /** Command description. */
  description?: string | string[];
  /** A single usage or list of usages. If lines start with the command, it will be colored automatically. Also prefixed with `$`. */
  usage?: string | string[];
  /** Name and description of positional arguments. */
  args?: Record<string, string>;
  /** Flags provided to meow. Uses `desc` key for the description. */
  flags?: ExtendedFlags;
  /** A single example or list of examples. If lines start with the command, it will be colored automatically. Also prefixed with `$`. */
  examples?: string | string[];
  /** If space available for option descriptions is less than this threshold, descriptions are given their own rows. So they have more space. See images above. */
  multilineThreshold?: number;
}

/** ignore */
type OptionsWithDefaults = HelpOptions & { titleLength: number; lineLength: number; multilineThreshold: number; ui: any };

const { cyan, yellow } = chalk;

const TITLE_COLORS = {
  usage: chalk.bold.inverse.green,
  arguments: chalk.bold.inverse.cyan,
  options: chalk.bold.inverse.yellow,
  examples: chalk.bold.inverse.magenta,
};

/**
 * Assures output is an array by converting sets and single valiues into array.
 *
 * @param input is the input.
 * @returns the array.
 */
export function arrify<T>(input?: T | T[]): T[] {
  if (input === undefined) return [];
  return Array.isArray(input) ? input : [input];
}

/** Get maximum length of option name, default value length and argument name. */
function getMaxLengths({
  flags = {} as any,
  args = {} as any,
}: OptionsWithDefaults): { maxNameLength: number; maxDefaultLength: number; maxArgLength: number } {
  const maxNameLength = Object.keys(flags).reduce((currentMax, name) => (name.length + 6 > currentMax ? name.length + 6 : currentMax), 0);
  const maxDefaultLength = Object.entries(flags).reduce((currentMax, [, flag]) => {
    const currentLength = flag.default ? flag.default.toString().length + 12 : 0;
    return currentLength > currentMax ? currentLength : currentMax;
  }, 0);
  const maxArgLength = Object.keys(args).reduce((currentMax, name) => (name.length + 3 > currentMax ? name.length + 3 : currentMax), 0);
  return { maxNameLength, maxDefaultLength, maxArgLength };
}

/** Get command name from options or "name" in package.json data. */
function getCommand(options: OptionsWithDefaults): string {
  return options.command ?? options.pkg?.name;
}

/** Colorize command if string starts with command. */
function colorizeCommand(text: string, options: OptionsWithDefaults): string {
  return text.replace(new RegExp(`^(${getCommand(options)})`), chalk`{green $1}`);
}

/** Add title to help text. */
function addTitle(title: keyof typeof TITLE_COLORS, options: OptionsWithDefaults): void {
  const prefixSpace = " ".repeat(Math.ceil((options.titleLength - title.length) / 2));
  const suffixSpace = " ".repeat(options.titleLength - title.length - prefixSpace.length);
  const titleString = TITLE_COLORS[title](`${prefixSpace}${title.toUpperCase()}${suffixSpace}`);
  options.ui.div({ text: titleString, padding: [1, 0, 1, 0] });
}

/** Add usage to help text. */
function addUsage(options: OptionsWithDefaults): void {
  const command = getCommand(options);
  const usage = arrify(options.usage);
  if (usage.length > 0 || command) addTitle("usage", options);

  if (usage.length > 0) {
    usage.forEach((line) => options.ui.div(chalk`{dim $} ${colorizeCommand(line, options)}`));
  } else if (command) {
    const flagsText = options.flags && Object.keys(options.flags).length > 0 ? `${yellow("<options>")} ` : "";
    const argsText = options.args && Object.keys(options.args).length > 0 ? Object.keys(options.args).map((arg) => `${cyan(arg)}`) : "";
    options.ui.div(chalk`{dim $} {green ${command}} ${flagsText}${argsText}`);
  }
}

/** Add examples to help text. */
function addExamples(options: OptionsWithDefaults): void {
  const examples = arrify(options.examples);
  if (examples.length > 0) {
    addTitle("examples", options);
    examples.forEach((line) => options.ui.div(chalk`{dim $} ${colorizeCommand(line, options)}`));
  }
}

/** Add command arguments to help text. */
function addArguments(maxArgLength: number, options: OptionsWithDefaults): void {
  if (!options.args || Object.keys(options.args).length === 0) return;
  addTitle("arguments", options);
  Object.entries(options.args).forEach(([argName, desc]) => {
    options.ui.div({ text: chalk`{cyan <${argName}>}`, width: maxArgLength }, { text: desc });
  });
}

/** Add command options to help text. */
function addOptions(maxNameLength: number, maxDefaultLength: number, options: OptionsWithDefaults): void {
  const { flags } = options;
  if (!flags || Object.keys(flags).length === 0) return;

  const singleRow = options.lineLength - (maxNameLength + maxDefaultLength) > options.multilineThreshold;
  addTitle("options", options);
  Object.entries(flags).forEach(([flagName, flag]) => {
    const alias = flag.alias ? `-${flag.alias}` : "  ";
    const defaultValue = flag.default ? chalk`{dim (Default: }{yellow ${flag.default}}{dim )}` : "";
    if (singleRow) {
      options.ui.div(
        { text: chalk`{yellow ${alias} --${flagName}}`, width: maxNameLength },
        { text: defaultValue, width: maxDefaultLength },
        { text: flag.desc }
      );
    } else {
      options.ui.div({ text: chalk`{yellow ${alias} --${flagName}}` }, { text: defaultValue, align: "right" });
      options.ui.div({ text: flag.desc, padding: [0, 0, 0, 5] });
    }
  });
}

/**
 * Generate help text for meow.
 *
 * @param helpOptions are options
 * @example
 * const flags = {
 *   cwd: { alias: "c", type: "string", desc: "Current CWD." },
 *   verbose: { alias: "v", type: "boolean", desc: "Add extra info." }
 * };
 *
 * const args = { path: "Path of file." };
 *
 * meow(getHelp({flags, args}), { flags });
 */
export default function getHelp(helpOptions: HelpOptions): string {
  const lineLength = helpOptions.lineLength ?? 80;
  const ui = cliui({ width: lineLength });
  const options: OptionsWithDefaults = { lineLength, titleLength: 15, multilineThreshold: 50, ...helpOptions, ui };
  const description = options.description ?? options.pkg?.description;
  const { maxNameLength, maxDefaultLength, maxArgLength } = getMaxLengths(options);
  const command = getCommand(options);

  if (command) ui.div({ text: chalk`{bold ${command}}`, padding: [1, 0, 0, 0], border: true });
  if (description) options.ui.div(`${description}`);
  addUsage(options);
  addArguments(maxArgLength, options);
  addOptions(maxNameLength, maxDefaultLength, options);
  addExamples(options);
  ui.div("");
  return options.ui.toString();
}
