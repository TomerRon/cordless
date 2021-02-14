<h1 align="center" style="border-bottom: none;">💃🤖 disco-bot</h1>
<h3 align="center">Opinionated framework for creating Discord bots with minimal boilerplate</h3>

**disco-bot** is a simple wrapper for [discord.js](https://github.com/discordjs/discord.js) that allows you to create extensive and extensible Discord bots.

```
yarn add disco-bot
npm i disco-bot
```

## Basic Usage

```ts
import { init, BotFunction } from 'disco-bot'

const ping: BotFunction = {
  condition: (msg) => msg.content === 'ping',
  callback: (msg) => msg.reply('pong'),
}

init({ functions: [ping] }).login(process.env.TOKEN)
```

## Contributing

Clone and install the dependencies:

```
git clone https://github.com/TomerRon/disco-bot.git
cd disco-bot
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
yalc add disco-bot
```

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
