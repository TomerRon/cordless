### Setup

Setting up a Discord bot can be broken down to 3 steps:

- Create a bot in the Discord developer portal
- Generate a bot token
- Add the bot to a Discord server

#### Step 1: Create a bot

- Go to the [Discord developer portal](https://discord.com/developers/applications)
- Click on "New Application" and enter a name
- In your newly created application, click on "Bot" in the sidebar
- Click on "Add Bot"

#### Step 2: Generate a bot token

After creating your bot, click on "Reset Token" and confirm. You will then see the new token that was generated. Copy this token to your code (or hold onto it for now, if you didn't write any code yet).

```ts
init({
  // ...
  token: 'your.bot.token',
})
```

⚠️ **Important!** Do not share this token with anyone. It's best to store it in your environment variables and load it with [dotenv](https://github.com/motdotla/dotenv) or another env loader.

```ts
dotenv.config()

init({
  // ...
  token: process.env.BOT_TOKEN || '',
})
```

#### Step 3: Add the bot to a server

It's time to add your bot to its first server. You will need the "Manage Server" permissions in the server your bot will live in. For now, it's probably best to create a new server to test your bot on.

Now that you have a server, go back to your application page in the [Discord developer portal](https://discord.com/developers/applications).

- Click on "OAuth2" in the sidebar
- Click on "URL Generator" in the new sub-menu that appeared
- In the list of scopes, tick `applications.commands` and `bot`
- In the list of bot permissions, tick the relevant permissions for your bot, depending on what your bot will do. If you are using your own empty server to develop your bot, you can just tick "Administrator" for now to get all of the permissions
- Under "Generated URL", click on "Copy" to copy the generated URL and open it in a new tab
- Choose the server you'd like to add your bot to

#### Done!

You're all set to start developing your cordless bot.
