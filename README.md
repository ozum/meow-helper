# Synopsis

```ts
import getHelp, { chalk } from "meow-helper";
import { readFileSync } from "fs";
```

```js
const { default: getHelp, chalk } = require("meow-helper");
const { readFileSync } = require("fs");
```

```ts
const flags = {
  cwd: { alias: "c", type: "string", desc: "Current CWD." },
  verbose: { alias: "v", type: "boolean", desc: "Add extra info." },
};

const args = { path: "Path of file." };
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
  flags,
  examples: ["not-sync node_modules,dist,coverage", "not-sync node_modules,dist,coverage --ignoreConfigs .gitignore"],
  multilineThreshold: 50,
  autoHelp: true,
  notThrow: true,
});
```

# Details

Generates single line or multiline help text. Decides automatically based on the `multilineThreshold` option.

## Single-Line

![meow-helper help text in single line mode](./module-files/images/single-line.png)

## Multi-Line

![meow-helper help text in multi line mode](./module-files/images/multi-line.png)

# Highlights

- Nicely formats, colorized, and aligns arguments, options, default values and their descriptions.
- With the `allowUnknownFlags` option of meow, logs help if an unknown flag is provided. Also exits with code 0 instead of 2. Can be changed with the option `notThrow`.
- Supports maximum line length and automatic word wrap.
- Automatically split options into two lines if space for description is too small. (Can be changed with `multilineThreshold` option.)
- Automatically switches single line to multi-line, if space for options descriptions is less than the `multilineThreshold` option.
- Color output with background colored titles.
- Automatically generates usage section.
- Automatically colorize `command` in usage and examples if they start with command.
- Automatically adds `$` at the beginning of manually provided usage and examples sections.
- Also exports [chalk](https://www.npmjs.com/package/chalk) to be utilized by importing module without installing chalk.
- Supports both `{ autoHelp: true }` and `{ autoHelp: false }`. Adds description to help if required.

<!-- usage -->

<!-- commands -->

# API

<a name="readmemd"></a>

meow-helper

# meow-helper

## Table of contents

### Interfaces

- [HelpOptions](#interfaceshelpoptionsmd)

### Functions

- [default](#default)

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

Defined in: [get-help.ts:156](https://github.com/ozum/meow-helper/blob/a0ecbf0/src/get-help.ts#L156)

# Interfaces

<a name="interfaceshelpoptionsmd"></a>

[meow-helper](#readmemd) / HelpOptions

# Interface: HelpOptions

Options for generating a help text.

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

Defined in: [get-help.ts:23](https://github.com/ozum/meow-helper/blob/a0ecbf0/src/get-help.ts#L23)

---

### autoHelp

• `Optional` **autoHelp**: _undefined_ \| _boolean_

Whether the auto-help function of `meow` is used. If true description is not added, because meow adds it automatically.

Defined in: [get-help.ts:31](https://github.com/ozum/meow-helper/blob/a0ecbf0/src/get-help.ts#L31)

---

### command

• `Optional` **command**: _undefined_ \| _string_

Name of the command.

Defined in: [get-help.ts:17](https://github.com/ozum/meow-helper/blob/a0ecbf0/src/get-help.ts#L17)

---

### description

• `Optional` **description**: _undefined_ \| _string_ \| _string_[]

Command description.

Defined in: [get-help.ts:19](https://github.com/ozum/meow-helper/blob/a0ecbf0/src/get-help.ts#L19)

---

### examples

• `Optional` **examples**: _undefined_ \| _string_ \| _string_[]

A single example or list of examples. If lines start with the command, it will be colored automatically. Also prefixed with `$`.

Defined in: [get-help.ts:27](https://github.com/ozum/meow-helper/blob/a0ecbf0/src/get-help.ts#L27)

---

### flags

• `Optional` **flags**: _undefined_ \| _Record_<_string_, StringFlag & { `desc`: _string_ } \| BooleanFlag & { `desc`: _string_ } \| NumberFlag & { `desc`: _string_ }\>

Flags provided to meow. Uses `desc` key for the description.

Defined in: [get-help.ts:25](https://github.com/ozum/meow-helper/blob/a0ecbf0/src/get-help.ts#L25)

---

### lineLength

• `Optional` **lineLength**: _undefined_ \| _number_

Line length to be used. Longer text will be word-wrapped.

Defined in: [get-help.ts:11](https://github.com/ozum/meow-helper/blob/a0ecbf0/src/get-help.ts#L11)

---

### multilineThreshold

• `Optional` **multilineThreshold**: _undefined_ \| _number_

If space available for option descriptions is less than this threshold, descriptions are given their own rows. So they have more space. See images above.

Defined in: [get-help.ts:29](https://github.com/ozum/meow-helper/blob/a0ecbf0/src/get-help.ts#L29)

---

### notThrow

• `Optional` **notThrow**: _undefined_ \| _boolean_

Whether to throw an error when `meow` exists with exit code 2. If true, it adds `process.on("exit")` to show help and exits with code 0.

Defined in: [get-help.ts:33](https://github.com/ozum/meow-helper/blob/a0ecbf0/src/get-help.ts#L33)

---

### pkg

• `Optional` **pkg**: _undefined_ \| _Record_<_string_, _any_\>

`package.json` data.

Defined in: [get-help.ts:15](https://github.com/ozum/meow-helper/blob/a0ecbf0/src/get-help.ts#L15)

---

### titleLength

• `Optional` **titleLength**: _undefined_ \| _number_

The total length of the colored background area of titles.

Defined in: [get-help.ts:13](https://github.com/ozum/meow-helper/blob/a0ecbf0/src/get-help.ts#L13)

---

### usage

• `Optional` **usage**: _undefined_ \| _string_ \| _string_[]

A single usage or list of usages. If lines start with the command, it will be colored automatically. Also prefixed with `$`.

Defined in: [get-help.ts:21](https://github.com/ozum/meow-helper/blob/a0ecbf0/src/get-help.ts#L21)
