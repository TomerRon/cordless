### Context and State Management

You can share business logic and state between your commands and event handlers using context.

In this document we will see how to use the default context, how to extend the context with your own custom context, and how to implement a basic state management solution in your bot.

#### Default context

By default, the context contains the `discord.js` client and the current list of event handlers.

For example, this `/about` command uses the `context.client` to describe the bot:

```ts
const about: BotCommand = {
  name: 'about',
  handler: ({ interaction, context }) => {
    const { client } = context

    return interaction.reply(
      `My name is ${client.user.username} and I live in ${client.guilds.cache.size} servers.`,
    )
  },
}
```

#### Custom context

You can extend the default context with your own custom context.

For example, here we are passing a simple `foo` string to our commands and event handlers:

```ts
// TypeScript
type MyCustomContext = {
  foo: string
}

const customContext: MyCustomContext = {
  foo: 'bar',
}

const getFoo: BotCommand<MyCustomContext> = {
  name: 'foo',
  handler: ({ interaction, context }) => {
    const { foo } = context

    return interaction.reply(`foo is ${foo}.`)
  },
}

init<MyCustomContext>({
  commands: [getFoo],
  context: customContext,
  token: 'your.bot.token',
})
```

```js
// JavaScript
const customContext = {
  foo: 'bar',
}

const getFoo = {
  name: 'foo',
  handler: ({ interaction, context }) => {
    const { foo } = context

    return interaction.reply(`foo is ${foo}.`)
  },
}

cordless.init({
  commands: [getFoo],
  context: customContext,
  token: 'your.bot.token',
})
```

#### State management

Consider the following basic state management solution. The "count" is persisted between interactions.

```ts
let count = 0

type CounterState = {
  getCount: () => number
  setCount: (callback: (prevCount: number) => number) => void
}

const state: CounterState = {
  getCount: () => count,
  setCount: (callback) => {
    count = callback(count)
  },
}

const getTheCount: BotCommand<CounterState> = {
  name: 'count',
  handler: ({ interaction, context: { getCount } }) =>
    interaction.reply(`The count is ${getCount()}`),
}

const increment: BotCommand<CounterState> = {
  name: 'increment',
  handler: ({ interaction, context: { getCount, setCount } }) => {
    setCount((c) => c + 1)

    return interaction.reply(`Okay. The count is now ${getCount()}`)
  },
}

init<CounterState>({
  commands: [getTheCount, increment],
  context: state,
  token: 'your.bot.token',
})
```
