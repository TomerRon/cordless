### Subcommands

[Subcommands](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups) organize your commands by specifying actions within a command or group.

You can create a command with subcommands by passing a `subcommands` array.

There are some restrictions to keep in mind:

- A command can either have a handler or a list of subcommands, but not both.
- A subcommand **must** have a handler and cannot have its own subcommands. In other words, subcommands cannot be nested more than one level deep (according to the Discord API requirements).

#### Basic example

The following example adds `/define wiki` and `/define urban` commands:

```ts
const wikipedia: BotCommand = {
  name: 'wiki',
  // handler: ...
}

const urbandictionary: BotCommand = {
  name: 'urban',
  // handler: ...
}

const define: BotCommand = {
  name: 'define',
  subcommands: [wikipedia, urbandictionary],
}

init({
  // ...
  commands: [define],
})
```
