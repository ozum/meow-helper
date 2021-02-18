import type { AnyFlag } from "meow";
import chalk from "chalk";

const cliui = require("cliui"); // eslint-disable-line @typescript-eslint/no-var-requires

/** Meow flag extended with `desc` key. */
export type ExtendedAnyFlag = AnyFlag & { desc?: string };

/** Record of extended any flag. */
export type ExtendedAnyFlags = Record<string, ExtendedAnyFlag>;

/** Options below modify behaviour of [[getHelp]] function. */
export interface HelpOptions {
  /** Text longer than line length will be word-wrapped. */
  lineLength?: number;
  /** The total length of the colored background area of titles. */
  titleLength?: number;
  /** `package.json` data. */
  pkg?: Record<string, any>;
  /** Name of the command. */
  command?: string;
  /** Command description. */
  description?: string | string[];
  /** Uasge text is shown at the beginning of help text. Lines are prefixed with `$` and command is colored automatically. */
  usage?: string | string[];
  /** Name and description of positional arguments. */
  args?: Record<string, string>;
  /** Flags provided to meow. Uses `desc` key for the description. */
  flags?: ExtendedAnyFlags;
  /** A single example or list of examples can be provided to show in the help text. Lines are prefixed with `$` and the command is colored automatically. */
  examples?: string | string[];
  /** If space available for option descriptions is less than this threshold, descriptions are given their own rows. So they have more space. See images above. */
  multilineThreshold?: number;
  /** This option sets whether the `autoHelp` option of `meow` is used. If this is true, the description text is not added, because meow adds it automatically. */
  autoHelp?: boolean;
  /** Whether to throw an error when `meow` exits with exit code 2. If true, it adds `process.on("exit")` to show help and exits with code 0. */
  notThrow?: boolean;
  /** Option groups shown in help text. Key is the first option in group. */
  groups?: Record<string, { title?: string; description?: string }>;
  /** @ignore */
  ui?: any;
}

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

/** Checks whether any option has alias. */
function hasAnyAlias(flags: ExtendedAnyFlags): boolean {
  return Object.values(flags).some((flag) => flag.alias !== undefined);
}

/** Checks whether any option has alias. */
function hasAnyRequiredArgs(args: Record<string, string>): boolean {
  return Object.keys(args).some((arg) => arg.endsWith("*"));
}

/** Checks whether any args is required. */
function hasAnyRequiredFlags(flags: ExtendedAnyFlags): boolean {
  return Object.values(flags).some((flag) => flag.isRequired === true);
}

/** Checks whether any option is required. */
function hasAnyMulitple(flags: ExtendedAnyFlags): boolean {
  return Object.values(flags).some((flag) => flag.isMultiple);
}

/** Get maximum length of option name, default value length and argument name. */
function getMaxLengths({
  flags,
  args,
}: Required<HelpOptions>): { maxNameLength: number; maxDefaultLength: number; maxArgLength: number; aliasLength: number } {
  const requiredSpace = hasAnyRequiredFlags(flags) ? 1 : 0; // Length of asterisk.
  const multipleSpace = hasAnyMulitple(flags) ? 3 : 0; // Length of ...
  const space = requiredSpace + multipleSpace + 3; // Length of others + (name length = double dash + space = 3).
  const maxNameLength = Object.keys(flags).reduce((max, name) => (name.length + space > max ? name.length + space : max), 0);
  const maxDefaultLength = Object.values(flags).reduce((max, flag) => {
    const currentLength = flag.default ? flag.default.toString().length + 12 : 0;
    return currentLength > max ? currentLength : max;
  }, 1);
  const maxArgLength = Object.keys(args).reduce((max, name) => (name.length + 3 > max ? name.length + 3 : max), 0);
  return { maxNameLength, maxDefaultLength, maxArgLength, aliasLength: hasAnyAlias(flags) ? 3 : 0 };
}

/** Return arg name colorized and between brackets (`<>`). If arg name ends with `...`, add `...` after bracket. Add red "*" to required args. */
function getArg(arg: string): string {
  const required = arg.endsWith("*") ? chalk.red("*") : "";
  arg = arg.replace("*", ""); // eslint-disable-line no-param-reassign
  return cyan(arg.endsWith("...") ? `<${arg.replace(/...$/, "")}>...` : `<${arg}>`) + required;
}

/** Colorize command if string starts with command. */
function colorizeCommand(text: string, options: Required<HelpOptions>): string {
  return text.replace(new RegExp(`^(${options.command})`), chalk`{dim $} {green $1}`);
}

/** Add title to help text. */
function addTitle(title: keyof typeof TITLE_COLORS, options: Required<HelpOptions>): void {
  const prefixSpace = " ".repeat(Math.ceil((options.titleLength - title.length) / 2)); // Unicode Character “ ” (U+00A0) No-Break-Space
  const suffixSpace = " ".repeat(options.titleLength - title.length - prefixSpace.length); // Unicode Character “ ” (U+00A0) No-Break-Space
  const titleString = TITLE_COLORS[title](`${prefixSpace}${title.toUpperCase()}${suffixSpace}`);
  options.ui.div({ text: titleString, padding: [1, 0, 1, 0] });
}

