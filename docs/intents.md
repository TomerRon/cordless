### Gateway Intents

By default, cordless initializes the discord.js client with the [Gateway Intents](https://discord.com/developers/docs/topics/gateway#gateway-intents) `[GUILDS, GUILD_MESSAGES]`. This should be sufficient for bots that only use command interactions, or bots that only subscribe to events like "messageCreate".

#### Overriding the default Gateway Intents

You can provide your own list of intents if you need additional functionality.

For example, let's say our bot has an event handler that should do something when a guild invite is created. We can look at the [Gateway Intents docs](https://discord.com/developers/docs/topics/gateway#gateway-intents) to see that the event we want, `INVITE_CREATE`, lives under the `GUILD_INVITES` intent.

Therefore, in order to subscribe our event handler to the `INVITE_CREATE` event, we will also have to specify the `GUILD_INVITES` intent:

```ts
import { Intents } from 'discord.js'

const inviteLogger: BotEventHandler<'inviteCreate'> = {
  event: 'inviteCreate',
  condition: () => true,
  callback: (invite) => {
    console.log(
      `Invite created by ${invite.inviter?.username}. Invite url: ${invite.url}`,
    )
  },
}

init({
  handlers: [
    inviteLogger,
    // ...
  ],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_INVITES,
  ],
  token: 'your.bot.token',
})
```

#### Gateway Intents reference

For more information about Gateway Intents, see:

- https://discord.com/developers/docs/topics/gateway#gateway-intents
- https://discordjs.guide/popular-topics/intents.html
