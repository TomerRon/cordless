### Commands

Commands are the easiest way to let users interact with your bot. Cordless allow you to interface with the full [Discord Application Commands API](https://discord.com/developers/docs/interactions/application-commands) in a declarative fashion. You can enhance your commands with interactive buttons, modals, autocompletion, subcommands, and more.

#### Basic usage

You can declare a command by giving it a name and a handler:

```ts
// TypeScript
import { BotCommand } from 'cordless'

const ping: BotCommand = {
  name: 'ping',
  description: 'Reponds to your ping with a pong!', // optional
  handler: ({ interaction }) => interaction.reply('Pong!'),
}
```

```js
// JavaScript
const ping = {
  name: 'ping',
  description: 'Reponds to your ping with a pong!', // optional
  handler: ({ interaction }) => interaction.reply('Pong!'),
}
```

Register the command by passing it to the `init` method:

```ts
init({
  // ...
  commands: [ping],
  token: 'your.bot.token',
})
```

Your bot can now respond to the `/ping` command.

#### Components

You can add [Message Components](https://discord.com/developers/docs/interactions/message-components) to your interactions - these components include interactive buttons, link buttons, modals, select menus, and more.

For more information about using the components API, see: [docs/command-components.md](command-components.md)

```ts
const ping: BotCommand = {
  name: 'ping',
  components: [
    {
      label: 'Ping again',
      style: 'PRIMARY',
      handler: ({ interaction }) => interaction.reply('Pong again!'),
    },
  ],
  handler: ({ interaction, components }) =>
    interaction.reply({
      content: 'Pong!',
      components,
    }),
}
```

#### Options

You can allow your command to receive options (arguments) by adding an `options` array.

For more information about using the options API, see: [docs/command-options.md](command-options.md)

```ts
const commandWithOptions: BotCommand = {
  // ...
  options: [
    {
      type: 'INTEGER',
      name: 'num',
      required: true,
    },
    {
      type: 'STRING',
      name: 'language',
      choices: [
        {
          name: 'English',
          value: 'en',
        },
        {
          name: 'Deutsch',
          value: 'de',
        },
        {
          name: 'Français',
          value: 'fr',
        },
      ],
    },
  ],
  // ...
}
```

#### Subcommands

[Subcommands](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups) organize your commands by specifying actions within a command or group.

You can create a command with subcommands by passing a `subcommands` array.

For more information about using the subcommands API, see: [docs/command-subcommands.md](command-subcommands.md)
