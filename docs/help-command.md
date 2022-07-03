### Help command

You can specify a help command to generate a help function for your bot. This function will describe the different functions of your bot.

Enable the help function for your bot by passing a `helpCommand`:

```ts
init({
  functions: [...],
  helpCommand: '!help',
})
```

Make sure you give your functions a name and a description if you want to use them with the generated help function:

```ts
const ping: BotFunction = {
  name: 'ping',
  description: 'Responds to your ping with a pong!\n\nUsage: ping',
  condition: (msg) => msg.content === 'ping',
  callback: (msg) => msg.reply('pong'),
}
```

You can keep some of your functions secret by not giving them a name and a description. They will be listed as unnamed functions.

#### Full example

```ts
const ping: BotFunction = {
  name: 'ping',
  description: 'Responds to your ping with a pong!\n\nUsage: ping',
  condition: (msg) => msg.content === 'ping',
  callback: (msg) => msg.reply('pong'),
}

init({
  functions: [ping],
  helpCommand: '!help',
}).login('your.bot.token')
```

Now your bot can respond to `!help`:

![Automatic documentation](https://i.imgur.com/kqBnZ5M.png)
