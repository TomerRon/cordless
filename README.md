[![cordless](assets/splash.png)](#)

<h3 align="center">Opinionated framework for creating Discord bots with minimal boilerplate</h3>
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

## Basic Usage

Follow [this guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) to create a Discord bot in the Discord developer portal.

TypeScript:

```ts
import { init, BotFunction } from 'cordless'

const ping: BotFunction = {
  condition: (msg) => msg.content === 'ping',
  callback: (msg) => msg.reply('pong'),
}

init({ functions: [ping] }).login('your.bot.token')
```

JavaScript:

```js
const cordless = require('cordless')

const ping = {
  condition: (msg) => msg.content === 'ping',
  callback: (msg) => msg.reply('pong'),
}

cordless.init({ functions: [ping] }).login('your.bot.token')
```

## Advanced Usage

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

### Using discord.js features

The `init` method returns a [discord.js Client](https://discord.js.org/#/docs/main/stable/class/Client).

Read the [discord.js documentation](https://discord.js.org/#/docs/main/master/general/welcome) for more information about using the client.

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

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('message', console.log)

client.login('your.bot.token')
```

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
