### Gateway Events

#### Default behavior

By default, bot functions react to `messageCreate` events, like in the following ping example:

```ts
const ping: BotFunction = {
  condition: (msg) => msg.content === 'ping',
  callback: (msg) => msg.reply('pong'),
}
```

#### Subscribing to other Gateway Events

You may need your functions to react to other events, for example:

- A user joined/left the server
- A message was deleted
- A new channel was created
- etc...

In these cases, you can subscribe your functions to other events by passing an `event` key.

For example, this function reacts to a new channel being created:

```ts
// TypeScript
const channelGreeter: BotFunction<'channelCreate'> = {
  event: 'channelCreate',
  condition: () => true,
  callback: async (channel) => {
    if (channel.isText()) {
      await channel.send(`Hello world! This is ${channel.name}`)
    }
  },
}
```

```ts
// JavaScript
const channelGreeter = {
  event: 'channelCreate',
  condition: () => true,
  callback: async (channel) => {
    if (channel.isText()) {
      await channel.send(`Hello world! This is ${channel.name}`)
    }
  },
}
```

#### Events and Intents

By default, cordless initializes the discord.js client with the [Gateway Intents](https://discord.com/developers/docs/topics/gateway#gateway-intents) `[GUILDS, GUILD_MESSAGES]`. When you start subscribing to other events, you may need to specify additional intents in your bot.

For more information, see: [docs/gateway-intents.md](gateway-intents.md)

#### Gateway Events reference

For a full list of Gateway Events, see: https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events
