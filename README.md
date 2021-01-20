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

**TypeScript**

```ts
import getHelp, { commonFlags, chalk, cliui } from "meow-helper";
import type { ExtendedAnyFlags } from "meow-helper";
import { readFileSync } from "fs";
```

**CommonJS**

```js
const { default: getHelp, commonFlags, chalk, cliui } = require("meow-helper");
const { readFileSync } = require("fs");
```

```ts
const flags: ExtendedAnyFlags = { cwd: { alias: "c", type: "string", desc: "Current CWD." }, ...commonFlags };
const args = { "path...": "Paths of files." };
const pkg = JSON.parse(readFileSync(join(__dirname, "../package.json"), { encoding: "utf8" }));

meow(getHelp({ flags, args, pkg }), { flags, pkg, allowUnknownFlags: false });
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

### Type aliases

- [ExtendedAnyFlag](#extendedanyflag)
- [ExtendedAnyFlags](#extendedanyflags)

### Variables

- [cliui](#cliui)
- [commonFlags](#commonflags)

### Functions

- [default](#default)

## Type aliases

### ExtendedAnyFlag

Ƭ **ExtendedAnyFlag**: AnyFlag & { `desc`: _string_ }

Meow flag extended with `desc` key.

Defined in: [get-help.ts:7](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L7)

---

### ExtendedAnyFlags

Ƭ **ExtendedAnyFlags**: _Record_<_string_, [_ExtendedAnyFlag_](#extendedanyflag)\>

Record of extended any flag.

Defined in: [get-help.ts:10](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L10)

## Variables

### cliui

• `Const` **cliui**: _any_

Defined in: [index.ts:5](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/index.ts#L5)

---

### commonFlags

• `Const` **commonFlags**: [_ExtendedAnyFlags_](#extendedanyflags)

Very common flags

Defined in: [index.ts:12](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/index.ts#L12)

## Functions

### default

▸ **default**(`helpOptions`: [_HelpOptions_](#interfaceshelpoptionsmd)): _string_

Generate help text for meow.

#### Example

```typescript
const flags: ExtendedFlags = { cwd: { alias: "c", type: "string", desc: "Current CWD." }, ...commonFlags };
const args = { path: "Path of file." };

meow(getHelp({ flags, args, pkg }), { flags, pkg, allowUnknownFlags: false });
```

#### Parameters:

| Name          | Type                                      | Description |
| ------------- | ----------------------------------------- | ----------- |
| `helpOptions` | [_HelpOptions_](#interfaceshelpoptionsmd) | are options |

**Returns:** _string_

Defined in: [get-help.ts:156](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L156)

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

Defined in: [get-help.ts:27](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L27)

---

### autoHelp

• `Optional` **autoHelp**: _undefined_ \| _boolean_

This option sets whether the `autoHelp` option of `meow` is used. If this is true, the description text is not added, because meow adds it automatically.

Defined in: [get-help.ts:35](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L35)

---

### command

• `Optional` **command**: _undefined_ \| _string_

Name of the command.

Defined in: [get-help.ts:21](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L21)

---

### description

• `Optional` **description**: _undefined_ \| _string_ \| _string_[]

Command description.

Defined in: [get-help.ts:23](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L23)

---

### examples

• `Optional` **examples**: _undefined_ \| _string_ \| _string_[]

A single example or list of examples can be provided to show in the help text. Lines are prefixed with `$` and the command is colored automatically.

Defined in: [get-help.ts:31](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L31)

---

### flags

• `Optional` **flags**: _undefined_ \| _Record_<_string_, [_ExtendedAnyFlag_](#extendedanyflag)\>

Flags provided to meow. Uses `desc` key for the description.

Defined in: [get-help.ts:29](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L29)

---

### lineLength

• `Optional` **lineLength**: _undefined_ \| _number_

Text longer than line length will be word-wrapped.

Defined in: [get-help.ts:15](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L15)

---

### multilineThreshold

• `Optional` **multilineThreshold**: _undefined_ \| _number_

If space available for option descriptions is less than this threshold, descriptions are given their own rows. So they have more space. See images above.

Defined in: [get-help.ts:33](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L33)

---

### notThrow

• `Optional` **notThrow**: _undefined_ \| _boolean_

Whether to throw an error when `meow` exits with exit code 2. If true, it adds `process.on("exit")` to show help and exits with code 0.

Defined in: [get-help.ts:37](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L37)

---

### pkg

• `Optional` **pkg**: _undefined_ \| _Record_<_string_, _any_\>

`package.json` data.

Defined in: [get-help.ts:19](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L19)

---

### titleLength

• `Optional` **titleLength**: _undefined_ \| _number_

The total length of the colored background area of titles.

Defined in: [get-help.ts:17](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L17)

---

### usage

• `Optional` **usage**: _undefined_ \| _string_ \| _string_[]

Uasge text is shown at the beginning of help text. Lines are prefixed with `$` and command is colored automatically.

Defined in: [get-help.ts:25](https://github.com/ozum/meow-helper/blob/0c3e7ff/src/get-help.ts#L25)