/** Add usage to help text. */
function addUsage(options: Required<HelpOptions>): void {
  const usage = arrify(options.usage);
  addTitle("usage", options);
  if (usage.length > 0) usage.forEach((line) => options.ui.div(colorizeCommand(line, options)));
  else {
    const flagsText = options.flags && Object.keys(options.flags).length > 0 ? `${yellow("[options]")} ` : "";
    const argsText = options.args && Object.keys(options.args).length > 0 ? Object.keys(options.args).map(getArg) : "";
    options.ui.div(chalk`{dim $} {green ${options.command}} ${flagsText}${argsText}`);
  }
}

/** Add examples to help text. */
function addExamples(options: Required<HelpOptions>): void {
  const examples = arrify(options.examples);
  if (examples.length > 0) {
    addTitle("examples", options);
    examples.forEach((line) => options.ui.div(colorizeCommand(line, options)));
  }
}

/** Add command arguments to help text. */
function addArguments(maxArgLength: number, options: Required<HelpOptions>): void {
  if (!options.args || Object.keys(options.args).length === 0) return;
  addTitle("arguments", options);
  Object.entries(options.args).forEach(([argName, desc]) => {
    options.ui.div({ text: getArg(argName), width: maxArgLength }, { text: desc });
  });
}

function addGroup(flagName: string, options: Required<HelpOptions>, index: number): void {
  const group = options.groups[flagName];
  options.ui.div({ text: chalk.yellow.dim(`${group.title}:`), padding: [index === 0 ? 0 : 1, 0, 0, 0] });
  if (group.description) options.ui.div({ text: chalk.yellow.dim(group.description) });
}

/** Add command options to help text. */
function addOptions(maxNameLength: number, maxDefaultLength: number, aliasLength: number, options: Required<HelpOptions>): void {
  const { flags } = options;
  if (!flags || Object.keys(flags).length === 0) return;
  const singleRow = options.lineLength - (maxNameLength + maxDefaultLength + aliasLength) > options.multilineThreshold;
  addTitle("options", options);

  Object.entries(flags).forEach(([flagName, flag], i) => {
    if (options.groups[flagName]) addGroup(flagName, options, i);

    const required = flag.isRequired === true ? chalk.red("*") : "";
    const multiple = flag.isMultiple ? "..." : "";
    const defaultValue = flag.default ? chalk`{dim (Default: }{yellow ${flag.default}}{dim )}` : "";
    const aliasCOlumn = { text: flag.alias ? chalk`{yellow -${flag.alias}}` : "", width: 3 };
    const nameColumn = { text: chalk`{yellow --${flagName}${multiple}}${required}`, width: maxNameLength };
    const firstRow = singleRow
      ? [aliasCOlumn, nameColumn, { text: defaultValue, width: maxDefaultLength }, { text: flag.desc }]
      : [aliasCOlumn, nameColumn, { text: defaultValue, align: "right" }];
    if (aliasLength === 0) firstRow.shift();
    options.ui.div(...firstRow);
    if (!singleRow) options.ui.div({ text: flag.desc, padding: [0, 0, 0, 5] });
  });
}

/**
 * Generate help text for meow.
 *
 * @param helpOptions are options
 * @example
 * const flags: ExtendedFlags = { cwd: { alias: "c", type: "string", desc: "Current CWD." }, ...commonFlags };
 * const args = { path: "Path of file." };
 *
 * meow(getHelp({flags, args, pkg}), { flags, pkg, allowUnknownFlags: false });
 */
// export default function getHelp(helpOptions: HelpOptions): string {
export default function getHelp(helpOptions: HelpOptions): string {
  const lineLength = helpOptions.lineLength || 1000;
  const ui = cliui({ width: lineLength });
  const options: Required<HelpOptions> = {
    lineLength,
    titleLength: 15,
    pkg: {},
    command: helpOptions.pkg && helpOptions.pkg.name,
    description: helpOptions.pkg && helpOptions.pkg.description,
    usage: [],
    args: {},
    flags: {},
    examples: [],
    multilineThreshold: 50,
    autoHelp: true,
    notThrow: true,
    groups: {},
    ...helpOptions,
    ui,
  };

  if (!options.command) throw new Error("Either 'command' or 'pkg' with name is required.");
  const { maxNameLength, maxDefaultLength, maxArgLength, aliasLength } = getMaxLengths(options);

  // meow autoHelp shows description from package.json automatically.
  if (!options.autoHelp) {
    ui.div({ text: chalk`{bold.green ${options.command}}`, padding: [1, 0, 0, 0] });
    if (options.description) options.ui.div({ text: `${options.description}`, padding: [1, 0, 0, 0] });
  }

  addUsage(options);
  addArguments(maxArgLength, options);
  addOptions(maxNameLength, maxDefaultLength, aliasLength, options);
  if (hasAnyRequiredFlags(options.flags) || hasAnyRequiredArgs(options.args))
    options.ui.div({ text: chalk`{red *} Required field.`, padding: [1, 0, 0, 0] });
  addExamples(options);
  ui.div("");
  const help = options.ui.toString();

  if (options.notThrow) {
    /* istanbul ignore next */
    process.on("exit", (code) => {
      if (code === 2) {
        console.log(help); // eslint-disable-line no-console
        process.exit(0);
      }
      process.exit(code);
    });
  }

  return help;
}
