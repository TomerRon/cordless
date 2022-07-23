[![cordless](assets/splash.png)](#)

<h3 align="center">Simple framework for creating Discord bots with minimal boilerplate</h3>
<p align="center">
  <a href="https://www.npmjs.com/package/cordless">
    <img alt="npm latest version" src="https://img.shields.io/npm/v/cordless/latest.svg">
  </a>
  <a href="https://app.travis-ci.com/github/TomerRon/cordless">
    <img alt="build status" src="https://api.travis-ci.com/TomerRon/cordless.svg?branch=master">
  </a>
  <a href="https://github.com/semantic-release/semantic-release">
    <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
  </a>
</p>

**cordless** is a simple wrapper for [discord.js](https://github.com/discordjs/discord.js) that allows you to create extensive and extensible Discord bots.

```
yarn add cordless
npm i cordless
```

## Quick Start

⏲️ Estimated time: **5 minutes**

1. Follow [docs/setup.md](docs/setup.md) to create a new bot in the Discord developer portal.
2. Write your first command and initialize your bot:

```ts
// TypeScript
import { BotCommand, init } from 'cordless'

const ping: BotCommand = {
  name: 'ping',
  handler: ({ interaction }) => interaction.reply('Pong!'),
}

init({ commands: [ping], token: 'your.bot.token' })
```

```js
// JavaScript
const cordless = require('cordless')

const ping = {
  name: 'ping',
  handler: ({ interaction }) => interaction.reply('Pong!'),
}

cordless.init({ commands: [ping], token: 'your.bot.token' })
```

You can also check out the [code samples](sample) for ready-to-go solutions. See: [sample/01-basic-typescript](sample/01-basic-typescript) or [sample/02-basic-javascript](sample/02-basic-javascript)

## Advanced Usage

#### Create advanced interactions

Cordless allows you to interface with the full [Discord Application Commands API](https://discord.com/developers/docs/interactions/application-commands) in a declarative fashion:

- Add interactive buttons and link buttons to your interactions. See: [docs/command-components.md](docs/command-components.md)
- Create CLI-like commands with arguments and pre-defined choices. See: [docs/command-options.md](docs/command-options.md)
- Nest commands within each other by creating subcommands. See: [docs/command-subcommands.md](docs/command-subcommands.md)
- Select menus: **_Coming soon!_**
- Autocomplete: **_Coming soon!_**
- Modals: **_Coming soon!_**

For a quick overview of the commands API, see: [docs/commands.md](docs/commands.md)

#### Subscribe to Gateway Events

Commands are the easiest way to let users interact with your bot, but sometimes you need to react to other events as they happen (for example: user joined the server, a message was deleted, etc). You can use the built-in event handlers to easily subscribe to any [Discord Gateway Event](https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events).

For example, let's say our bot needs to greet new text channels whenever they are created, expect for channels that start with `admin-`. We can subscribe an event handler to the `channelCreate` event:

```ts
// TypeScript
import { BotEventHandler } from 'cordless'
import { ChannelType } from 'discord.js'

const channelGreeter: BotEventHandler<'channelCreate'> = {
  event: 'channelCreate',
  condition: (channel) => !channel.name.startsWith('admin-'),
  callback: (channel) => {
    if (channel.type === ChannelType.GuildText) {
      return channel.send(`Hello world! This is ${channel.name}`)
    }
  },
}
```

See: [docs/events.md](docs/events.md)

#### Using discord.js features

The `init` method returns a logged-in [discord.js Client](https://discord.js.org/#/docs/main/stable/class/Client).

```ts
const client = await init({
  // ...
})

console.log(`Logged in as ${client.user.tag}!`)
```

See [discord.js documentation](https://discord.js.org/#/docs) for more information about using the client.

#### Context and State Management

You can share business logic and state between your different event handlers using context. By default, the context contains the `discord.js` client and the current list of event handlers. You can also extend the context with your own custom context to share additional business logic and even implement state management.

See: [docs/context.md](docs/context.md)

#### Override the default Gateway Intents

By default, cordless initializes the discord.js client with the [Gateway Intents](https://discord.com/developers/docs/topics/gateway#gateway-intents) `[GUILDS, GUILD_MESSAGES]`. This should be sufficient for bots that only use command interactions, or bots that only subscribe to events like "messageCreate". You can provide your own list of intents if you need additional functionality.

See: [docs/intents.md](docs/intents.md)

## Local development

Clone and install the dependencies:

```
git clone https://github.com/TomerRon/cordless.git
cd cordless
yarn
```

We recommend installing [yalc](https://github.com/wclr/yalc). Publish your changes locally with:

```
yalc publish
```

You can then test your changes in a local app using:

```
yalc add cordless
```

#### Unit tests

Run the unit tests:

```
yarn test
```

#### End-to-end tests

You must first create two bots and add them to a Discord server. One of the bots will run the cordless client, and the other bot will pretend to be a normal user. The cordless client bot must have the "Message Content Intent" enabled - you can enable it in the Discord Developer Dashboard, in your application's "Bot" page.

You'll need the tokens for both of the bots, and the channel ID of a channel where the bots can send messages.

Copy the `.env` file and edit it:

```
cp .example.env .env
```

```
# .env
E2E_CLIENT_TOKEN=some.discord.token
E2E_USER_TOKEN=some.discord.token
E2E_CHANNEL_ID=12345678
```

Run the e2e tests:

```
yarn e2e
```

## Special thanks

Huge shoutout to [fivenp](https://fivenp.com/) ([@fivenp](https://github.com/fivenp)) for the amazing visual assets. Go check out his work!

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
