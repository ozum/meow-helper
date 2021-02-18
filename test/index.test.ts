import chalk from "chalk";
import getHelp from "../src/index";
import type { ExtendedAnyFlags } from "../src/get-help";

chalk.level = 0;

const cliFlags: ExtendedAnyFlags = {
  cwd: { alias: "c", type: "string", desc: "Set current working directory for relative paths." },
  ignoreConfigs: {
    alias: "i",
    type: "string",
    default: "node_modules,dist",
    desc: "(CSV) Ignore configuration files (e.g. .gitignore, .prettierignore) to add new created files if any.",
  },
  dry: { alias: "d", type: "boolean", desc: "Prevents changes to be written to disk. Executes a dry run." },
  verbose: { alias: "v", type: "boolean", default: true, desc: "Outputs extra information." },
  linkSameDir: {
    type: "boolean",
    desc: "Move files near original one for iCloudDrive. For example 'dist' is moved 'dist.nosync' in same directory.",
  },
  colors: { alias: "c", type: "string", isMultiple: true, isRequired: true, desc: "Favorite colors." },
  size: { alias: "s", type: "number", isRequired: () => true, desc: "Size." },
};

describe("getHelp()", () => {
  it("should throw if command cannot be found.", () => {
    expect(() => getHelp({ autoHelp: false, args: { path: "some" } })).toThrow("Either 'command'");
  });

  it("should return help text.", () => {
    const help = getHelp({
      multilineThreshold: 50,
      command: "not-sync",
      lineLength: 80,
      usage: ["not-sync [options] <path>...", "not-sync <path>..."],
      description: "Disable file synchronization for files in an auto detected cloud storage such as Dropbox, iCloudDrive or OneDrive.",
      args: { "path*": "Path or list of paths to disable syncronization for.", cli: "use cli" },
      flags: cliFlags,
      examples: "not-sync node_modules,dist,coverage",
      groups: { cwd: { title: "General Options", description: "General description." }, colors: { title: "Appereance Options" } },
    });
    expect(help).toMatchSnapshot();
  });

  it("should render withot any alias.", () => {
    const help = getHelp({ command: "not-sync", flags: { color: { desc: "color" }, size: { desc: "size" } } });
    expect(help).toMatchSnapshot();
  });

  it("should use default values.", () => {
    const help = getHelp({ flags: cliFlags, command: "not-sync" });
    expect(help).toMatchSnapshot();
  });

  it("should use package.json data.", () => {
    const help = getHelp({ flags: cliFlags, pkg: { name: "not-sync", description: "details" } });
    expect(help).toMatchSnapshot();
  });

  it("should generate help without options.", () => {
    const help = getHelp({ args: { path: "some" }, command: "not-sync" });
    expect(help).toMatchSnapshot();
  });

  it("should generate name details if `autoHelp` is false.", () => {
    const help = getHelp({ autoHelp: false, command: "not-sync", description: "Desc" });
    expect(help).toMatchSnapshot();
  });

  it("should generate name details without command and description if `autoHelp` is false.", () => {
    const help = getHelp({ autoHelp: false, command: "not-sync", args: { "path...": "some" } });
    expect(help).toMatchSnapshot();
  });

  it("should throw if process exit with code 2.", () => {
    getHelp({ command: "not-sync", notThrow: false });
    expect(true).toBe(true);
  });

  it("should generate options without any default value.", () => {
    const help = getHelp({ command: "not-sync", flags: { path: { desc: "a" }, cwd: { desc: "b" } } });
    expect(help).toMatchSnapshot();
  });
});
