### Components

You can add [Message Components](https://discord.com/developers/docs/interactions/message-components) to your interactions - these components include interactive buttons, URL buttons, modals, select menus, and more.

You can add components to a command by passing a `components` array.

⚠️ **Note!** If components are defined, they will be available to the handler and **must** be passed to the reply that should show the components, for example:

```ts
const example: BotCommand = {
  name: 'example',
  components: [ ... ],
  handler: ({ interaction, components }) =>
    interaction.reply({
      context: 'example',
      components,
    }),
}
```

#### Basic example

The following example is a simple "ping" command that also returns a success button that says "Ping again". When clicked, the button's handler is called.

```ts
import { BotCommand } from 'cordless'
import { ButtonStyle } from 'discord.js'

const ping: BotCommand = {
  name: 'ping',
  components: [
    {
      label: 'Ping again',
      style: ButtonStyle.Success,
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

#### Interactive Buttons

You can create an interactive button component by giving it a label, a handler, and an optional [button style](https://discord.com/developers/docs/interactions/message-components#button-object-button-styles). If a style is not provided, the default `PRIMARY` style will be used.

⚠️ **Note!** You cannot set an interactive button's style to `LINK` because that will turn it into a link button (see link buttons section below).

Example of a command with a primary button and danger button:

```ts
import { BotCommand } from 'cordless'
import { ButtonStyle } from 'discord.js'

const commandWithButtons: BotCommand = {
  components: [
    {
      label: 'Ping again',
      handler: ({ interaction }) => interaction.reply('Pong again!'),
    },
    {
      label: 'Delete',
      style: ButtonStyle.Danger,
      handler: doDangerousThings,
    },
  ],
  // ...
}
```

#### Link Buttons

You can create link buttons which redirect to the provided URL by defining a button component and giving it a style of `LINK`.

⚠️ **Note!** Link buttons do not receive a handler, instead they receive a URL.

```ts
{
  label: "Google",
  style: ButtonStyle.Link,
  url: "https://www.google.com",
}
```

You can also dynamically resolve a button's URL, synchronously or asynchronously, by passing a callback function. In the following example, a Wikipedia URL will be dynamically constructed with the given "input" option and "language" option:

```ts
{
  label: "Open Page",
  style: ButtonStyle.Link,
  url: ({ interaction }) => {
    const input = interaction.options.getString("input", true);
    const language = interaction.options.getString("language") || "en";

    return `https://${lang}.wikipedia.org/wiki/${input}`;
  },
},
```
