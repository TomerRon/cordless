### Event Handlers and Gateway Events

Event handlers allow you to subscribe to any [Discord Gateway Event](https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events), such as:

- A user joined/left the server
- A message was deleted
- A new channel was created
- etc...

##### ⚠️ Important note regarding Message Content

As of Discord API v10, there are new requirements to be able to read message contents - for example, if you wish to subscribe to the `messageCreate` event.

For more information, see: [docs/intents.md#message-content-intent](intents.md#message-content-intent)

#### Basic example

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

```ts
// JavaScript
const channelGreeter = {
  event: 'channelCreate',
  condition: () => !channel.name.startsWith('admin-'),
  callback: async (channel) => {
    if (channel.type === ChannelType.GuildText) {
      return channel.send(`Hello world! This is ${channel.name}`)
    }
  },
}
```

We can then add this event handler to our bot on initialization:

```ts
init({
  // ...
  handlers: [channelGreeter],
  token: 'your.bot.token',
})
```

#### Events and Intents

By default, cordless initializes the discord.js client with the [Gateway Intents](https://discord.com/developers/docs/topics/gateway#gateway-intents) `[GUILDS, GUILD_MESSAGES]`. When you start subscribing to events, you may need to specify additional intents in your bot.

For more information, see: [docs/intents.md](intents.md)

#### Gateway Events reference

For a full list of Gateway Events, see: https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events
