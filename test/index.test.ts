import chalk from "chalk";
import getHelp from "../src/index";
import type { ExtendedFlags } from "../src/get-help";

chalk.level = 0;

const cliFlags: ExtendedFlags = {
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
};

describe("getHelp()", () => {
  it("should return help text.", () => {
    const help = getHelp({
      multilineThreshold: 50,
      command: "not-sync",
      lineLength: 120,
      usage: ["not-sync [options] <path>...", "not-sync <path>..."],
      description: "Disable file synchronization for files in an auto detected cloud storage such as Dropbox, iCloudDrive or OneDrive.",
      args: { path: "Path or list of paths to disable syncronization for.", cli: "use cli" },
      flags: cliFlags,
      examples: "not-sync node_modules,dist,coverage",
    });
    expect(help).toMatchSnapshot();
  });

  it("should use default values.", () => {
    const help = getHelp({ flags: cliFlags });
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
});
