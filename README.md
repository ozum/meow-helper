# Highlights

- Generates help text without effort.
- Provides common flags. (`--help` and `--version`)
- `meow` throws unknown flags with the `allowUnknownFlags` option. `meow-helper` shows help text instead of throwing. You can change this behavior with the `notThrow` option.
- Formats, colorizes, and aligns arguments, options, default values, and their descriptions.
- Supports maximum line length and automatic word wrap.
- Splits options into two lines if space for description is too small. You can change this behavior with the `multilineThreshold` option.)
- Switches single line to multi-line if option descriptions have a small space. You can change this behavior with the `multilineThreshold` option.
- Color output with background colored titles.
- Generates usage section.
- Colorizes `command` at the start of usage and examples.
- Adds `$` at the start of provided `usage` and `examples`.
- Exports [chalk](https://www.npmjs.com/package/chalk) and [cliui](https://www.npmjs.com/package/cliui).
- Supports both `{ autoHelp: true }` and `{ autoHelp: false }`. Adds a description to help if required.
- Moves three dots in arguments outside of brackets. For example: `args: { “path...” }` becomes `command <path>...`

# Synopsis

```ts
// TypeScript
import getHelp, { commonFlags, chalk, cliui } from "meow-helper";
import { readFileSync } from "fs";
```

```js
const { default: getHelp, commonFlags, chalk, cliui } = require("meow-helper");
const { readFileSync } = require("fs");
```

```ts
const flags = { ...commonFlags, cwd: { alias: "c", type: "string", desc: "Current CWD." } };
const args = { "path...": "Paths of files." };
const pkg = JSON.parse(readFileSync(join(__dirname, "../../package.json"), { encoding: "utf8" }));

meow(getHelp({ flags, args, pkg }), { flags, allowUnknownFlags: false });
```

```ts
const help = getHelp({
  lineLength: 80,
  titleLength: 15,
  pkg: {}, // package.json data
  command: "not-sync",
  description: "Description of the command",
  args: { path: "Path of file." },
  flags, // meow flags with `desc` key.
  examples: ["not-sync node_modules,dist,coverage", "not-sync node_modules,dist,coverage --ignoreConfigs .gitignore"],
  multilineThreshold: 50,
  autoHelp: true,
  notThrow: true,
});
```

# Details

`meow-helper` generates single-line or multi-line help text based on the `multilineThreshold` option automatically.

## Single-Line

![meow-helper help text in single line mode](./module-files/images/single-line.png)

## Multi-Line

![meow-helper help text in multi line mode](./module-files/images/multi-line.png)

<!-- usage -->

<!-- commands -->

# API

<a name="readmemd"></a>

meow-helper

# meow-helper

## Table of contents

### Interfaces

- [HelpOptions](#interfaceshelpoptionsmd)

### Variables

- [cliui](#cliui)
- [commonFlags](#commonflags)

### Functions

- [default](#default)

## Variables

### cliui

• `Const` **cliui**: _any_

Defined in: [index.ts:4](https://github.com/ozum/meow-helper/blob/7ed921d/src/index.ts#L4)

---

### commonFlags

• `Const` **commonFlags**: _object_

#### Type declaration:

| Name      | Type     | Value                                                                |
| --------- | -------- | -------------------------------------------------------------------- |
| `help`    | _object_ | { `desc`: _string_ = "Show help."; `type`: _string_ = "boolean" }    |
| `version` | _object_ | { `desc`: _string_ = "Show version."; `type`: _string_ = "boolean" } |

Defined in: [index.ts:10](https://github.com/ozum/meow-helper/blob/7ed921d/src/index.ts#L10)

## Functions

### default

▸ **default**(`helpOptions`: [_HelpOptions_](#interfaceshelpoptionsmd)): _string_

Generate help text for meow.

#### Example

```typescript
const flags = {
  cwd: { alias: "c", type: "string", desc: "Current CWD." },
  verbose: { alias: "v", type: "boolean", desc: "Add extra info." },
};

const args = { path: "Path of file." };

meow(getHelp({ flags, args }), { flags });
```

#### Parameters:

| Name          | Type                                      | Description |
| ------------- | ----------------------------------------- | ----------- |
| `helpOptions` | [_HelpOptions_](#interfaceshelpoptionsmd) | are options |

**Returns:** _string_

Defined in: [get-help.ts:156](https://github.com/ozum/meow-helper/blob/7ed921d/src/get-help.ts#L156)

# Interfaces

<a name="interfaceshelpoptionsmd"></a>

[meow-helper](#readmemd) / HelpOptions

# Interface: HelpOptions

Options below modify behaviour of [[getHelp]] function.

## Hierarchy

- **HelpOptions**

## Table of contents

### Properties

- [args](#args)
- [autoHelp](#autohelp)
- [command](#command)
- [description](#description)
- [examples](#examples)
- [flags](#flags)
- [lineLength](#linelength)
- [multilineThreshold](#multilinethreshold)
- [notThrow](#notthrow)
- [pkg](#pkg)
- [titleLength](#titlelength)
- [usage](#usage)

## Properties

### args

• `Optional` **args**: _undefined_ \| _Record_<_string_, _string_\>

Name and description of positional arguments.

Defined in: [get-help.ts:23](https://github.com/ozum/meow-helper/blob/7ed921d/src/get-help.ts#L23)

---

### autoHelp

• `Optional` **autoHelp**: _undefined_ \| _boolean_

This option sets whether the `autoHelp` option of `meow` is used. If this is true, the description text is not added, because meow adds it automatically.

Defined in: [get-help.ts:31](https://github.com/ozum/meow-helper/blob/7ed921d/src/get-help.ts#L31)

---

### command

• `Optional` **command**: _undefined_ \| _string_

Name of the command.

Defined in: [get-help.ts:17](https://github.com/ozum/meow-helper/blob/7ed921d/src/get-help.ts#L17)

---

### description

• `Optional` **description**: _undefined_ \| _string_ \| _string_[]

Command description.

Defined in: [get-help.ts:19](https://github.com/ozum/meow-helper/blob/7ed921d/src/get-help.ts#L19)

---

### examples

• `Optional` **examples**: _undefined_ \| _string_ \| _string_[]

A single example or list of examples can be provided to show in the help text. Lines are prefixed with `$` and the command is colored automatically.

Defined in: [get-help.ts:27](https://github.com/ozum/meow-helper/blob/7ed921d/src/get-help.ts#L27)

---

### flags

• `Optional` **flags**: _undefined_ \| _Record_<_string_, StringFlag & { `desc`: _string_ } \| BooleanFlag & { `desc`: _string_ } \| NumberFlag & { `desc`: _string_ }\>

Flags provided to meow. Uses `desc` key for the description.

Defined in: [get-help.ts:25](https://github.com/ozum/meow-helper/blob/7ed921d/src/get-help.ts#L25)

---

### lineLength

• `Optional` **lineLength**: _undefined_ \| _number_

Text longer than line length will be word-wrapped.

Defined in: [get-help.ts:11](https://github.com/ozum/meow-helper/blob/7ed921d/src/get-help.ts#L11)

---

### multilineThreshold

• `Optional` **multilineThreshold**: _undefined_ \| _number_

If space available for option descriptions is less than this threshold, descriptions are given their own rows. So they have more space. See images above.

Defined in: [get-help.ts:29](https://github.com/ozum/meow-helper/blob/7ed921d/src/get-help.ts#L29)

---

### notThrow

• `Optional` **notThrow**: _undefined_ \| _boolean_

Whether to throw an error when `meow` exits with exit code 2. If true, it adds `process.on("exit")` to show help and exits with code 0.

Defined in: [get-help.ts:33](https://github.com/ozum/meow-helper/blob/7ed921d/src/get-help.ts#L33)

---

### pkg

• `Optional` **pkg**: _undefined_ \| _Record_<_string_, _any_\>

`package.json` data.

Defined in: [get-help.ts:15](https://github.com/ozum/meow-helper/blob/7ed921d/src/get-help.ts#L15)

---

### titleLength

• `Optional` **titleLength**: _undefined_ \| _number_

The total length of the colored background area of titles.

Defined in: [get-help.ts:13](https://github.com/ozum/meow-helper/blob/7ed921d/src/get-help.ts#L13)

---

### usage

• `Optional` **usage**: _undefined_ \| _string_ \| _string_[]

Uasge text is shown at the beginning of help text. Lines are prefixed with `$` and command is colored automatically.

Defined in: [get-help.ts:21](https://github.com/ozum/meow-helper/blob/7ed921d/src/get-help.ts#L21)
