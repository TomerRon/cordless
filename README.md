[![cordless](assets/splash.png)](#)

<h3 align="center">Simple framework for creating Discord bots with minimal boilerplate</h3>
<p align="center">
  <a href="https://www.npmjs.com/package/cordless">
    <img alt="npm latest version" src="https://img.shields.io/npm/v/cordless/latest.svg">
  </a>
  <a href="https://travis-ci.com/TomerRon/cordless">
    <img alt="build status" src="https://travis-ci.com/TomerRon/cordless.svg?branch=master">
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
2. Write your first bot code:

```ts
// TypeScript
import { init, BotFunction } from 'cordless'

const ping: BotFunction = {
  condition: (msg) => msg.content === 'ping',
  callback: (msg) => msg.reply('pong'),
}

init({ functions: [ping] }).login('your.bot.token')
```

```js
// JavaScript
const cordless = require('cordless')

const ping = {
  condition: (msg) => msg.content === 'ping',
  callback: (msg) => msg.reply('pong'),
}

cordless.init({ functions: [ping] }).login('your.bot.token')
```

## Table of Contents

- [Advanced Usage](#advanced-usage)
  - [Subscribing to other Discord events](#subscribing-to-other-discord-events)
  - [Automatic documentation](#automatic-documentation)
  - [Share business logic with Context](#share-business-logic-with-context)
  - [Using discord.js features](#using-discordjs-features)
  - [Overriding the default Gateway Intents](#overriding-the-default-gateway-intents)
- [Local development](#local-development)
- [Special thanks](#special-thanks)
- [License](#license)

## Advanced Usage

### Subscribing to other Discord events

By default, bot functions respond to `messageCreate` events, like in the ping example above.

You can create functions that subscribe to other events by passing an `event` key.

For example, this function reacts to a new channel being created:

```ts
const channelGreeter: BotFunction<'channelCreate'> = {
  event: 'channelCreate',
  condition: () => true,
  callback: (channel) => {
    if (channel.isText()) {
      channel.send(`Hello world! This is ${channel.name}`)
    }
  },
}
```

Note: certain events, like `guildMemberAdd`, may require additional [Gateway Intents](https://discord.com/developers/docs/topics/gateway#gateway-intents) to work. See: [Overriding the default Gateway Intents](#overriding-the-default-gateway-intents)

### Automatic documentation

Auto-generate a help function for your bot by passing a `helpCommand`.
Make sure you give your functions a name and description if you want to use them with the generated help function.

For example, let's generate a `!help` command:

```ts
const ping: BotFunction = {
  name: 'ping',
  description: 'Responds to your ping with a pong!\n\nUsage: ping',
  condition: (msg) => msg.content === 'ping',
  callback: (msg) => msg.reply('pong'),
}

const client = init({
  functions: [ping],
  helpCommand: '!help',
})

client.login('your.bot.token')
```

Now your bot can respond to `!help`:

![Automatic documentation](https://i.imgur.com/kqBnZ5M.png)

### Share business logic with Context

You can share business logic and state between your different functions using context. By default, the context contains the `discord.js` client and the current list of functions.

For example, here is a function that uses context to display the number of functions available:

```ts
const numberOfFunctions: BotFunction = {
  condition: (msg) => msg.content === 'How many functions?',
  callback: (msg, context) => {
    msg.reply(`There are ${context.functions.length} functions.`)
  },
}
```

You can also extend the context with your own custom context.

Here's a basic implementation of state management - the `count` will be shared between function calls and its value will be persisted:

TypeScript:

```ts
const state = {
  count: 0,
  increment: () => {
    state.count++
  },
}

type MyCustomContext = {
  state: {
    count: number
    increment: () => void
  }
}

const counter: BotFunction<'messageCreate', MyCustomContext> = {
  condition: (msg) => msg.content === 'count',
  callback: (msg, context) => {
    context.state.increment()
    msg.reply(`The count is ${context.state.count}`)
  },
}

const client = init<MyCustomContext>({
  functions: [counter],
  context: { state },
})
```

JavaScript:

```js
const state = {
  count: 0,
  increment: () => {
    state.count++
  },
}

const counter = {
  condition: (msg) => msg.content === 'count',
  callback: (msg, context) => {
    context.state.increment()
    msg.reply(`The count is ${context.state.count}`)
  },
}

const client = cordless.init({
  functions: [counter],
  context: { state },
})
```

### Using discord.js features

The `init` method returns a [discord.js Client](https://discord.js.org/#/docs/main/stable/class/Client).

Read the [discord.js documentation](https://discord.js.org/#/docs) for more information about using the client.

```ts
const client = init({
  // ...
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('messageCreate', console.log)

client.login('your.bot.token')
```

### Overriding the default Gateway Intents

By default, cordless initializes the discord.js client with the [Gateway Intents](https://discord.com/developers/docs/topics/gateway#gateway-intents) `[GUILDS, GUILD_MESSAGES]`. This should be sufficient for most bots that simply need to receive messages and do something in response. You can provide your own list of intents if you need additional functionality.

For example, let's say we have a function that should log something when a guild invite is created, in addition to handling messages as usual. We will have to pass the `GUILD_INVITES` intent:

```ts
import { Intents } from 'discord.js'

const inviteLogger: BotFunction<'inviteCreate'> = {
  event: 'inviteCreate',
  condition: () => true,
  callback: (invite) => {
    console.log(
      `Invite created by ${invite.inviter?.username}. Invite url: ${invite.url}`,
    )
  },
}

init({
  functions: [
    inviteLogger,
    // ...
  ],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_INVITES,
  ],
}).login('your.bot.token')
```

For more information about Gateway Intents, see:

- https://discord.com/developers/docs/topics/gateway#gateway-intents
- https://discordjs.guide/popular-topics/intents.html

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

You must first create two bots and add them to a Discord server. One of the bots will run the cordless client, and the other bot will pretend to be a normal user.

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
