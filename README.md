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

```ts
import { init, BotFunction } from 'cordless'

const ping: BotFunction = {
  condition: (msg) => msg.content === 'ping',
  callback: (msg) => msg.reply('pong'),
}

init({ functions: [ping] }).login(process.env.TOKEN)
```

## Contributing

Clone and install the dependencies:

```
git clone https://github.com/TomerRon/cordless.git
cd cordless
yarn
```

Run the linter and tests:

```
yarn lint
yarn test
```

For local development, we recommend installing [yalc](https://github.com/wclr/yalc). Publish your changes locally with:

```
yalc publish
```

You can then test your changes in a local app using:

```
yalc add cordless
```

## Contributors

Huge shoutout to [fivenp](https://fivenp.com/) ([@fivenp](https://github.com/fivenp)) for the amazing visual assets. Go check out his work!

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
